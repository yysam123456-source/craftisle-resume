import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createNoindexFollowMeta } from "@/libs/seo";

export const Route = createFileRoute("/agent")({
	component: RouteComponent,
	head: () => ({
		meta: [createNoindexFollowMeta()],
	}),
});

function RouteComponent() {
	return <Outlet />;
}
