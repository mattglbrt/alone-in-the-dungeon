/**
 * Factory for the per-type `.md` endpoints. AITD routes each post type from
 * its own directory (/live-plays/, /reviews/, …), so without this the same
 * six-line endpoint would be copied five times and drift.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from './markdownExport';
import { postDoc } from './geoContent';
import { type Post, type PostType } from './collections';

export function makeMarkdownEndpoint(type: PostType): {
  getStaticPaths: () => Promise<{ params: { slug: string }; props: { post: Post } }[]>;
  GET: APIRoute;
} {
  return {
    async getStaticPaths() {
      // Mirrors makePostStaticPaths so the .md routes exist for exactly the
      // posts that have HTML routes — including drafts under `npm run dev`.
      const posts = await getCollection(
        'posts',
        (p) => (import.meta.env.DEV || !p.data.draft) && p.data.type === type
      );
      return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
    },
    GET: ({ props }) => textResponse(renderMarkdownDoc(postDoc((props as { post: Post }).post))),
  };
}
