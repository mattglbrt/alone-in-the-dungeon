# CLAUDE.md — Alone in the Dungeon

## What this is
Blog at **aloneinthedungeon.com** — solo wargames & tabletop RPGs: live plays, stories, reviews, hobby content. README.md doubles as the detailed feature/decision tracker.

## Stack & environment
Astro · Tailwind CSS 4 · MDX · Netlify. Search: Pagefind (`astro build && pagefind --site dist`). Commands: `npm run dev` / `build` / `preview`. Content: `src/content/posts/` (folder per post, grouped by series) + `src/content/series/`. Post types: live-play, review, stories, hobby, guides, news.

## Performance guardrails (closed decisions — don't reopen)
- **PageSpeed Insights mobile is the ground truth**, not local Lighthouse. Baseline 2026-07-08: 98 / 100 / 100 / 100, LCP 2.3s.
- Featured homepage thumbnail stays `eager` + `fetchpriority="high"` (it IS the mobile LCP); homepage grid cards are never eager.
- GA4 stays (worth ~1 point); IM Fell heading font stays; `--font-sans` is the system stack.
- YouTube thumbnails are self-hosted (build-time WebP via `utils/youtube.ts`); embeds are click-to-play facades (`YouTubeEmbed.astro`).

## Conventions
`/posts/` 301s to `/blog/` (`public/_redirects`). RSS is full-content (`utils/feed.ts` + `/stories/rss.xml`). Deferred by choice: `type` enum singular/plural rename (breaking, not worth it).

## Doc map
`STATUS.md` (read first) · `SESSION_LOG.md` · `README.md` (feature/decision tracker)

---

## Session workflow (Everyway standard)
Start: `/orient` — read `STATUS.md`. End: `/wrap` — log entry, refresh STATUS.md, update `../PROJECTS.md` row if the picture changed. System: `../_system/PLAYBOOK.md`.
