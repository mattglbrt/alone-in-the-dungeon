# Alone in the Dungeon

A blog about solo wargames and tabletop RPGs — live plays, stories, reviews, and hobby content. Built with [Astro](https://astro.build), Tailwind CSS 4, and MDX. Deployed on Netlify at [aloneinthedungeon.com](https://aloneinthedungeon.com).

```sh
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

Content lives in `src/content/posts/` (one folder per post, grouped by series) and `src/content/series/`. Post types: `live-play`, `review`, `stories`, `hobby`, `guides`, `news`.

## To do

### Bugs

- [x] **Fix the default OG image 404.** ~~`BaseLayout.astro` falls back to `/og-default.png` but the file in `public/` is `og-default.jpg`.~~ Fixed: new `og-default.png` composed from the Seal of Mercury (seal + site name + tagline on void, 1200×630); old `.jpg`/`.svg` versions removed.
- [x] **OG image for video posts can 404.** Done: `utils/youtube.ts` probes maxresdefault at build time (HEAD request, cached per video) and falls back to the always-available hqdefault for the OG tag.

### Code cleanup

- [x] **Deduplicate the six identical `[slug].astro` pages.** Done: `makePostStaticPaths(type)` in `collections.ts`; each slug page is now a thin wrapper.
- [x] **Consolidate `/posts/` and `/blog/`.** Done: deleted the orphaned `/posts/` page; `public/_redirects` 301s `/posts/` → `/blog/` on Netlify.
- [x] **Extract a `VideoThumb.astro` component.** Done: shared by `PostCard.astro` and the featured card in `index.astro`.
- [x] **Move the arc/episode sort into `collections.ts`.** Done: `sortByArcAndEpisode(posts, series)` helper; `stories/index.astro` uses it.

### Performance

Currently 99–100 mobile Lighthouse; these are margin-hunting.

- [ ] **Self-host YouTube thumbnails.** The featured card pulls a 152KB `maxresdefault.jpg` from `i.ytimg.com` — the last third-party render-path asset. Download at build time (or commit as the post's `heroImage`) to get Astro's responsive `<Image>` treatment and fix the OG fallback bug above.
- [x] **Click-to-play facade for YouTube embeds.** Done: `YouTubeEmbed.astro` renders the thumbnail + play button and injects the autoplay iframe on click; no YouTube player JS loads until then.
- [ ] **Consider dropping Inter.** It's 48KB and only used for tiny uppercase labels — a system-ui stack would be indistinguishable at those sizes and removes a font request from every page.

### UX

- [x] **Prev/next episode navigation on posts.** Done: series posts show "← Episode N / Episode N →" cards above the series box in `PostLayout`, driven by `series` + `episode` frontmatter.
- [x] **Search.** Done: Pagefind runs post-build (`astro build && pagefind --site dist`); `data-pagefind-body` scopes the index to post content; themed UI at `/search/`, linked in the nav.
- [ ] **Pagination on listing pages.** Everything renders every post today; fine at current count, heavy after a couple of seasons. Astro's `paginate()` makes this straightforward.
- [x] **Swap About/Contact in the nav.** Done: About is top-level with Contact in its dropdown.
- [x] **Richer RSS.** Done: full-content items (markdown-it + sanitize-html on post bodies, absolute URLs) via shared `utils/feed.ts`; added `/stories/rss.xml` and a second `rel=alternate` link for feed discovery.
- [ ] **Newsletter capture.** RSS covers the diehards; email (e.g. Buttondown) is the only owned re-engagement channel.

### Content organization

- [x] **Elevate "system" into a browsable taxonomy.** Done: `/systems/` index + per-system pages generated from `system:` frontmatter (`systemToSlug`, `getAllSystemsWithCount`, `getPostsBySystem`); post headers link the system name.
- [x] **Show episode counts/progress on series cards.** Done: "N episodes / N stories" chip on series cards across `/series/`, `/stories/`, and `/live-plays/` via `getSeriesPostCounts()` + `seriesCountLabel()`.
- [ ] **Standardize the `type` enum naming if a new type is ever added.** It mixes singular and plural (`review` vs `stories`/`guides`), which forces the `typeBasePath` mapping table. Not worth a breaking rename now.
