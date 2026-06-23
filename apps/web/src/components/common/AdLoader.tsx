'use client';

import { useEffect, useState } from 'react';
import { isAdsEnabled, isAdsEnabledSync } from '@/lib/config/ads';

/**
 * AdLoader for Vite/React projects.
 * Dynamically injects ad <script> tags into the document.
 */
export function AdLoader() {
  const [adsEnabled, setAdsEnabled] = useState(isAdsEnabledSync());

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const enabled = await isAdsEnabled();
      if (!cancelled) {
        setAdsEnabled(enabled);
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  // Inject ad scripts when enabled
  useEffect(() => {
    if (!adsEnabled) return;

    const injectScript = (id: string, src: string) => {
      if (document.getElementById(id)) return;
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    // Monetag Vignette Banner
    injectScript('monetag-vignette', '/monetag-vignette.js');

    return () => {
      // Cleanup on disable
      const s = document.getElementById('monetag-vignette');
      if (s) s.remove();
    };
  }, [adsEnabled]);

  return null;
}
