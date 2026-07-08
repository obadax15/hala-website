/**
 * GET /api/instagram/feed
 *
 * Server-side proxy for the Instagram Basic Display API.
 * The access token is kept secret on the server — never exposed to the client.
 *
 * Response: JSON array of InstagramPost objects.
 * Cache: CDN-cacheable for 1 hour via Cache-Control header.
 */

import { NextResponse } from 'next/server';
import { getInstagramFeed } from '@/lib/services/instagram.service';

export const dynamic = 'force-dynamic'; // Always run server-side (no static cache)

export async function GET() {
  try {
    const posts = await getInstagramFeed();

    return NextResponse.json(
      { posts },
      {
        status: 200,
        headers: {
          // Allow CDN/browser to cache the response for 1 hour
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('[/api/instagram/feed] Unexpected error:', err);
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
