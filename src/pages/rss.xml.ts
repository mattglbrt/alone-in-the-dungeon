import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/collections';
import { buildFeed } from '../utils/feed';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return buildFeed({
    title: 'Alone in the Dungeon',
    description:
      'A blog about solo wargames and tabletop RPGs — session reports, reviews, and rules musings from the dark.',
    site: context.site ?? 'https://aloneinthedungeon.com',
    posts,
  });
}
