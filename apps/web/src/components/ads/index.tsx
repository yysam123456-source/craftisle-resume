import { Trans } from "@lingui/react/macro";
import { useEffect, useMemo, useRef } from "react";

/**
 * AdSense env vars (set in Cloudflare Pages build env):
 *  VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxx
 *  VITE_ADSENSE_SLOT_LEADERBOARD=1234567890   (728x90)
 *  VITE_ADSENSE_SLOT_RECTANGLE=1234567891       (300x250)
 *  VITE_ADSENSE_SLOT_SKYSCRAPER=1234567892    (160x600)
 *
 * Local dev: add to .env.local
 */

type AdSize = "leaderboard" | "rectangle" | "skyscraper" | "responsive";

type AdProps = {
	size?: AdSize;
	className?: string;
};

const sizeMap = {
	leaderboard: { width: 728, height: 90 },
	rectangle: { width: 300, height: 250 },
	skyscraper: { width: 160, height: 600 },
	responsive: { width: "100%", height: "auto" },
} as const;

/** Check if AdSense is configured (client ID present) */
function isAdsenseConfigured(): boolean {
	const env = (import.meta as { env?: Record<string, string> }).env;
	return !!env?.VITE_ADSENSE_CLIENT_ID;
}

/** Get the ad slot ID for a given size */
function getSlotId(size: AdSize): string | undefined {
	const env = (import.meta as { env?: Record<string, string> }).env;
	if (!env) return undefined;
	switch (size) {
		case "leaderboard":
			return env.VITE_ADSENSE_SLOT_LEADERBOARD;
		case "rectangle":
			return env.VITE_ADSENSE_SLOT_RECTANGLE;
		case "skyscraper":
			return env.VITE_ADSENSE_SLOT_SKYSCRAPER;
		default:
			return env.VITE_ADSENSE_SLOT_RECTANGLE ?? env.VITE_ADSENSE_SLOT_LEADERBOARD;
	}
}

/**
 * Load AdSense script once.
 * Pushes the ad unit to adsbygoogle queue after script loads.
 */
function useAdsenseScript(): boolean {
	const loaded = useRef(false);
	const env = (import.meta as { env?: Record<string, string> }).env;
	const clientId = env?.VITE_ADSENSE_CLIENT_ID;

	useEffect(() => {
		if (!clientId || loaded.current) return;
		loaded.current = true;

		// Skip if script already exists
		if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

		const script = document.createElement("script");
		script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
		script.async = true;
		script.crossOrigin = "anonymous";
		document.head.appendChild(script);
	}, [clientId]);

	return !!clientId;
}

/**
 * AdBanner — renders a real AdSense ad unit when configured.
 * When VITE_ADSENSE_CLIENT_ID is not set, renders nothing in prod
 * or a placeholder in dev (localhost).
 */
export function AdBanner({ size = "responsive", className }: AdProps) {
	const dims = useMemo(() => sizeMap[size], [size]);
	const configured = isAdsenseConfigured();
	const slotId = getSlotId(size);
	const scriptReady = useAdsenseScript();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!configured || !scriptReady || !containerRef.current) return;
		// Push ad to adsbygoogle queue (idempotent)
		try {
			const win = window as unknown as { adsbygoogle?: { push: (el: HTMLElement) => void }[] };
			if (!win.adsbygoogle) {
				win.adsbygoogle = [];
			}
			win.adsbygoogle.push(containerRef.current);
		} catch {
			// AdSense not ready yet — will retry on next render
		}
	}, [configured, scriptReady]);

	// Not configured: render nothing in production, placeholder in dev
	if (!configured) {
		const isDev =
			typeof window !== "undefined" && (window as { location?: Location }).location?.hostname === "localhost";
		if (!isDev) return null;
		// Dev placeholder
		return (
			<div
				className={`flex items-center justify-center border border-border/50 border-dashed bg-muted/30 text-muted-foreground text-sm ${className}`}
				style={{
					width: typeof dims.width === "number" ? `${dims.width}px` : dims.width,
					height: typeof dims.height === "number" ? `${dims.height}px` : dims.height,
					minHeight: size === "responsive" ? "90px" : `${dims.height}px`,
					maxWidth: "100%",
				}}
			>
				<span className="select-none">
					<Trans>Advertisement</Trans> · {size}
				</span>
			</div>
		);
	}

	const clientId = (import.meta as { env: Record<string, string> }).env.VITE_ADSENSE_CLIENT_ID;

	return (
		<div ref={containerRef} className={className}>
			<ins
				className="adsbygoogle"
				style={{
					display: "block",
					width: typeof dims.width === "number" ? `${dims.width}px` : dims.width,
					height: typeof dims.height === "number" ? `${dims.height}px` : dims.height,
					minHeight: size === "responsive" ? "90px" : undefined,
					maxWidth: "100%",
				}}
				data-ad-client={clientId}
				data-ad-slot={slotId}
				data-ad-format={size === "responsive" ? "auto" : undefined}
				data-full-width-responsive={size === "responsive" ? "true" : undefined}
			/>
		</div>
	);
}

/**
 * In-feed / native-style ad card placeholder.
 * Only renders when AdSense is configured.
 */
export function AdCard({ className }: { className?: string }) {
	if (!isAdsenseConfigured()) return null;

	return (
		<div
			className={`flex flex-col gap-2 rounded-lg border border-border/50 border-dashed bg-muted/20 p-4 ${className}`}
		>
			<div className="text-muted-foreground text-xs uppercase tracking-wider">
				<Trans>Sponsored</Trans>
			</div>
			<div className="font-medium text-sm">
				<Trans>Advertisement</Trans>
			</div>
		</div>
	);
}
