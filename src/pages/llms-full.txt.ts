import type { APIRoute } from 'astro';
import { renderMarkdownDoc, textResponse } from '../utils/markdownExport';
import { getGeoContent, postDoc, seriesDoc, postUrl, seriesUrl } from '../utils/geoContent';

/**
 * /llms-full.txt — the site's citable content concatenated as markdown.
 *
 * Unlike hobbinomicon's version, nothing is abridged: AITD's whole archive is
 * a few dozen posts, well under the 2MB threshold where splitting matters. If
 * the archive grows past that, the vlog treatment there is the pattern to
 * follow — list the long tail as title + description + link and let a model
 * fetch the `.md` per post.
 */

const SEP = '\n\n';

/**
 * Bound each document with an HTML comment rather than a `---` rule: every doc
 * opens with a YAML frontmatter fence, so a `---` separator would be
 * indistinguishable from one and split the file wrong.
 */
function doc(markdown: string, url: string): string {
  return `<!-- doc: ${url} -->\n${markdown.trim()}\n<!-- /doc -->`;
}

const heading = (h: string, count: number) => `<!-- section: ${h} (${count}) -->`;

export const GET: APIRoute = async () => {
  const { series, seriesPosts, stories, reviews, guides, hobby, livePlays, all } =
    await getGeoContent();

  const parts: string[] = [
    [
      '# Alone in the Dungeon — full content export',
      '',
      'Solo wargaming and solo tabletop RPG blog: live-play session reports,',
      'narrative stories drawn from actual play, reviews, hobby posts, and reference',
      'guides. Written by Matt Gilbert.',
      'Source: https://aloneinthedungeon.com',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      '',
      `Contains the full text of all ${all.length} posts. Campaign sessions appear`,
      'under their series in episode order; everything else is newest first.',
    ].join('\n'),
  ];

  for (const s of series) {
    const posts = seriesPosts.get(s.id) ?? [];
    parts.push(heading(`Series: ${s.data.title}`, posts.length));
    parts.push(doc(renderMarkdownDoc(seriesDoc(s)), seriesUrl(s)));
    for (const post of posts) {
      parts.push(doc(renderMarkdownDoc(postDoc(post)), postUrl(post)));
    }
  }

  const looseLivePlays = livePlays.filter((p) => p.data.series == null);
  const groups: [string, typeof stories][] = [
    ['Other live plays', looseLivePlays],
    ['Stories', stories.filter((p) => p.data.series == null)],
    ['Reviews', reviews],
    ['Guides', guides],
    ['Hobby', hobby],
  ];

  for (const [name, posts] of groups) {
    if (!posts.length) continue;
    parts.push(heading(name, posts.length));
    for (const post of posts) {
      parts.push(doc(renderMarkdownDoc(postDoc(post)), postUrl(post)));
    }
  }

  return textResponse(`${parts.join(SEP)}\n`, 'text/plain');
};
