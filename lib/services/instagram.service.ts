/**
 * Instagram Basic Display API service.
 *
 * Flow:
 *  1. Use a long-lived access token (stored in INSTAGRAM_ACCESS_TOKEN env var).
 *  2. Fetch the user's media via GET /me/media.
 *  3. Cache the result in-memory for CACHE_TTL_MS to avoid hitting rate limits.
 *
 * Docs: https://developers.facebook.com/docs/instagram-basic-display-api
 *
 * IMPORTANT: All calls are server-side only. The access token is NEVER exposed
 * to the client — this service is only imported inside API routes or Server Components.
 *
 * Access token refresh:
 *  Long-lived tokens expire after 60 days. You should call refreshToken() from a
 *  scheduled job (e.g., Vercel Cron) to keep it valid.
 */

const BASE_URL = 'https://graph.instagram.com';
const FIELDS = 'id,media_type,media_url,thumbnail_url,permalink,timestamp,caption';
const MEDIA_LIMIT = 9; // number of posts to show in the grid
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ── Types ─────────────────────────────────────────────────────────────────────

export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface InstagramPost {
  id: string;
  media_type: MediaType;
  /** Direct URL to the image (or video thumbnail for VIDEO type) */
  media_url: string;
  /** Thumbnail URL — only present for VIDEO type */
  thumbnail_url?: string;
  /** Link to the post on instagram.com */
  permalink: string;
  timestamp: string;
  caption?: string;
}

interface InstagramMediaResponse {
  data: InstagramPost[];
  paging?: { cursors: { before: string; after: string } };
}

// ── In-memory cache ───────────────────────────────────────────────────────────

let cachedPosts: InstagramPost[] | null = null;
let cacheExpiresAt = 0;

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Fetch the latest Instagram posts for the authenticated user.
 * Results are cached in-memory for 1 hour to minimise API calls.
 *
 * @returns Array of InstagramPost objects, or empty array on error/no token.
 */
export async function getInstagramFeed(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.warn('[Instagram] INSTAGRAM_ACCESS_TOKEN is not set. Feed will be empty.');
    return [];
  }

  // Return cached data if still valid
  if (cachedPosts && Date.now() < cacheExpiresAt) {
    return cachedPosts;
  }

  try {
    const url = new URL(`${BASE_URL}/me/media`);
    url.searchParams.set('fields', FIELDS);
    url.searchParams.set('limit', String(MEDIA_LIMIT));
    url.searchParams.set('access_token', token);

    const res = await fetch(url.toString(), {
      // Next.js fetch cache: revalidate every hour on the server side as well
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Instagram] API error:', err);
      return cachedPosts ?? []; // Return stale cache if available
    }

    const json: InstagramMediaResponse = await res.json();
    const posts = json.data ?? [];

    // Update cache
    cachedPosts = posts;
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;

    return posts;
  } catch (err) {
    console.error('[Instagram] Fetch failed:', err);
    return cachedPosts ?? [];
  }
}

/**
 * Refresh the long-lived access token before it expires (60-day TTL).
 * Call from a scheduled job (e.g., monthly Vercel Cron).
 *
 * @returns The new access token string, or null on failure.
 */
export async function refreshInstagramToken(): Promise<string | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const url = new URL(`${BASE_URL}/refresh_access_token`);
    url.searchParams.set('grant_type', 'ig_refresh_token');
    url.searchParams.set('access_token', token);

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error('[Instagram] Token refresh failed:', await res.text());
      return null;
    }

    const data: { access_token: string; token_type: string; expires_in: number } = await res.json();
    console.log(`[Instagram] Token refreshed. Expires in ${data.expires_in}s`);
    return data.access_token;
  } catch (err) {
    console.error('[Instagram] Token refresh error:', err);
    return null;
  }
}
