import type { ResumeMetadata } from "@/libs/local-resume";
import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import {
	CopySimpleIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, m } from "motion/react";
import { useMemo } from "react";
import { Button } from "@reactive-resume/ui/components/button";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteResume, updateResumeMetadata } from "@/libs/local-resume";
import { ResumeContextMenu } from "../menus/context-menu";
import { BaseCard } from "./base-card";
import { ResumeThumbnail } from "./resume-thumbnail";

type ResumeCardProps = {
	resume: ResumeMetadata;
};

type ResumeLockOverlayProps = {
	isLocked: boolean;
};

export function ResumeCard({ resume }: ResumeCardProps) {
	const { i18n } = useLingui();
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();
	const queryClient = useQueryClient();

	const updatedAt = useMemo(() => {
		try {
			const date = new Date(resume.updatedAt);
			if (isNaN(date.getTime())) return "Unknown date";
			return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(date);
		} catch {
			return "Unknown date";
		}
	}, [i18n.locale, resume.updatedAt]);

	const handleUpdate = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		openDialog("resume.update", resume);
	};

	const handleDuplicate = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		openDialog("resume.duplicate", resume);
	};

	const handleToggleLock = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!resume.isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});
			if (!confirmation) return;
		}

		updateResumeMetadata(resume.id, { isLocked: !resume.isLocked });
		void queryClient.invalidateQueries({ queryKey: ["resumes-local"] });
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});
		if (!confirmation) return;

		deleteResume(resume.id);
		void queryClient.invalidateQueries({ queryKey: ["resumes-local"] });
	};

	return (
		<ResumeContextMenu resume={resume}>
			<Link to="/builder/$resumeId" params={{ resumeId: resume.id }} className="cursor-default">
				<m.div
					className="will-change-transform"
					whileHover={{ y: -2, scale: 1.005 }}
					whileTap={{ scale: 0.998 }}
					transition={{ type: "spring", stiffness: 320, damping: 28 }}
				>
					<BaseCard
						title={resume.name}
						description={t`Last updated on ${updatedAt}`}
						tags={resume.tags}
						actions={
							<div className="flex items-center gap-0.5 rounded-md bg-background/60 px-1 py-0.5">
								<Button
									size="icon"
									variant="ghost"
									className="size-7 text-foreground/70 hover:bg-primary/15 hover:text-primary"
									disabled={resume.isLocked}
									onClick={handleUpdate}
									title={t`Update`}
								>
									<PencilSimpleLineIcon className="size-4" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="size-7 text-foreground/70 hover:bg-primary/15 hover:text-primary"
									onClick={handleDuplicate}
									title={t`Duplicate`}
								>
									<CopySimpleIcon className="size-4" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="size-7 text-foreground/70 hover:bg-primary/15 hover:text-primary"
									onClick={handleToggleLock}
									title={resume.isLocked ? t`Unlock` : t`Lock`}
								>
									{resume.isLocked ? <LockSimpleOpenIcon className="size-4" /> : <LockSimpleIcon className="size-4" />}
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="size-7 text-foreground/70 hover:bg-destructive/15 hover:text-destructive"
									disabled={resume.isLocked}
									onClick={handleDelete}
									title={t`Delete`}
								>
									<TrashSimpleIcon className="size-4" />
								</Button>
							</div>
						}
					>
						<ResumeThumbnail resume={resume} isLocked={resume.isLocked} />

						<ResumeLockOverlay isLocked={resume.isLocked} />
					</BaseCard>
				</m.div>
			</Link>
		</ResumeContextMenu>
	);
}

function ResumeLockOverlay({ isLocked }: ResumeLockOverlayProps) {
	return (
		<AnimatePresence>
			{isLocked && (
				<m.div
					key="resume-lock-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.6 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					className="absolute inset-0 flex items-center justify-center will-change-[opacity]"
				>
					<div className="flex items-center justify-center rounded-full bg-popover p-6">
						<LockSimpleIcon weight="thin" className="size-12 opacity-60" />
					</div>
				</m.div>
			)}
		</AnimatePresence>
	);
}
