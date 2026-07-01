import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stripIndex = ({ entry }: { entry: string }) =>
  entry.replace(/\/index\.(md|mdx)$/i, '').replace(/\.(md|mdx)$/i, '');

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
    generateId: stripIndex,
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),

        // Primary content classification
        type: z.enum(['live-play', 'review', 'stories', 'hobby', 'guides', 'news']),
        format: z
          .enum(['video', 'text', 'image-gallery', 'text-with-images'])
          .default('text'),

        // Video posts
        youtubeId: z.string().optional(),

        // Game context (not required for hobby or editorial stories)
        gameType: z
          .enum(['solo-wargame', 'tabletop-rpg', 'miniatures', 'both'])
          .optional(),
        system: z.string().optional(),

        // Series grouping — matches the id of a series collection entry
        series: z.string().optional(),
        episode: z.number().int().optional(),

        // Narrative ↔ Live Play cross-links (IDs of source live-play posts)
        sourceSessions: z.array(z.string()).optional(),

        tags: z.array(z.string()).default([]),

        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),

        // Book/film review metadata
        bookAuthor: z.string().optional(),
        bookYear: z.number().int().optional(),
        readingFormat: z.enum(['print', 'ebook', 'audiobook']).optional(),
        narrator: z.string().optional(),
        startedReading: z.coerce.date().optional(),
        finishedReading: z.coerce.date().optional(),

        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        if (data.heroImage && !data.heroImageAlt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['heroImageAlt'],
            message: 'heroImageAlt is required when heroImage is set',
          });
        }
        if (data.format === 'video' && !data.youtubeId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['youtubeId'],
            message: 'youtubeId is required for video posts',
          });
        }
      }),
});

const series = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/series',
    generateId: stripIndex,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // The type of posts in this series
      type: z.enum(['live-play', 'stories', 'hobby']),
      system: z.string().optional(),
      gameType: z
        .enum(['solo-wargame', 'tabletop-rpg', 'miniatures', 'both'])
        .optional(),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      status: z.enum(['ongoing', 'completed', 'hiatus']).default('ongoing'),
      startDate: z.coerce.date(),
    }),
});

export const collections = { posts, series };
