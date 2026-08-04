# Session Log — Alone in the Dungeon

Append-only. **Newest entry first.**

---

## 2026-08-02–03 — First hobby post (Ravenmere Manor as a *player*); hero image perf fix takes the post to 100

Two commits, **both pushed and live**: `d7feb27` (the post) and `cb572a9` (the hero fix).

Matt played *The Tragedy of Ravenmere Manor* as a player with a full group — his first tabletop RPG as a player since 2002, through a paid DM service. He wanted a review plus a spin-off solo campaign with the character he played. He ended up writing the draft himself and handing it over to be edited and filed.

### The orientation was stale

STATUS.md said six commits sat unpushed on `main`. They didn't — `main` was level with `origin/main` at `8c2f342`. The push happened at some point after the 07-27 wrap and the doc never caught up. Nothing was lost; the top-ranked "Next" item was already done.

### It isn't a review, so it isn't filed as one

Matt's draft says outright, in the body, "This isn't really a review of the adventure." The back half is an essay about what Shadowdark did to his buy-it-and-shelve-it cycle. So it went in as **`type: hobby`, the site's first** — `/hobby/` had been building as an empty index until now. The review energy that *is* there is a 10/10 for Rogue Game Masters and the DM (The Warlock), and Matt has flagged a real paid-player review as a future post once he's done a few more sessions.

Structure agreed up front: **two posts**, the second being episode 1 of a new solo series picking up straight out of the manor, not an episode 0.

### Editing pass

Typos stripped, one wall of text broken into nine sentence-case `##` headers, run-ons left alone. The Instagram-to-shelf paragraph is Matt's list, lopsided, untouched — `voice.md` says keep the self-deprecating aside and end small, so "This is a rambling post" stayed in. Zero em-dashes.

### The hero image took the post from 81 to 100

PSI mobile on the new URL came back **81**, LCP **4.3s** against the 2.3s guardrail, with everything else green (FCP 1.6s, TBT 130ms, CLS 0, SI 4.1s). Lighthouse named the hero as the LCP element: 81.0 KiB at the 720w candidate, with 61.2 KiB flagged as oversized-for-display and 17.7 KiB as compression headroom.

Fixed in `PostLayout.astro`, so it covers **every** post hero, not just this one:

- **`fetchpriority="high"`.** The hero was already `loading="eager"` but carried no priority hint, unlike the homepage featured thumbnail which has had one all along. On a post page this image is unambiguously the LCP element.
- **`quality={70}`.** 720w candidate 81.0 → 63.7 KiB, matching Lighthouse's 17.7 KiB estimate almost exactly.

Re-run: **100 / 100 / 100 / 100**, LCP 1.0s, FCP 1.0s, TBT 10ms, CLS 0, SI 1.5s.

### Decisions

