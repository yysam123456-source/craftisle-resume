import { t } from "@lingui/core/macro";
import { useParams } from "@tanstack/react-router";
import { debounce, isEqual } from "es-toolkit";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";
import type { ResumeData } from "@reactive-resume/schema/resume/data";
import { getResume, saveResume, setCurrentResumeId } from "@/libs/local-resume";

export type Resume = {
	id: string;
	name: string;
	slug: string;
	tags: string[];
	data: ResumeData;
	isLocked: boolean;
	updatedAt: Date;
	hasPassword?: boolean;
	isPublic?: boolean;
};

type ResumeStoreState = {
	resume: Resume | null;
	resumeId?: string;
	isReady: boolean;
};

type ResumeStoreActions = {
	initialize: (resume: Resume | null) => void;
	reset: () => void;
	replaceResumeDraft: (resume: Resume) => void;
	replaceResumeFromServer: (resume: Resume) => void;
	updateResumeData: (fn: (draft: WritableDraft<ResumeData>) => void) => void;
	patchResume: (fn: (draft: WritableDraft<Resume>) => void) => void;
	mergeResumeMetadata: (resume: Resume) => void;
};

type ResumeStore = ResumeStoreState & ResumeStoreActions;

type Runtime = {
	abortController: AbortController;
	queryClient?: QueryClient;
	hasPendingLocalChanges: boolean;
	isSaving: boolean;
	pendingResume?: Resume;
	syncErrorToastId?: string | number;
	syncResume: ReturnType<typeof debounce<(resume: Resume) => void>>;
	beforeUnloadHandler?: () => void;
};

type ResumeUpdateSubscriptionOptions = {
	resumeId?: string;
	onUpdate: () => Promise<void> | void;
	onError?: (error: unknown) => void;
};

const SAVE_DEBOUNCE_MS = 500;
const runtimes = new Map<string, Runtime>();

let lockedToastId: string | number | undefined;

function cloneResumeData(data: ResumeData): ResumeData {
	return structuredClone(data);
}

function cloneResume(resume: Resume): Resume {
	return { ...resume, data: cloneResumeData(resume.data) };
}

async function flushResumeSave(id: string) {
	const runtime = runtimes.get(id);
	if (!runtime || runtime.isSaving || !runtime.pendingResume) {
		return;
	}

	const submitted = runtime.pendingResume;
	runtime.pendingResume = undefined;
	runtime.isSaving = true;

	try {
		// 直接构造要保存的 resume 对象并写入 localStorage
		// 这样避免 getResume() / saveResume() 之间的引用混乱
		const raw = localStorage.getItem("craftisle-resumes");
		const resumes: Resume[] = raw ? JSON.parse(raw) : [];
		const idx = resumes.findIndex((r) => r.id === submitted.id);

		const toSave: Resume = {
			...submitted,
			updatedAt: new Date(),
		};

		if (idx >= 0) {
			resumes[idx] = toSave;
		} else {
			resumes.push(toSave);
		}

		localStorage.setItem("craftisle-resumes", JSON.stringify(resumes));

		const currentResume = useResumeStore.getState().resume;
		const currentDataStillMatchesSubmission =
			currentResume?.id === submitted.id && isEqual(currentResume.data, submitted.data);

		if (currentDataStillMatchesSubmission && !runtime.pendingResume) {
			runtime.hasPendingLocalChanges = false;
			useResumeStore.getState().replaceResumeFromServer(submitted);
		} else {
			runtime.hasPendingLocalChanges = true;
			useResumeStore.getState().mergeResumeMetadata(submitted);

			if (!runtime.pendingResume && currentResume?.id === submitted.id && !isEqual(currentResume.data, submitted.data)) {
				runtime.syncResume.cancel();
				runtime.pendingResume = { ...submitted, data: structuredClone(currentResume.data) };
			}
		}

		if (runtime.syncErrorToastId !== undefined) {
			toast.dismiss(runtime.syncErrorToastId);
			runtime.syncErrorToastId = undefined;
		}
	} catch (error: unknown) {
		runtime.pendingResume ??= submitted;
		runtime.hasPendingLocalChanges = true;
		runtime.syncErrorToastId = toast.error(t`Your latest changes could not be saved.`, {
			id: runtime.syncErrorToastId,
			duration: Number.POSITIVE_INFINITY,
		});
	} finally {
		runtime.isSaving = false;
		if (runtime.pendingResume && runtime.syncErrorToastId === undefined) void flushResumeSave(id);
	}
}

function queueResumeSave(resume: Resume) {
	const runtime = getRuntime(resume.id);
	runtime.pendingResume = cloneResume(resume);
	runtime.hasPendingLocalChanges = true;
	void flushResumeSave(resume.id);
}

function createRuntime(): Runtime {
	const abortController = new AbortController();

	const syncResume = debounce(
		(resume: Resume) => {
			queueResumeSave(resume);
		},
		SAVE_DEBOUNCE_MS,
		{ signal: abortController.signal },
	);

	const runtime: Runtime = {
		abortController,
		hasPendingLocalChanges: false,
		isSaving: false,
		syncResume,
	};

	if (typeof window !== "undefined") {
		runtime.beforeUnloadHandler = () => runtime.syncResume.flush();
		window.addEventListener("beforeunload", runtime.beforeUnloadHandler);
	}

	return runtime;
}

