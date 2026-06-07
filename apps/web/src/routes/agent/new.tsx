import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import z from "zod";
import { SimpleChat } from "./-components/simple-chat";

const searchSchema = z.object({ resumeId: z.string().optional() });

export const Route = createFileRoute("/agent/new")({
	component: RouteComponent,
	validateSearch: searchSchema,
});

function RouteComponent() {
	const { resumeId } = Route.useSearch();
	const navigate = useNavigate();

	const resumeData = useMemo(() => {
		if (!resumeId) return undefined;
		try {
			const raw = localStorage.getItem("craftisle-resumes");
			if (!raw) return undefined;
			const resumes = JSON.parse(raw) as Array<{ id: string; title?: string; data: unknown }>;
			const resume = resumes.find((r) => r.id === resumeId);
			return resume ?? undefined;
		} catch {
			return undefined;
		}
	}, [resumeId]);

	const handleClose = useCallback(() => {
		if (resumeId) {
			void navigate({ to: "/builder/$resumeId", params: { resumeId } });
		} else {
			void navigate({ to: "/" });
		}
	}, [resumeId, navigate]);

	return (
		<div className="flex h-svh bg-background">
			<main className="grid min-w-0 flex-1 overflow-auto">
				<SimpleChat resumeId={resumeId} resumeData={resumeData} onClose={handleClose} />
			</main>
		</div>
	);
}
