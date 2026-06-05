import { createRouter } from "@tanstack/react-router";
import { ErrorScreen } from "./components/layout/error-screen";
import { LoadingScreen } from "./components/layout/loading-screen";
import { NotFoundScreen } from "./components/layout/not-found-screen";
import { getSession } from "./libs/auth/session";
import { getLocale, loadLocale } from "./libs/locale";
import { client, orpc } from "./libs/orpc/client";
import { getQueryClient } from "./libs/query/client";
import { getTheme } from "./libs/theme";
import { routeTree } from "./routeTree.gen";

const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
	Promise.race([
		promise,
		new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
	]).catch(() => fallback);

export const getRouter = async () => {
	const isLocalOnly = typeof window !== "undefined" && !!(window as any).__LOCAL_ONLY__;
	const queryClient = getQueryClient();

	const [theme, locale, session] = await Promise.all([
		getTheme(),
		getLocale(),
		withTimeout(getSession(), 2000, null),
	]);

	const flags = isLocalOnly ? ({} as Record<string, unknown>) : await withTimeout(client.flags.get(), 2000, {} as Record<string, unknown>);

	await loadLocale(locale);

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultViewTransition: true,
		defaultStructuralSharing: true,
		defaultErrorComponent: ErrorScreen,
		defaultPendingComponent: LoadingScreen,
		defaultNotFoundComponent: NotFoundScreen,
		context: { orpc, queryClient, theme, locale, session, flags },
	});

	return router;
};
