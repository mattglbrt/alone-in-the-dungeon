/**
 * Per-collection document builders shared by the `.md` endpoints and
 * /llms-full.txt, so a page's markdown rendering is identical wherever it
 * appears. Descriptions always come from existing frontmatter.
 *
 * Draft filtering deliberately reuses `collections.ts` rather than repeating
 * `!data.draft`, so the GEO outputs follow the same dev/production rule as the
 * rest of the site: drafts visible under `npm run dev`, absent from the build.
 */

import { canonical, type MarkdownDoc } from './markdownExport';
import {
  getPublishedPosts,
  getAllSeries,
  postUrl as postPath,
  type Post,
  type Series,
} from './collections';

export type { Post, Series };

export const postUrl = (p: Post) => `${canonical(postPath(p))}`;
export const seriesUrl = (s: Series) => canonical(`series/${s.id}`);

export function postDoc(post: Post): MarkdownDoc {
  const d = post.data;
  return {
    title: d.title,
    description: d.description,
    url: postUrl(post),
    date: d.date,
    updated: d.updated,
    tags: d.tags,
    extra: {
      type: d.type,
      storyKind: d.storyKind,
      system: d.system,
      gameType: d.gameType,
      series: d.series,
      episode: d.episode != null ? String(d.episode) : undefined,
      youtube: d.youtubeId ? `https://www.youtube.com/watch?v=${d.youtubeId}` : undefined,
      // Review metadata — only ever set on type: 'review'.
      bookAuthor: d.bookAuthor,
      bookYear: d.bookYear != null ? String(d.bookYear) : undefined,
      readingFormat: d.readingFormat,
      narrator: d.narrator,
    },
    body: post.body ?? '',
  };
}

export function seriesDoc(series: Series): MarkdownDoc {
  const d = series.data;
  return {
    title: d.title,
    description: d.description,
    url: seriesUrl(series),
    date: d.startDate,
    extra: {
      type: d.type,
      system: d.system,
      gameType: d.gameType,
      status: d.status,
    },
    body: series.body ?? '',
  };
}

/**
 * Everything the GEO outputs index, already filtered for drafts and sorted.
 *
 * Series lead, mirroring how the site itself is organized: a season is the
 * unit a reader (or a model) actually follows, and individual sessions only
 * make sense inside one. Sessions within a series stay in episode order —
 * reverse-chronological would present a campaign backwards.
 */
export async function getGeoContent() {
  const [posts, allSeries] = await Promise.all([getPublishedPosts(), getAllSeries()]);

  const byType = (type: Post['data']['type']) => posts.filter((p) => p.data.type === type);

  // Tie-break on id so same-day posts don't fall back to the glob loader's
  // filesystem order, which differs between macOS and Netlify's Linux.
  const byDate = (items: Post[]) =>
    [...items].sort(
      (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id)
    );

  const byEpisode = (items: Post[]) =>
    [...items].sort(
      (a, b) => (a.data.episode ?? 0) - (b.data.episode ?? 0) || a.id.localeCompare(b.id)
    );

  return {
    series: allSeries,
    /** Sessions grouped under their series, in episode order. */
    seriesPosts: new Map(
      allSeries.map((s) => [s.id, byEpisode(posts.filter((p) => p.data.series === s.id))])
    ),
    livePlays: byDate(byType('live-play')),
    stories: byDate(byType('stories')),
    reviews: byDate(byType('review')),
    guides: byDate(byType('guides')),
    hobby: byDate(byType('hobby')),
    /** Posts with no series, for the standalone sections. */
    standalone: byDate(posts.filter((p) => p.data.series == null)),
    all: byDate(posts),
  };
}
