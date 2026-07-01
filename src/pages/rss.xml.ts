import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postUrl } from '../utils/collections';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'Alone in the Dungeon',
    description:
      'A blog about solo wargames and tabletop RPGs — session reports, reviews, and rules musings from the dark.',
    site: context.site ?? 'https://aloneinthedungeon.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
    })),
    customData: '<language>en-gb</language>',
  });
}
