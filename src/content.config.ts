import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts may be nested in subfolders (e.g. grouped by series) purely for
// organization — the id is always just the leaf slug, so URLs are unaffected
// by how deep a post file lives.
const stripIndex = ({ entry }: { entry: string }) =>
  entry
    .replace(/\/index\.(md|mdx)$/i, '')
    .replace(/\.(md|mdx)$/i, '')
    .split('/')
    .pop()!;

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
        type: z.enum(['live-play', 'review', 'stories', 'hobby', 'guides']),
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

        // Cast — ids of characters collection entries. Declared post-side so
        // adding a post names its cast once, rather than editing every
        // character who happened to be there.
        characters: z.array(z.string()).default([]),

        // For type: 'stories' — a standalone character vignette vs. a
        // narrative write-up dramatizing an actual play session
        storyKind: z.enum(['vignette', 'chapter']).optional(),

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

// A character sheet as data, plus a backstory in the MDX body. The frontmatter
// deliberately mirrors CharacterCard's props one-for-one so a page can spread
// `entry.data.sheet` straight into the component with nothing in between.
//
// This holds the character as they stand *now*. A post's own PartyGrid is a
// snapshot of who they were that session, which is why the two are separate.
const characters = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/characters',
    generateId: stripIndex,
  }),
  schema: ({ image }) =>
    z.object({
      // Sorting on the roster index; lower comes first.
      order: z.number().int().default(0),
      // The campaign they belong to — id of a series entry.
      series: z.string().optional(),
      portrait: image().optional(),
      portraitAlt: z.string().optional(),

      sheet: z.object({
        name: z.string(),
        title: z.string().optional(),
        ancestry: z.string().optional(),
        charClass: z.string().optional(),
        level: z.union([z.number(), z.string()]).optional(),
        background: z.string().optional(),
        alignment: z.string().optional(),
        stats: z
          .object({
            str: z.number().optional(),
            dex: z.number().optional(),
            con: z.number().optional(),
            int: z.number().optional(),
            wis: z.number().optional(),
            cha: z.number().optional(),
          })
          .optional(),
        hp: z.number().optional(),
        maxHp: z.number().optional(),
        ac: z.number().optional(),
        gear: z.array(z.string()).default([]),
        spells: z.array(z.string()).default([]),
        abilities: z.array(z.string()).default([]),
        boons: z.array(z.string()).default([]),
        deity: z.string().optional(),
        patron: z.string().optional(),
        talent: z.union([z.string(), z.array(z.string())]).optional(),
        note: z.string().optional(),
        dead: z.boolean().default(false),
        epitaph: z.string().optional(),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.portrait && !data.portraitAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['portraitAlt'],
          message: 'portraitAlt is required when portrait is set',
        });
      }
    }),
});

export const collections = { posts, series, characters };
