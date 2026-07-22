import type { APIRoute } from 'astro';
import { canonical, textResponse } from '../utils/markdownExport';
import { getGeoContent, postUrl, seriesUrl } from '../utils/geoContent';
import { seriesCountLabel } from '../utils/collections';
import type { Post } from '../utils/collections';

/**
 * /llms.txt — curated index for language models, per https://llmstxt.org/
 *
 * Every link points at the `.md` rendering of the page, so a model following
 * a link gets clean markdown rather than a page of layout. Link descriptions
 * are lifted verbatim from frontmatter — nothing here is newly written prose
 * beyond the blockquote, which is deliberately flat machine-facing metadata.
 */

/** `- [Title](url.md): description` — the llms.txt link-list shape. */
function link(title: string, url: string, description?: string): string {
  const md = `${url.replace(/\/$/, '')}.md`;
  const clean = description?.replace(/\s+/g, ' ').trim();
  return clean ? `- [${title}](${md}): ${clean}` : `- [${title}](${md})`;
}

const postLink = (p: Post) => link(p.data.title, postUrl(p), p.data.description);

function section(heading: string, lines: string[]): string[] {
  return lines.length ? ['', `## ${heading}`, '', ...lines] : [];
}

export const GET: APIRoute = async () => {
  const { series, seriesPosts, stories, reviews, guides, hobby, livePlays } =
    await getGeoContent();

  const out: string[] = [
    '# Alone in the Dungeon',
    '',
    '> Alone in the Dungeon is a solo tabletop gaming blog covering solo wargames and',
    'solo roleplaying games. It publishes written live-play session reports from',
    'ongoing solo campaigns, narrative stories drawn from actual play, reviews of',
    'games and books, hobby posts from the painting desk, and reference guides such',
    'as Appendix N reading lists. Campaigns run as series, each a numbered run of',
    'sessions played and written up as they happen. Written by Matt Gilbert.',
    '',
    'Markdown versions of every page below are available by appending `.md` to its',
    'URL. `/llms-full.txt` contains the full text of the core pages in one file.',
  ];

  // Series lead: a campaign is the unit a reader follows, and an individual
  // session only makes sense inside one.
  for (const s of series) {
    const posts = seriesPosts.get(s.id) ?? [];
    out.push(
      ...section(`${s.data.title} (series)`, [
        link(`${s.data.title} — series overview`, seriesUrl(s), s.data.description),
        ...posts.map(postLink),
      ])
    );
  }

  // Live plays that belong to no series would otherwise be unreachable above.
  const looseLivePlays = livePlays.filter((p) => p.data.series == null);
  out.push(...section('Other live plays', looseLivePlays.map(postLink)));

  out.push(...section('Stories', stories.map(postLink)));
  out.push(...section('Reviews', reviews.map(postLink)));
  out.push(...section('Guides', guides.map(postLink)));
  out.push(...section('Hobby', hobby.map(postLink)));

  // Hub and listing pages are HTML-only; no `.md` twin, so link direct.
  out.push(
    ...section('Browse', [
      `- [All posts](${canonical('blog')})`,
      `- [Series](${canonical('series')}): ${series
        .map((s) => `${s.data.title} (${seriesCountLabel(s.data.type, (seriesPosts.get(s.id) ?? []).length)})`)
        .join(', ')}`,
      `- [Live plays](${canonical('live-plays')})`,
      `- [Stories](${canonical('stories')})`,
      `- [Reviews](${canonical('reviews')})`,
      `- [Guides](${canonical('guides')})`,
      `- [Hobby](${canonical('hobby')})`,
      `- [Browse by system](${canonical('systems')})`,
      `- [Browse by tag](${canonical('tags')})`,
      `- [About](${canonical('about')})`,
    ])
  );

  out.push(
    ...section('Optional', [
      `- [RSS feed](${canonical('rss.xml').replace(/\/$/, '')}): full-content feed of every post.`,
      `- [Stories RSS feed](${canonical('stories/rss.xml').replace(/\/$/, '')})`,
    ])
  );

  return textResponse(`${out.join('\n')}\n`, 'text/plain');
};
