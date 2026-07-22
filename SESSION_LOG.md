# Session Log — Alone in the Dungeon

Append-only. **Newest entry first.**

---

## 2026-07-22 — GEO port from hobbinomicon; dev-server draft preview; all four commits verified live

Three shipped things, all pushed to `main` and confirmed against the deployed site.

### Draft preview on the dev server (`7dd2d30`)

Previewing a work-in-progress post meant flipping `draft: false`, building, and remembering to flip it back — which is exactly what happened during the previous session and nearly shipped a false verification. Now `isPublished` reads `import.meta.env.DEV || p.data.draft !== true`.

The `!p.data.draft` check was duplicated across ten functions in `utils/collections.ts`; all now route through the single predicate, so drafts appear consistently — routes, cards, series nav, tag and system pages, counts — rather than in some places but not others. `npm run preview` still hides drafts (it serves the build, where DEV is false); noted in a comment at the predicate.

### GEO outputs (`72eae24`)

Ported the pattern built for hobbinomicon on 07-21, adapted to this site's content model. Matt believed `_system/` carried instructions for it; it does not — the RECURRING.md grep hit was a false positive on "Dun**geo**n". The real spec is hobbinomicon's SESSION_LOG entries plus its source, which was detailed enough to port from directly.

- **`/llms.txt`** (6,557 bytes) — series-led. Each campaign gets a section: series overview, then its sessions **in episode order**.
- **`.md` renderings** — 19 files (16 posts + 3 series). Series docs append an auto-generated episode list.
- **`/llms-full.txt`** (99KB) — every post in full; no abridgement needed at this size.
- **`robots.txt`** — twelve AI crawlers named explicitly.

### Decisions

- **Series lead the index** rather than a flat reverse-chronological post list. A campaign is the unit a reader follows and a session report out of context isn't much use — the AITD equivalent of hobbinomicon's "directory entities lead". Sessions stay in episode order; reverse-chronological would present a campaign backwards.
- **Omitted hobbinomicon's `Disallow: /_astro/`.** Google's guidance is to leave CSS/JS crawlable so pages render fully for mobile-friendliness, and PSI mobile is this site's stated ground truth. Deliberate divergence, confirmed with Matt, reasoning left in the file.
- **`CharacterCard` converts to markdown rather than being stripped.** Name, ancestry, class, all six stats, HP/AC, gear, talent. A stat block is the densest citable content on a session post. Required an expression-prop parser (`hp={7}`, `stats={{ str: 16 }}`) that hobbinomicon's string-only version didn't need.
- **GEO draft filtering reuses `collections.ts`** instead of repeating `!data.draft`, so the outputs inherit the dev/production rule automatically.
- **Factored `makeMarkdownEndpoint`** because AITD routes each post type from its own directory — without it the same endpoint would be copied five times and drift.
- **robots.txt was already permitting every AI crawler.** Nothing was blocked before; naming them only makes the intent explicit. Same finding as hobbinomicon, reported rather than presented as a fix.

### Artifacts

