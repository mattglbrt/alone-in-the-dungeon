import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Series = CollectionEntry<'series'>;
export type PostType = Post['data']['type'];

const isPublished = (p: Post) => p.data.draft !== true;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', isPublished);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPostsByType(type: PostType): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    (p) => !p.data.draft && p.data.type === type,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getSeriesPosts(seriesSlug: string): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    (p) => !p.data.draft && p.data.series === seriesSlug,
  );
  return posts.sort((a, b) => (a.data.episode ?? 0) - (b.data.episode ?? 0));
}

// Narrative posts (type: 'stories') that dramatize a given live-play session
export async function getNarrativeVersions(sessionId: string): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    (p) => !p.data.draft && (p.data.sourceSessions ?? []).includes(sessionId),
  );
  return posts.sort((a, b) => (a.data.episode ?? 0) - (b.data.episode ?? 0));
}

export async function getFeaturedPost(posts: Post[]): Promise<Post | undefined> {
  return posts.find((p) => p.data.featured) ?? posts[0];
}

export async function getAllSeries(): Promise<Series[]> {
  const all = await getCollection('series');
  return all.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());
}

export async function getSeriesByType(type: Series['data']['type']): Promise<Series[]> {
  const all = await getCollection('series', (s) => s.data.type === type);
  return all.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    (p) => !p.data.draft && p.data.tags.includes(tag),
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllTagsWithCount(): Promise<{ tag: string; count: number }[]> {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getAllTags(posts: Post[]): string[] {
  const tags = new Set<string>();
  for (const p of posts) for (const t of p.data.tags) tags.add(t);
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function tagToLabel(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

// Maps post type to its URL base path (no trailing slash)
export function typeBasePath(type: PostType): string {
  const map: Record<PostType, string> = {
    'live-play': '/live-plays',
    review: '/reviews',
    stories: '/stories',
    hobby: '/hobby',
    guides: '/guides',
    news: '/news',
  };
  return map[type];
}

export function postUrl(post: Post): string {
  return `${typeBasePath(post.data.type)}/${post.id}/`;
}

export const TYPE_LABELS: Record<PostType, string> = {
  'live-play': 'Live Play',
  review: 'Review',
  stories: 'Stories',
  hobby: 'Hobby',
  guides: 'Guide',
  news: 'News',
};

export const STORY_KIND_LABELS: Record<NonNullable<Post['data']['storyKind']>, string> = {
  vignette: 'Vignette',
  chapter: 'Chapter',
};

export const TYPE_DESCRIPTIONS: Record<PostType, string> = {
  'live-play':
    'Raw recordings and recaps from the table — wargames, RPGs, and everything in between.',
  review:
    'Honest takes on games, books, and hobby products from a solo perspective.',
  stories:
    'Curated stories drawn from actual play. The pure fiction the dice create.',
  hobby: 'Completed projects and step-by-step guides from the painting desk.',
  guides:
    'Reading lists, Appendix N indexes, and reference guides for solo play.',
  news: 'Industry news, releases, jams, and other cool things worth a look.',
};

export const GAME_TYPE_LABELS: Record<string, string> = {
  'solo-wargame': 'Solo Wargame',
  'tabletop-rpg': 'Tabletop RPG',
  miniatures: 'Miniatures',
  both: 'Solo & Tabletop',
};

export const FORMAT_LABELS: Record<string, string> = {
  video: 'Video',
  text: 'Article',
  'image-gallery': 'Gallery',
  'text-with-images': 'Article',
};

export const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  hiatus: 'On Hiatus',
};

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
