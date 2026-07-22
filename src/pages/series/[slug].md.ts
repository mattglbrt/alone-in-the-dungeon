import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { seriesDoc, postUrl, type Series } from '../../utils/geoContent';
import { getSeriesPosts } from '../../utils/collections';

/**
 * Markdown rendering of a series page: /series/shadowdark-season-1.md
 *
 * Unlike the post endpoints this appends an episode list, because the series
 * body alone doesn't say what's in the season — and that ordering is the whole
 * reason a model would fetch the series rather than a single session.
 */
export async function getStaticPaths() {
  const series = await getCollection('series');
  return series.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Series };
  const posts = await getSeriesPosts(entry.id);

  const episodes = posts.length
    ? [
        '',
        '## Episodes',
        '',
        ...posts.map((p) => {
          const url = postUrl(p).replace(/\/$/, '');
          const ep = p.data.episode != null ? `${p.data.episode}. ` : '';
          const desc = p.data.description?.replace(/\s+/g, ' ').trim();
          return `- ${ep}[${p.data.title}](${url}.md)${desc ? `: ${desc}` : ''}`;
        }),
      ].join('\n')
    : '';

  return textResponse(`${renderMarkdownDoc(seriesDoc(entry))}${episodes}\n`);
};
