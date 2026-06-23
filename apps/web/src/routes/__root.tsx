import type { IconProps } from "@phosphor-icons/react";
import type { FeatureFlags } from "@reactive-resume/api/features/flags";
import type { AuthSession } from "@reactive-resume/auth/types";
import type { Locale } from "@reactive-resume/utils/locale";
import type { QueryClient } from "@tanstack/react-query";
import type { orpc } from "@/libs/orpc/client";
import type { Theme } from "@/libs/theme";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { IconContext } from "@phosphor-icons/react";
import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { useEffect, useMemo } from "react";
import { DirectionProvider } from "@reactive-resume/ui/components/direction";
import { Toaster } from "@reactive-resume/ui/components/sonner";
import { TooltipProvider } from "@reactive-resume/ui/components/tooltip";
import { DialogManager } from "@/dialogs/manager";
import { CommandPalette } from "@/features/command-palette";
import { ThemeProvider } from "@/features/theme/provider";
import { ConfirmDialogProvider } from "@/hooks/use-confirm";
import { PromptDialogProvider } from "@/hooks/use-prompt";
import { getSession } from "@/libs/auth/session";
import { getLocale, isRTL, loadLocale, localeMap } from "@/libs/locale";
import { client } from "@/libs/orpc/client";
import { getTheme } from "@/libs/theme";
import { getAdConfig } from "@/lib/config/ads";

type RouterContext = {
	theme: Theme;
	locale: Locale;
	orpc: typeof orpc;
	queryClient: QueryClient;
	session: AuthSession | null;
	flags: FeatureFlags;
};

const appName = "Craftisle Resume";
const tagline = "Free Resume Builder & CV Maker Online";
const title = `${appName} — ${tagline}`;
const description =
	"Create a professional resume in minutes with our free resume builder. 12+ ATS-friendly templates, PDF export, and AI-powered suggestions. No sign-up required.";

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	head: () => {
		const appUrl = typeof window !== "undefined" ? window.location.origin : "https://resume.craftisle.com";
		const canonicalUrl = typeof window !== "undefined" ? window.location.href : "https://resume.craftisle.com";
		const _pathname = typeof window !== "undefined" ? window.location.pathname : "/";

		const structuredData = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "SoftwareApplication",
					name: "Craftisle Resume",
					applicationCategory: "BusinessApplication",
					operatingSystem: "Web",
					description,
					offers: {
						"@type": "Offer",
						price: "0",
						priceCurrency: "USD",
					},
					url: appUrl,
					sameAs: ["https://github.com/craftisle/resume"],
				},
				{
					"@type": "Organization",
					name: "Craftisle",
					url: "https://craftisle.com",
					sameAs: ["https://github.com/craftisle"],
				},
				{
					"@type": "WebSite",
					url: appUrl,
					name: appName,
					potentialAction: {
						"@type": "SearchAction",
						target: `${appUrl}/?q={search_term_string}`,
						"query-input": "required name=search_term_string",
					},
				},
			],
		};

		// Generate hreflang links for all 55 supported locales
		const hreflangLinks = (Object.keys(localeMap) as string[]).map((locale) => ({
			rel: "alternate",
			hreflang: locale,
			href: appUrl,
		}));

		// x-default: fallback for unknown locales
		hreflangLinks.push({
			rel: "alternate",
			hreflang: "x-default",
			href: appUrl,
		});

		return {
			links: [
				// Icons
				{ rel: "icon", href: "/favicon.ico?v=2", type: "image/x-icon", sizes: "128x128" },
				{ rel: "icon", href: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "256x256 any" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png", type: "image/png", sizes: "180x180 any" },
				// Manifest
				{ rel: "manifest", href: "/manifest.webmanifest", crossOrigin: "use-credentials" },
				// Canonical
				{ rel: "canonical", href: canonicalUrl },
			],
			meta: [
				{ title },
				{ charSet: "UTF-8" },
				{ name: "description", content: description },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				// Meta Tags
				{ name: "theme-color", content: "#09090B" },
				{ name: "application-name", content: "Craftisle Resume" },
				{ name: "mobile-web-app-capable", content: "yes" },
				{ name: "apple-mobile-web-app-capable", content: "yes" },
				{ name: "apple-mobile-web-app-title", content: "Craftisle Resume" },
				{ name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
				// Twitter Tags
				{ property: "twitter:image", content: `${appUrl}/opengraph/banner.jpg` },
				{ property: "twitter:card", content: "summary_large_image" },
				{ property: "twitter:title", content: title },
				{ property: "twitter:description", content: description },
				// OpenGraph Tags
				{ property: "og:image", content: `${appUrl}/opengraph/banner.jpg` },
				{ property: "og:site_name", content: appName },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: appUrl },
				{ property: "og:type", content: "website" },
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(structuredData),
				},
			],
		};
	},
	beforeLoad: async () => {
		const isLocalOnly =
			typeof window !== "undefined" && !!(window as typeof globalThis & { __LOCAL_ONLY__?: boolean }).__LOCAL_ONLY__;

		const [theme, locale, session] = await Promise.all([getTheme(), getLocale(), getSession().catch(() => null)]);

		const flags = isLocalOnly
			? ({} as Record<string, unknown>)
			: await client.flags.get().catch(() => ({}) as Record<string, unknown>);

		try {
			await loadLocale(locale);
		} catch {
			// ignore locale load errors in local-only mode
		}

		return { theme, locale, session, flags };
	},
});

function RootComponent() {
	const { theme, locale, queryClient } = Route.useRouteContext();
	const dir = isRTL(locale) ? "rtl" : "ltr";

	const iconContextValue = useMemo<IconProps>(() => ({ size: 16, weight: "regular" }), []);

	useEffect(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = dir;
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [dir, locale, theme]);

	// Load ads - controlled by centralized config (craftisle-configs repo)
	useEffect(() => {
		getAdConfig().then((config) => {
			if (!config.enabled) return;

			// Load Monetag Vignette Banner
			if (config.monetag !== false) {
				const script = document.createElement("script");
				script.id = "monetag-vignette";
				script.src = "https://n6wxm.com/vignette.min.js";
				script.dataset.zone = "11117037";
				script.async = true;
				document.body.appendChild(script);
			}

			// Load Google AdSense (if configured)
			if (config.adsense && import.meta.env.VITE_ADSENSE_CLIENT_ID) {
				const adsense = document.createElement("script");
				adsense.async = true;
				adsense.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_ADSENSE_CLIENT_ID}`;
				adsense.crossOrigin = "anonymous";
				document.head.appendChild(adsense);
			}
		}).catch((err) => {
			console.warn('[ads] failed to load config:', err);
		});
	}, []);

	return (
		<>
			<HeadContent />

			<QueryClientProvider client={queryClient}>
				<MotionConfig reducedMotion="user">
					<LazyMotion features={domAnimation}>
						<I18nProvider i18n={i18n}>
							<IconContext.Provider value={iconContextValue}>
								<ThemeProvider theme={theme}>
									<HotkeysProvider>
										<DirectionProvider>
											<TooltipProvider>
												<ConfirmDialogProvider>
													<PromptDialogProvider>
														<Outlet />

														<DialogManager />
														<CommandPalette />
														<Toaster richColors position="bottom-right" />
													</PromptDialogProvider>
												</ConfirmDialogProvider>
											</TooltipProvider>
										</DirectionProvider>
									</HotkeysProvider>
								</ThemeProvider>
							</IconContext.Provider>
						</I18nProvider>
					</LazyMotion>
				</MotionConfig>
			</QueryClientProvider>
		</>
	);
}
