import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { postUrl, type Post } from './collections';

const md = new MarkdownIt({ html: false, linkify: true });

// Post bodies are plain markdown (no JSX/imports) even though the files are
// .mdx, so markdown-it renders them faithfully for full-content feed items.
export function renderItemContent(post: Post, site: URL | string): string {
  const html = md.render(post.body ?? '');
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
    },
    // Feed readers resolve relative URLs poorly; make them absolute.
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href?.startsWith('/')
            ? { href: new URL(attribs.href, site).toString() }
            : {}),
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.src?.startsWith('/')
            ? { src: new URL(attribs.src, site).toString() }
            : {}),
        },
      }),
    },
  });
}

export function buildFeed(options: {
  title: string;
  description: string;
  site: URL | string;
  posts: Post[];
}) {
  const { title, description, site, posts } = options;
  return rss({
    title,
    description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      content: renderItemContent(post, site),
    })),
    customData: '<language>en-gb</language>',
  });
}
