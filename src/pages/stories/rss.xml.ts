import type { APIContext } from 'astro';
import { getPostsByType, getSeriesByType, sortByArcAndEpisode } from '../../utils/collections';
import { buildFeed } from '../../utils/feed';

// Stories-only feed so fiction readers can subscribe without live-play noise
export async function GET(context: APIContext) {
  const allSeries = await getSeriesByType('stories');
  const posts = sortByArcAndEpisode(await getPostsByType('stories'), allSeries);

  return buildFeed({
    title: 'Alone in the Dungeon — Stories',
    description:
      'Curated stories drawn from actual play — the pure fiction the dice create, with the mechanics stripped away.',
    site: context.site ?? 'https://aloneinthedungeon.com',
    posts,
  });
}
