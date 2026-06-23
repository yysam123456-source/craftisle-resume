/**
 * Centralized ad configuration for craftisle-resume
 * Supports remote config control via craftisle-configs repo
 */

// ========== Hardcoded fallback ==========
// Used when remote config is unavailable
export const ADS_ENABLED = true;

// ========== Monetag config ==========
export const MONETAG_ENABLED = true;
export const MONETAG_ZONE_ID = '11117037';
export const MONETAG_SCRIPT_URL = 'https://n6wxm.com/vignette.min.js';

// ========== AdSense config ==========
// TODO: fill in your real AdSense client ID
export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
export const ADSENSE_ENABLED = !!import.meta.env.VITE_ADSENSE_CLIENT_ID;

// ========== Remote unified control ==========
// Set to true to fetch ad config from craftisle-configs repo
export const USE_REMOTE_CONFIG = true;

// Central config URL - all projects read from this same file
export const ADS_REMOTE_URL =
  'https://raw.githubusercontent.com/yysam123456-source/craftisle-configs/main/configs/ads-config.json';

// ========== Runtime control ==========
// Fetches remote config and merges with local settings
export async function loadAdConfig(): Promise<{ enabled: boolean; monetag?: boolean; adsense?: boolean }> {
  // Check localStorage override first (for local testing)
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('ads_override');
    if (override === 'false') return { enabled: false };
    if (override === 'true') return { enabled: true };
  }

  // Use hardcoded value if remote is disabled
  if (!USE_REMOTE_CONFIG) {
    return {
      enabled: ADS_ENABLED,
      monetag: MONETAG_ENABLED,
      adsense: ADSENSE_ENABLED,
    };
  }

  // Fetch remote config
  try {
    const res = await fetch(ADS_REMOTE_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.json();
    return {
      enabled: remote.enabled ?? ADS_ENABLED,
      monetag: remote.monetag ?? MONETAG_ENABLED,
      adsense: remote.adsense ?? ADSENSE_ENABLED,
    };
  } catch (err) {
    console.warn('[ads] failed to load remote config, using hardcoded:', err);
    return {
      enabled: ADS_ENABLED,
      monetag: MONETAG_ENABLED,
      adsense: ADSENSE_ENABLED,
    };
  }
}

// ========== Cache ==========
let cachedConfig: { enabled: boolean; monetag?: boolean; adsense?: boolean; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAdConfig(): Promise<{ enabled: boolean; monetag?: boolean; adsense?: boolean }> {
  if (
    cachedConfig &&
    Date.now() - cachedConfig.fetchedAt < CACHE_TTL
  ) {
    return { enabled: cachedConfig.enabled, monetag: cachedConfig.monetag, adsense: cachedConfig.adsense };
  }
  const config = await loadAdConfig();
  cachedConfig = { ...config, fetchedAt: Date.now() };
  return config;
}
