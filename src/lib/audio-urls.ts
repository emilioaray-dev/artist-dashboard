/**
 * Server-side audio URL mapping.
 *
 * CDN URLs are kept exclusively on the server to prevent
 * users from discovering direct download links via browser
 * DevTools network tab or page source. The client only ever
 * sees `/api/audio/<release_id>` which streams the audio
 * through our proxy with anti-download headers.
 */

const CDN_BASE = "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev";

export const AUDIO_CDN_URLS: Record<string, string> = {
  rel_001: `${CDN_BASE}/Nul%20Tiel%20Records%20-%20Jeopardy.mp3`,
  rel_002: `${CDN_BASE}/Nul%20Tiel%20Records%20-%20Payload.mp3`,
  rel_003: `${CDN_BASE}/Nul%20Tiel%20Records%20-%20Portamento.mp3`,
  rel_004: `${CDN_BASE}/Nul%20Tiel%20Records%20-%20Anemoia.mp3`,
  rel_005: `${CDN_BASE}/Nul%20Tiel%20Records%20-%20Fault%20Line.mp3`,
  rel_006: `${CDN_BASE}/Nul%20Tiel%20Records%20-%20Glass%20Ceiling.mp3`,
};
