// Build-time resolution of the best available YouTube thumbnail.
// maxresdefault is the true 16:9 frame but 404s for videos YouTube never
// processed at high resolution; hqdefault always exists (4:3, letterboxed).
// The <img> tags handle this client-side with onerror; OG tags can't, so
// we probe once per video at build time. Module-level cache dedupes across
// pages within a single build.
const cache = new Map<string, string>();

export async function resolveYoutubeThumbnail(youtubeId: string): Promise<string> {
  const cached = cache.get(youtubeId);
  if (cached) return cached;

  const maxres = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
  const fallback = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  let url = fallback;
  try {
    const res = await fetch(maxres, { method: 'HEAD' });
    if (res.ok) url = maxres;
  } catch {
    // network hiccup at build time: keep the always-available fallback
  }
  cache.set(youtubeId, url);
  return url;
}
