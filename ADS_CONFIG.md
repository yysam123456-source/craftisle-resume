# Ads Configuration Guide

## Overview

This document explains how to enable/disable ads in the Craftisle Resume project. Ads are controlled via **build-time environment variables** that get baked into the static build output.

## Current Configuration

Ads are controlled by two environment variables:

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_PUBLIC_ADVER_ENABLE` | Master switch for all ads | `true` / `false` |
| `VITE_PUBLIC_ADSENSE_CLIENT` | Google AdSense client ID | `ca-pub-xxxxxxxxxxxxxxx` |

## How to Enable/Disable Ads

### Method: Edit `.env.local` (Currently Used)

The environment variables are read from `.env.local` in the project root.

**To disable ads:**
1. Open `.env.local`
2. Change `VITE_PUBLIC_ADVER_ENABLE=true` to `VITE_PUBLIC_ADVER_ENABLE=false`
3. Commit and push → Cloudflare Pages will auto-redeploy

**To enable ads:**
1. Open `.env.local`
2. Ensure `VITE_PUBLIC_ADVER_ENABLE=true` is set
3. Commit and push → Cloudflare Pages will auto-redeploy

---

## Ad Components Location

### Monetag Vignette Banner
- **File**: `apps/web/src/routes/__root.tsx` (lines 116-130)
- **Condition**: `import.meta.env.VITE_PUBLIC_ADVER_ENABLE === 'true'`
- **Script**: `/monetag-vignette.js` (placed in `apps/web/public/`)

### Google AdSense
- **File**: `apps/web/src/routes/__root.tsx` (lines 132-138)
- **Condition**: `import.meta.env.VITE_PUBLIC_ADSENSE_CLIENT` is truthy
- **Script**: Google AdSense auto-loads via `adsbygoogle.js`

---

## How to Verify Ads Are Working

After deployment, verify ads are injected:

```bash
# Check for Monetag script
curl -s https://resume.craftisle.com | grep -i "monetag-vignette"

# Check for AdSense script
curl -s https://resume.craftisle.com | grep -i "adsbygoogle"
```

Or manually:
1. Open `https://resume.craftisle.com`
2. Right-click → **View Page Source**
3. Search for `monetag-vignette` and `adsbygoogle`

---

## Important Notes

1. **Static export limitation**: Since this project uses Vite with `@tanstack/react-router`, environment variables are baked in at build time. Changing them requires a **rebuild**.
2. **No runtime config**: You cannot change ad settings without rebuilding and redeploying.
3. **Cloudflare cache**: After redeployment, wait ~30 seconds for cache to clear, or do a hard refresh (Cmd+Shift+R).
4. **Vite env var naming**: Must use `VITE_PUBLIC_*` prefix (not `NEXT_PUBLIC_*` like Next.js).

---

## Quick Reference

| Task | Action |
|------|--------|
| Disable all ads | Set `VITE_PUBLIC_ADVER_ENABLE=false` in `.env.local` → commit → push |
| Enable Monetag ads | Set `VITE_PUBLIC_ADVER_ENABLE=true` in `.env.local` → commit → push |
| Enable AdSense | Add `VITE_PUBLIC_ADSENSE_CLIENT=ca-pub-xxx` to `.env.local` |
| Verify ads injected | `curl https://resume.craftisle.com | grep monetag` |
| Force rebuild on Cloudflare | Dashboard → Deployments → Retry latest deployment |