function getRuntime(id: string): Runtime {
	const existing = runtimes.get(id);
	if (existing) return existing;

	const runtime = createRuntime();
	runtimes.set(id, runtime);
	return runtime;
}

function cleanupRuntime(id: string) {
	const runtime = runtimes.get(id);
	if (!runtime) return;

	runtime.syncResume.flush();
	runtime.abortController.abort();

	if (runtime.beforeUnloadHandler && typeof window !== "undefined") {
		window.removeEventListener("beforeunload", runtime.beforeUnloadHandler);
	}

	runtimes.delete(id);
}

function syncCurrentResume(id: string) {
	const resume = useResumeStore.getState().resume;
	if (!resume || resume.id !== id) return;

	const isLocalOnly = typeof window !== "undefined" && !!(window as any).__LOCAL_ONLY__;
	if (isLocalOnly) {
		queueResumeSave(resume);
		return;
	}

	getRuntime(id).syncResume(resume);
}

export const useResumeStore = create<ResumeStore>()(
	immer((set, get) => ({
		resume: null,
		resumeId: undefined,
		isReady: false,

		initialize: (resume) => {
			set((state) => {
				state.resume = resume;
				state.resumeId = resume?.id;
				state.isReady = resume !== null;
			});
		},

		reset: () => {
			set((state) => {
				state.resume = null;
				state.resumeId = undefined;
				state.isReady = false;
			});
		},

		replaceResumeDraft: (resume) => {
			set((state) => {
				state.resume = resume;
				state.resumeId = resume.id;
				state.isReady = true;
			});
		},

		replaceResumeFromServer: (resume) => {
			set((state) => {
				state.resume = resume;
				state.resumeId = resume.id;
				state.isReady = true;
			});
		},

		patchResume: (fn) => {
			set((state) => {
				if (!state.resume) return;
				fn(state.resume as WritableDraft<Resume>);
			});
		},

		mergeResumeMetadata: (resume) => {
			set((state) => {
				if (!state.resume || state.resume.id !== resume.id) return;

				state.resume.name = resume.name;
				state.resume.slug = resume.slug;
				state.resume.tags = resume.tags;
				state.resume.isLocked = resume.isLocked;
				state.resume.updatedAt = resume.updatedAt;
				state.resume.hasPassword = resume.hasPassword;
				state.resume.isPublic = resume.isPublic;
			});
		},

		updateResumeData: (fn) => {
			const currentResume = get().resume;
			if (!currentResume) return;

			if (currentResume.isLocked) {
				lockedToastId = toast.error(t`This resume is locked and cannot be updated.`, {
					id: lockedToastId,
				});
				return;
			}

			set((state) => {
				if (!state.resume) return;
				fn(state.resume.data as WritableDraft<ResumeData>);
			});

			getRuntime(currentResume.id).hasPendingLocalChanges = true;
			syncCurrentResume(currentResume.id);
		},
	})),
);

export function useInitializeResumeStore() {
	return useResumeStore((state) => state.initialize);
}

function useResetResumeStore() {
	return useResumeStore((state) => state.reset);
}

export function useMergeResumeMetadata() {
	return useResumeStore((state) => state.mergeResumeMetadata);
}

export function usePatchResume() {
	return useResumeStore((state) => state.patchResume);
}

function useBuilderResumeSelector<T>(selector: (resume: Resume) => T): T | undefined {
	const params = useParams({ strict: false }) as { resumeId?: string };
	const resumeId = params.resumeId;

	return useResumeStore((state) => {
		if (!resumeId || !state.resume || state.resume.id !== resumeId) return undefined;
		return selector(state.resume);
	});
}

export function useCurrentBuilderResumeSelector<T>(selector: (resume: Resume) => T): T {
	const selected = useBuilderResumeSelector(selector);
	if (selected === undefined) throw new Error("Resume data is required before rendering this component.");
	return selected;
}

export function useResume(): Resume | undefined {
	return useBuilderResumeSelector((resume) => resume);
}

export function useCurrentResume(): Resume {
	const resume = useResume();
	if (!resume) throw new Error("Resume data is required before rendering this component.");
	return resume;
}

export function useResumeData(): ResumeData | undefined {
	return useBuilderResumeSelector((resume) => resume.data);
}

export function useUpdateResumeData() {
	const params = useParams({ strict: false }) as { resumeId?: string };
	const resumeId = params.resumeId;
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	return useCallback(
		(fn: (draft: WritableDraft<ResumeData>) => void) => {
			if (!resumeId) return;
			updateResumeData(fn);
		},
		[resumeId, updateResumeData],
	);
}

export function useResumeUpdateSubscription(_options: ResumeUpdateSubscriptionOptions) {
	useEffect(() => {
		return () => {};
	}, []);
}

export function useBuilderResumeUpdateSubscription() {
	const params = useParams({ strict: false }) as { resumeId?: string };
	const resumeId = params.resumeId;

	useResumeUpdateSubscription({
		resumeId,
		onUpdate: async () => {},
		onError: () => {},
	});
}

export function useResumeCleanup() {
	const params = useParams({ strict: false }) as { resumeId?: string };
	const resumeId = params.resumeId;
	const reset = useResetResumeStore();

	useEffect(() => {
		if (!resumeId) return;

		return () => {
			cleanupRuntime(resumeId);
			reset();
		};
	}, [resumeId, reset]);
}
