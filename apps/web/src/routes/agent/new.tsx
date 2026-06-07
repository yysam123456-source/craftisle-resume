import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { SimpleChat } from "./-components/simple-chat";

const searchSchema = z.object({ resumeId: z.string().optional() });

export const Route = createFileRoute("/agent/new")({
	component: RouteComponent,
	validateSearch: searchSchema,
});

function RouteComponent() {
	return (
		<div className="flex h-svh bg-background">
			<main className="grid min-w-0 flex-1 overflow-auto">
				<SimpleChat />
			</main>
		</div>
	);
}
