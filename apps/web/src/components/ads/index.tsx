import { Trans } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAdConfig } from "@/lib/config/ads";

/**
 * AdSize types and props
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

/** Get AdSense config from centralized config or env vars */
function getAdsenseConfig(): { clientId?: string; slots?: Record<string, string> } {
	// Priority: centralized config > env vars
	const win = window as unknown as { __ADS_CONFIG__?: { clientId?: string; slots?: Record<string, string> } };
	if (win.__ADS_CONFIG__) {
		return win.__ADS_CONFIG__;
	}
	// Fallback to env vars (for backward compatibility)
	const env = (import.meta as { env?: Record<string, string> }).env;
	return {
		clientId: env?.VITE_ADSENSE_CLIENT_ID,
		slots: {
			leaderboard: env?.VITE_ADSENSE_SLOT_LEADERBOARD ?? '',
			rectangle: env?.VITE_ADSENSE_SLOT_RECTANGLE ?? '',
			skyscraper: env?.VITE_ADSENSE_SLOT_SKYSCRAPER ?? '',
		},
	};
}

/** Check if AdSense is configured and enabled */
function useAdsEnabled(): boolean {
	const [enabled, setEnabled] = useState<boolean>(() => {
		// Check centralized config first
		const win = window as unknown as { __ADS_ENABLED__?: boolean };
		if (typeof win.__ADS_ENABLED__ === 'boolean') return win.__ADS_ENABLED__;
		// Fallback: check if AdSense is configured
		const config = getAdsenseConfig();
		return !!config.clientId;
	});

	useEffect(() => {
		// Load centralized config
		getAdConfig().then((config) => {
			const win = window as unknown as { __ADS_ENABLED__?: boolean };
			win.__ADS_ENABLED__ = config.enabled;
			setEnabled(config.enabled);
		}).catch(() => {
			// If remote config fails, check local config
			const config = getAdsenseConfig();
			setEnabled(!!config.clientId);
		});
	}, []);

	return enabled;
}

/**
 * Load AdSense script once.
 * Reads config from centralized config or env vars.
 */
function useAdsenseScript(): boolean {
	const loaded = useRef(false);
	const config = getAdsenseConfig();
	const clientId = config.clientId;

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
 * AdBanner — renders a real AdSense ad unit when configured and enabled.
 * Reads centralized config for on/off control.
 */
export function AdBanner({ size = "responsive", className }: AdProps) {
	const dims = useMemo(() => sizeMap[size], [size]);
	const enabled = useAdsEnabled();
	const config = getAdsenseConfig();
	const slotId = config.slots?.[size] ?? '';
	const scriptReady = useAdsenseScript();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!enabled || !scriptReady || !containerRef.current) return;
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
	}, [enabled, scriptReady]);

	// Not enabled or not configured: render nothing in production, placeholder in dev
	if (!enabled || !config.clientId) {
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
					<Trans>Advertisement</Trans> · {size} {!enabled && "(disabled)"}
				</span>
			</div>
		);
	}

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
				data-ad-client={config.clientId}
				data-ad-slot={slotId}
				data-ad-format={size === "responsive" ? "auto" : undefined}
				data-full-width-responsive={size === "responsive" ? "true" : undefined}
			/>
		</div>
	);
}

/**
 * In-feed / native-style ad card placeholder.
 * Only renders when AdSense is configured and enabled.
 */
export function AdCard({ className }: { className?: string }) {
	const enabled = useAdsEnabled();
	const config = getAdsenseConfig();

	if (!enabled || !config.clientId) return null;

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
