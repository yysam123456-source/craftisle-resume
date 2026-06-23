/**
 * Centralized ad configuration for craftisle-resume
 * Supports remote config control via craftisle-configs repo
 */

// ========== Hardcoded fallback ==========
// Used when remote config is unavailable
export const ADS_ENABLED = true;

// ========== Remote unified control ==========
// Set to true to fetch ad config from craftisle-configs repo
export const USE_REMOTE_CONFIG = true;

// Central config URL - all projects read from this same file
export const ADS_REMOTE_URL =
  'https://raw.githubusercontent.com/yysam123456-source/craftisle-configs/main/configs/ads-config.json';

// ========== AdSense config (for this project) ==========
// These will be overridden by remote config if USE_REMOTE_CONFIG = true
// TODO: move these to remote config or env vars
export const ADSENSE_CLIENT_ID = 'ca-pub-xxxxxxxxxxxxx'; // TODO: fill in your AdSense client ID
export const ADSENSE_SLOTS = {
  leaderboard: '1234567890',
  rectangle: '1234567891',
  skyscraper: '1234567892',
};

// ========== Runtime control ==========
// Fetches remote config and merges with local settings
export async function loadAdConfig(): Promise<{ enabled: boolean }> {
  // Check localStorage override first (for local testing)
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('ads_override');
    if (override === 'false') return { enabled: false };
    if (override === 'true') return { enabled: true };
  }

  // Use hardcoded value if remote is disabled
  if (!USE_REMOTE_CONFIG) {
    return { enabled: ADS_ENABLED };
  }

  // Fetch remote config
  try {
    const res = await fetch(ADS_REMOTE_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.json();
    return {
      enabled: remote.enabled ?? ADS_ENABLED,
    };
  } catch (err) {
    console.warn('[ads] failed to load remote config, using hardcoded:', err);
    return { enabled: ADS_ENABLED };
  }
}

// ========== Cache ==========
let cachedConfig: { enabled: boolean; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAdConfig(): Promise<{ enabled: boolean }> {
  if (
    cachedConfig &&
    Date.now() - cachedConfig.fetchedAt < CACHE_TTL
  ) {
    return { enabled: cachedConfig.enabled };
  }
  const config = await loadAdConfig();
  cachedConfig = { ...config, fetchedAt: Date.now() };
  return config;
}