- `src/utils/markdownExport.ts`, `src/utils/geoContent.ts`, `src/utils/mdEndpoint.ts`
- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`
- `src/pages/{live-plays,reviews,stories,hobby,guides}/[slug].md.ts`, `src/pages/series/[slug].md.ts`
- `public/robots.txt` (modified), `src/utils/collections.ts` (modified)

### Live verification

- `/llms.txt` **byte-identical** to the local build (6,557 bytes, zero diff). The id tie-breaker held and AITD's date-only frontmatter sidesteps the 192-post timezone bug that bit hobbinomicon — worth noting the port did *not* inherit that problem.
- `.md` serves as `text/markdown`, `/llms-full.txt` as `text/plain`. The content-type worry was unfounded here too; no `netlify.toml` change needed.
- **Draft containment proven in both directions:** session 3 404s in production at both its HTML and `.md` routes, and appears zero times in llms.txt, llms-full.txt, the series `.md`, or the sitemap — while sessions 1–2 still list correctly. Worth proving rather than assuming, since the draft filter itself changed today.
- Build clean, exit 0. No existing page, layout, or component touched; `robots.txt` was the only modified pre-existing file, so the PSI baseline should be unmoved.

### Process note

The previous session's first build "passed" while proving nothing, because `draft: true` excluded the post from every route. Caught by checking whether the artifact actually appeared in `dist` rather than trusting a green exit code. The draft-preview change exists because of that near-miss.

### Still open

Session 3 is still a shell — six cards reading `NAME` with invented stats. That data is now load-bearing twice over: it renders verbatim into `/live-plays/shadowdark-session-3.md`, so placeholder stats would be what a model cites once the post publishes.

---

## 2026-07-21 — Session 3 scaffolded; character sheet components built

**What happened.** Created `src/content/posts/shadowdark-season-1/shadowdark-session-3/index.mdx` — frontmatter only, no prose. Then built a pair of components to satisfy session 3's opening obligation (names/stats/backstories for the party, six characters).

**Artifacts.**
- `src/content/posts/shadowdark-season-1/shadowdark-session-3/index.mdx` — `draft: true`, episode 3, dated 07-21, tags matching sessions 1–2. Body is the party grid with all six characters stubbed (`name="NAME"` + placeholder stats).
- `src/components/CharacterCard.astro` — one character: archetype eyebrow + level, name, ancestry · class, six stats in two columns, HP pip row + AC, gear, talent. Every field past `name` optional.
- `src/components/PartyGrid.astro` — roster wrapper, responsive 3/2/1-up.

**Choices made.**
- **Data-driven cards over photos of the real sheets.** Matt picked this from three options (data cards / photo gallery / hybrid). Real text means Pagefind indexes the stats, it's legible on a phone, and it adds no JS and no images — no cost against the PSI mobile guardrail. Photos of handwritten graph paper would have failed all three.
- **Grid breaks out of the prose column.** `--container-prose` is 680px, which squeezes three stat blocks to ~210px each. The grid centres against the viewport up to 1100px instead, collapsing to 1-up on mobile on its own.
- **Modifiers are computed, not typed** — `stats={{ str: 16 }}` renders `16 (+3)` via standard `(score − 10) / 2`. One less typo surface across six characters.
- **`dead` + `epitaph` props included up front.** Session 2 logged 16 deaths; a gauntlet campaign will want struck-through cards sooner or later.
- **Kept it system-agnostic** so Kal Arath can reuse it, rather than hardcoding Shadowdark's six stats.

**Verification note.** The first `npm run build` passed but proved nothing — `draft: true` is filtered out of all routes by `utils/collections.ts`, so the components never rendered. Rebuilt with `draft: false` to actually exercise them: 6 `article.rune-card` elements, breakout CSS present (minified to `transform:translate(-50%)`), modifiers correct. Reverted to `draft: true` after.

**Still open.** Never viewed in a browser — the Chrome extension wasn't connected, so verification was rendered-HTML inspection only; spacing and visual balance are unconfirmed. All six characters carry placeholder names and invented stats that need replacing with Matt's real sheets. Nothing committed.

---

## 2026-07-21 — Shadowdark session 2 ending drafted

**What happened.** Wrote the closing ~30 lines of `src/content/posts/shadowdark-season-1/shadowdark-session-2/index.mdx`, picking up from "a second group scrambles out of the opening behind them" and carrying through to the end of the session. Matt supplied the play beats; I drafted in his voice and he edited the draft afterward.

**Beats covered.** Half-orc recognizes a human from his own town, secret forearm clasp, "We are the only ones that made it out" — both had rolled cult initiate and neither knew. New party of six (adds human herbalist, banished dwarf). Flight into a wrong hex, daylight camp with a watch. Original three brief the newcomers on the Sect of the Proboscis; party resolves to drive out the cult leaders, then spooks itself with the possibility that village elders are among them, so: go home, act normal, regroup at dawn. Random encounter on a rolled 1 — a forest dragon tramples through camp, oracle says it never notices them; all dex saves pass except the dwarf's. Home without further trouble. Two of them skip their own beds and report to their cult leaders instead.

**Choices made.**
- Left the handshake undescribed as a signal, so the reader clocks it before understanding it; the cult-initiate reveal lands in Matt's commentary voice right after.
- Framed the oracle's "no" on dragon awareness as the better roll — indifference over aggression.
- Tied the dwarf's anticlimactic death to the fact that no one is named yet ("nobody had learned it yet"), letting a mechanical truth do the emotional work.
- Ended small per voice.md: "Five survivors, one plan, and two of them are already lying about it."

**Matt's edits after the draft.** Trimmed "A human man, from his own town" to "A human"; "magic I love" for "part I love"; tightened the elder-suspicion paragraph; added real-play color to the outro (~5 hours in, heavy rulebook back-and-forth, probable combat mistakes, still enjoying the system).

**Still open.** Post is not committed. Characters get advanced to level 1 off-screen; names, stats and backstories are promised at the top of session 3, so session 3 has a hard opening obligation.

---

## 2026-07-21 — Everyway organization standard installed

CLAUDE.md (distilled from README decisions), STATUS.md, this log, `/wrap` `/orient` commands added. Prior history lives in README.md's dated checklist entries.