- **Filed `hobby`, not `review`, on the author's own words.** The post names what it is in its second-to-last section; typing it `review` would have put it on `/reviews/` next to the Poul Anderson book review and promised readers something it doesn't deliver.
- **Pointed at someone else's review instead of faking one.** Matt supplied [2d6 Stingbats' review](https://2d6stingbats.com/2026/07/03/review-the-tragedy-of-ravenmere-manor/); it sits directly after the "this isn't really a review" line, which is where a reader who wants one goes looking.
- **A fabricated URL was caught before it shipped.** A DriveThruRPG product link was invented from a guessed product ID while filling in the resources list — the web search confirmed the adventure exists there but never returned a canonical URL. Removed and replaced with plain text plus a TODO rather than shipped. Matt supplied the real one (`product/572860`) in the next message. **Worth remembering: search results confirming a thing exists are not a source for its URL.**
- **The closing link is deliberately not a link.** Matt's draft ended "Check that out here," but episode 1 doesn't exist, so a live link would 404. Replaced with "First session is coming. I'll put the link right here when it's up," which makes post one publishable standalone. TODO left at the spot.
- **MDX comments split Markdown lists.** `{/* ... */}` placed between two bullets broke the resources list into two `<ul>`s in the rendered HTML. Comments go *above* a list, never inside one. Caught in `dist`, not in review.
- **Alt text described the photo before naming the character.** Written as "a bearded dwarf miniature…" until Matt confirmed the mini was Borb, then updated to name him. Alt text is a factual description of an image, not a place to assert something unverified.
- **`quality={70}` chosen for what heroes actually are** — handheld photos of miniatures where WebP artifacts don't read at this size. The re-encoded 720w was eyeballed against the original before committing, which matters given the site's standing no-AI-art promise about its own images.
- **Committed to `main`**, consistent with every prior commit here; the batched-merge rule in the root CLAUDE.md is scoped to hobbinomicon's build credits.

### The 100 is real but the magnitude is overstated

Dropping 17 KiB and adding a priority hint does not move LCP from 4.3s to 1.0s. The first run measured a page deployed roughly a minute earlier, so it hit a **cold Netlify edge cache**; the re-run hit a warm one. The giveaway is TBT falling 130ms → 10ms when neither change touched a line of JavaScript. Directionally correct, quantitatively inflated. **A trustworthy number needs a re-run on an ordinary day.**

Related: the PSI baseline in CLAUDE.md (98 / 100 / 100 / 100, LCP 2.3s, 07-08) is almost certainly the **homepage** — the same file describes the featured homepage thumbnail as "the mobile LCP." So 98 → 81 → 100 was never a like-for-like comparison of one page. It has not been rewritten; it needs a clean measurement first.

### Tooling note

The keyless PageSpeed API returned **429, daily quota exhausted** (shared anonymous project), and no Google API key exists in the repo or environment. Fell back to driving `pagespeed.web.dev` in Chrome, which is the documented ground truth anyway. Its results panels live in shadow DOM, so scores come off screenshots; `get_page_text` returns ~51KB of Lighthouse's own CSS and does not yield the metric values.

### Artifacts

- `src/content/posts/shadowdark-repaired-something-in-me/index.mdx` — new
- `src/content/posts/shadowdark-repaired-something-in-me/borb-at-ravenmere.jpeg` — new (2000×1500, 541K source)
- `src/layouts/PostLayout.astro` — modified (`fetchpriority`, `quality`, comment explaining both)

### Verification

Clean `rm -rf dist && npm run build` at each step. Confirmed in `dist`: page renders at `/hobby/shadowdark-repaired-something-in-me/`, no TODO comment leaks into HTML, resources list is a single intact `<ul>`, srcset serves 720/1080/1440 at 63.7/112.5/163.3 KiB. Confirmed live: 200 at the public URL, `fetchpriority="high"` served, 720w candidate 65,260 bytes. PSI mobile re-run from a fresh analysis ID.

### Still open

Episode 1 is unbuilt and blocked on Matt: **Borb's sheet** (stats, HP/AC, level, gear, spells, deity or patron, talent), the **frog familiar's name**, and **why he goes back out alone** after being carried home unconscious. Nothing about the new series — its name, its slug, its `series` entry — has been decided yet.

---

## 2026-07-27 — Six real character sheets; a characters collection with a page each; cast on every post

Six commits, **all local — nothing pushed.** `main` is ahead of `origin/main` by 6.

The session started as data entry and turned into a feature. Matt read the six Shadowdark sheets in one at a time; each one had fields the card couldn't hold, so `CharacterCard` grew as the party arrived. Then the sheets moved out of the post entirely into their own collection with a page each.

### The party, filled in (`8efda07`, `d71d5d4`)

`NAME` placeholders and invented stats replaced with the real six: **Bram** (Human Priest, Seeker, Gede), **Malchor** (Human Wizard, Shaman, Shune the Vile), **Pinch** (Halfling Thief, Robber, Gede), **Tragan** (Half-Orc Warlock, Chosen, Shune as *patron*), **Poke** (Goblin Fighter, Warrior, Gede), **Morgan** (Human Witch, Shaman, Shune the Vile). Every modifier checked against its score before writing; all 36 matched.

Ancestries and classes shifted off the placeholders freely — Malchor took the Elf Wizard slot as a human, Tragan replaced the Half-Orc *Fighter* as a Warlock, Morgan took the Dwarf Fighter slot as a Human Witch.

### `CharacterCard` grew eight props

`background`, `alignment`, `spells`, `deity`, `abilities`, `patron`, `boons`, `note`, plus `talent` widened to `string | string[]`. All optional, so nothing already rendered broke.

### A characters collection, a page each (`389377d`, `3abe7ca`, `fdd7b04`, `0689020`)

Matt asked for a page per character: current sheet, space for a 3–5 sentence backstory he writes, and a feed of every post they appear in. Built as a content collection whose frontmatter mirrors `CharacterCard`'s props one-for-one, so a page spreads `entry.data.sheet` into the component with nothing in between. Backstory is the MDX body, same split the `series` files already use.

### Decisions

- **Asked about Morgan's missing stat instead of inferring it.** She arrived with five values where six were expected, and every modifier was internally consistent, so the numbers gave no clue which slot was empty. The obvious guess was a trailing omission (missing CHA, the 15 being WIS). The actual gap was **INT, mid-list** — so the 8 is her WIS and the 15 her CHA. Guessing would have put two wrong stats on a card that renders verbatim into the GEO output. The 07-22 entry flagged exactly this risk; this is the first time it was live.
- **Shadowdark class titles key off alignment**, confirmed across all six (neutral Priest = Seeker, neutral Wizard/Witch = Shaman, lawful Thief = Robber). So `title` carries the real class title rather than the placeholders' "The Half-Orc" ancestry restatement, which the subtitle already says.
- **`patron` + `boons` are separate fields from `deity`.** A warlock is bound, not worshipping, and "+1 XP for learning a secret" is an earning rule rather than something Tragan can do. Only Tragan uses them; Matt confirmed the other five are all `deity`.
- **`abilities` split from `talent`** — class and ancestry features apart from what was rolled. Bram's Turn Undead moved out of `spells` into `abilities` once the field existed.
- **`note` as a general escape hatch** for state true *now* rather than true of the character (Poke's unspent hero token), instead of another bespoke field.
- **Cards are Shadowdark-only, by Matt's call.** The component's doc comment previously promised Kal Arath as a design goal; corrected. Kal Arath gets its own card rather than more optional props here. **Retires a STATUS open question.**
- **The collection is the single source of truth.** Session 3's hand-written `<PartyGrid>` was deleted; its file is now frontmatter only. Editing a stat updates the character page, the roster index, and every post the character appears in.
- **Consequence, and the fix for it:** live data means an old session would print current stats. So **full sheets render only on the newest episode** (`showSheets={!nextPost}` — no next episode in the series means these numbers are still current). Earlier episodes get name + ancestry · class, linked. Session 2 hands the sheets to session 3 automatically on publish, no edit.
- **Cast declared post-side** (`characters: [...]` in frontmatter), so a new session names who was in it once instead of editing six character files.
- **"The Cast" carries a spoiler note** on every post: character pages show sheets as they stand now, so they can give away unread sessions. Kept on the newest episode too — the link still travels to a page that will drift ahead of the reader.
- **No nav link, Matt's call.** Pages are reachable from three published posts, and each character page's breadcrumb links up to `/characters/`, so the roster index isn't stranded.
- **Committed to `main`** rather than branching, matching every prior commit here; the root CLAUDE.md's batched-merge discipline is scoped to hobbinomicon's build credits. Flagged at the time.

### Campaign canon established

The party's stated cult-purge goal is **a competing cult going after other cults** — not cult-hunters with a hypocrisy problem. So "Cult Initiate · Shune the Vile" printed above the prose is the premise stated up front, not a leak. **Retires a STATUS open question.** Saved to project memory (`shadowdark-s1-rival-cult-premise`).

Roster splits three and three by god: Shune the Vile (Malchor, Tragan, Morgan) against Gede (Bram, Pinch, Poke). Whether that was designed or fell out of the dice is unconfirmed.

Sessions 1–2 cast is **Tragan, Pinch, Poke** — the three who survived the gauntlet. Those posts name nobody, referring to the party by ancestry only, and session 2 has a fourth member who drowned in the swamp and never came out. The other three debut in session 3.

### Artifacts

- `src/content/characters/{bram,malchor,pinch,tragan,poke,morgan}.mdx` — new
- `src/pages/characters/index.astro`, `src/pages/characters/[slug].astro` — new
- `src/components/PostCast.astro` — new
- `src/components/CharacterCard.astro`, `src/content.config.ts`, `src/utils/collections.ts`, `src/layouts/PostLayout.astro` — modified
- `shadowdark-session-{1,2,3}/index.mdx` — modified (`characters:` added; session 3's inline grid removed)
- `src/components/CastList.astro` — created then deleted the same session; the linked cards say everything it said and go the same place

### Verification

Production `astro build` clean at every step. Confirmed in `dist`: session 1 names only, session 2 full sheets (newest published, since session 3 is a draft), Tragan/Pinch/Poke each listing 2 sessions in their Appears In feed, Bram/Malchor/Morgan correctly showing the empty state. Under `npm run dev` session 3 becomes newest and takes the sheets, session 2 drops to names, and all six cast links render in declared order. A post with no cast renders nothing extra.

### Still open

Backstories are six placeholder lines. Session 3's file is now frontmatter only — an empty draft whose party renders automatically under whatever gets written.

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
