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
- [ ] **OG image for video posts can 404.** `PostLayout.astro` uses `img.youtube.com/.../maxresdefault.jpg` for the OG tag, which 404s for videos YouTube never processed at high res. The `<img>` tags have an `onerror` fallback to `hqdefault.jpg`; the OG tag has no fallback. (Self-hosting thumbnails, below, fixes this too.)

### Code cleanup

- [x] **Deduplicate the six identical `[slug].astro` pages.** Done: `makePostStaticPaths(type)` in `collections.ts`; each slug page is now a thin wrapper.
- [x] **Consolidate `/posts/` and `/blog/`.** Done: deleted the orphaned `/posts/` page; `public/_redirects` 301s `/posts/` → `/blog/` on Netlify.
- [x] **Extract a `VideoThumb.astro` component.** Done: shared by `PostCard.astro` and the featured card in `index.astro`.
- [ ] **Move the arc/episode sort into `collections.ts`.** The sort added to `stories/index.astro` (by series, then episode) belongs in a shared `sortByArcAndEpisode()` helper for reuse on series pages and future chapter listings.

### Performance

Currently 99–100 mobile Lighthouse; these are margin-hunting.

- [ ] **Self-host YouTube thumbnails.** The featured card pulls a 152KB `maxresdefault.jpg` from `i.ytimg.com` — the last third-party render-path asset. Download at build time (or commit as the post's `heroImage`) to get Astro's responsive `<Image>` treatment and fix the OG fallback bug above.
- [ ] **Click-to-play facade for YouTube embeds.** The lazy iframe still pulls ~1MB+ of YouTube player JS once scrolled into view. A thumbnail + play button that injects the iframe on click (lite-youtube-embed pattern) keeps post pages light.
- [ ] **Consider dropping Inter.** It's 48KB and only used for tiny uppercase labels — a system-ui stack would be indistinguishable at those sizes and removes a font request from every page.

### UX

- [ ] **Prev/next episode navigation on posts.** Biggest gap for a serialized site: from a mid-series episode there's no way to reach the next one except backing out to the series page. `series` + `episode` frontmatter already support a "← Episode 1 | Episode 3 →" footer nav in `PostLayout`.
- [ ] **Search.** [Pagefind](https://pagefind.app) is built for static Astro sites — indexes at build time, tiny client bundle, makes transcripts and stories findable. Worth it past ~20 posts.
- [ ] **Pagination on listing pages.** Everything renders every post today; fine at current count, heavy after a couple of seasons. Astro's `paginate()` makes this straightforward.
- [ ] **Swap About/Contact in the nav.** "About" is hidden under "Contact"; new visitors deciding whether to stick around look for "What is this?" first. About should be top-level.
- [ ] **Richer RSS.** Feed is title+description only. Add full-content items (`content` field in `@astrojs/rss`) and a separate `/stories/rss.xml` so fiction readers can subscribe without live-play noise. Solo-RPG audiences are heavy RSS users.
- [ ] **Newsletter capture.** RSS covers the diehards; email (e.g. Buttondown) is the only owned re-engagement channel.

### Content organization

- [ ] **Elevate "system" into a browsable taxonomy.** Every post already has `system:` frontmatter ("Dolmenwood (OSE)", "Kal Arath") but it's display-only. A `/systems/` index with per-system pages is the natural way a new reader explores — all derivable from existing frontmatter.
- [ ] **Show episode counts/progress on series cards.** ("5 vignettes · Ongoing") — the data is already loaded on the series pages.
- [ ] **Standardize the `type` enum naming if a new type is ever added.** It mixes singular and plural (`review` vs `stories`/`guides`), which forces the `typeBasePath` mapping table. Not worth a breaking rename now.
