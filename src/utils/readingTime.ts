import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin that attaches a reading-time estimate to the file's frontmatter.
 * Accessible on rendered entries as `remarkPluginFrontmatter.readingTime`.
 */
export function remarkReadingTime() {
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const { minutes } = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = Math.max(1, Math.round(minutes));
  };
}

export function formatReadingTime(minutes: number | undefined): string {
  if (!minutes || minutes < 1) return '1 min read';
  return `${minutes} min read`;
}
