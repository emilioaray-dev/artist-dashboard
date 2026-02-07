import { AUDIO_CDN_URLS } from "@/lib/audio-urls";
import { NextRequest } from "next/server";

/**
 * Audio proxy route — streams audio from CDN without exposing the
 * origin URL to the client.
 *
 * Anti-download measures:
 * - Content-Disposition: inline (browser plays, not downloads)
 * - No CDN URL exposed in client-side code or network waterfall
 * - Range request support for seeking without full download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cdnUrl = AUDIO_CDN_URLS[id];

  if (!cdnUrl) {
    return new Response(JSON.stringify({ error: "Track not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Forward range header for seeking support
  const rangeHeader = request.headers.get("range");
  const headers: HeadersInit = {};
  if (rangeHeader) {
    headers["Range"] = rangeHeader;
  }

  const cdnResponse = await fetch(cdnUrl, { headers });

  if (!cdnResponse.ok && cdnResponse.status !== 206) {
    return new Response(JSON.stringify({ error: "Failed to fetch audio" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "audio/mpeg");
  responseHeaders.set("Content-Disposition", "inline");
  responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Accept-Ranges", "bytes");

  // Forward content-range for partial responses
  const contentRange = cdnResponse.headers.get("content-range");
  if (contentRange) {
    responseHeaders.set("Content-Range", contentRange);
  }

  const contentLength = cdnResponse.headers.get("content-length");
  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  return new Response(cdnResponse.body, {
    status: cdnResponse.status,
    headers: responseHeaders,
  });
}
