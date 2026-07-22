# STATUS — Alone in the Dungeon · updated 2026-07-22

## Now
Live and polished. Everything on the README punch list is done except newsletter. PSI mobile baseline (07-08): 98 perf / 100 / 100 / 100, LCP 2.3s — the GEO work touched no page, layout, or component, so the baseline should be unmoved (unverified since).

Tooling is ahead of content. The GEO surface is live and verified; drafts now preview under `npm run dev`. Working tree clean, `main` pushed, nothing undeployed.

The content thread is the constraint: Shadowdark season 1 sessions 1–2 are live, session 3 is still a shell — six character cards reading `NAME` with stats I invented, no prose.

## Next (ranked)
1. **Fill in the real character sheets.** Doubly load-bearing now: `CharacterCard` renders verbatim into `/live-plays/shadowdark-session-3.md`, so placeholder stats become what an LLM cites once the post publishes.
2. **Write session 3.** Level-1 advancement happened off-screen; names, stats and backstories are the post's stated opening obligation from session 2.
3. **Newsletter capture** (e.g. Buttondown) — the only owned re-engagement channel missing. Decide provider with hobbinomicon at the same time (same decision, two sites).
4. Re-run PSI mobile at some point to confirm the baseline held. Low risk, no page was touched.

## Blockers
—

## Recently done
- 07-22 — GEO port from hobbinomicon, verified live: `/llms.txt` byte-identical to local (6,557 b), `.md` serves as `text/markdown`, draft 404s and appears in no GEO output (`72eae24`).
- 07-22 — Drafts visible under `npm run dev`, still excluded from `astro build` (`7dd2d30`).
- 07-21 — `CharacterCard.astro` + `PartyGrid.astro` built; session 3 scaffolded as a draft (`ed27a03`). Grid checked in browser, looks right.
- 07-21 — Shadowdark session 2 ending written and committed, along with the org-standard docs.
- 07-10..07-21 — season 1 sessions 1 & 2 copy-edited; session 1 hero image set; news section removed, `/news` → The Hobbinomicon.
- 07-08 — perf pass complete; PSI baseline recorded.

## Open questions
- Shared newsletter provider across AITD + Hobbinomicon, or separate lists?
- Season 1 arc: cult purge is the stated party goal, but two PCs are cult members. How long before that breaks, and does it break in play or by authorial choice?
- Retrofit the character cards onto Kal Arath posts, or keep them Shadowdark-only? Components are system-agnostic either way.
- Should `/llms.txt` be linked from the site? Nothing references it; discovery is crawler-side only. Same question open on hobbinomicon — decide once for both.
