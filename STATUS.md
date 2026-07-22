# STATUS — Alone in the Dungeon · updated 2026-07-22

## Now
Live and polished. Everything on the README punch list is done except newsletter. PSI mobile baseline (07-08): 98 perf / 100 / 100 / 100, LCP 2.3s — remaining points are documented closed trade-offs. The GEO work touched no page, layout, or component, so the baseline should be unmoved.

Active thread is content: Shadowdark season 1. Sessions 1–2 are live. Session 3 exists as a draft shell — a party grid of six characters carrying placeholder names and invented stats, no prose yet.

Tooling shipped ahead of the content: drafts now render under `npm run dev`, and the GEO surface (`/llms.txt`, `/llms-full.txt`, `.md` renderings) is pushed and awaiting live verification.

## Next (ranked)
1. **Fill in the real character sheets.** All six cards read `name="NAME"` with stats I invented. Now doubly load-bearing: `CharacterCard` renders into `/live-plays/shadowdark-session-3.md`, so placeholder data is what an LLM would cite.
2. **Write session 3.** Level-1 advancement happened off-screen; names, stats and backstories are the post's stated opening obligation from session 2.
3. **Verify GEO live** once Netlify deploys `72eae24`: `.md` URLs serve as `text/markdown` (unfounded worry on hobbinomicon, expect the same), and `/llms.txt` is byte-identical to the local build (6,557 bytes). Use `curl`, not an LLM — WebFetch miscounted sections during hobbinomicon's pass.
4. Newsletter capture (e.g. Buttondown) — the only owned re-engagement channel missing. Decide provider with hobbinomicon at the same time (same decision, two sites).

## Blockers
—

## Recently done
- 07-22 — GEO port from hobbinomicon: `/llms.txt` (series-led), `/llms-full.txt`, `.md` renderings of all 16 posts + 3 series, twelve AI crawlers named in robots.txt. Pushed `72eae24`.
- 07-22 — Drafts visible under `npm run dev`, still excluded from `astro build` (`7dd2d30`).
- 07-21 — `CharacterCard.astro` + `PartyGrid.astro` built and committed; session 3 scaffolded as a draft (`ed27a03`). Grid checked in browser, looks right.
- 07-21 — Shadowdark session 2 ending written and committed, along with the org-standard docs.
- 07-10..07-21 — Shadowdark season 1 sessions 1 & 2 copy-edited; session 1 hero image set; news section removed, `/news` → The Hobbinomicon.
- 07-08 — perf pass complete; PSI baseline recorded.

## Open questions
- Shared newsletter provider across AITD + Hobbinomicon, or separate lists?
- Season 1 arc: cult purge is the stated party goal, but two PCs are cult members. How long before that breaks, and does it break in play or by authorial choice?
- Should the character cards be retrofitted onto Kal Arath posts, or stay a Shadowdark-season-1 thing? The components are system-agnostic either way.
- Should `/llms.txt` be linked from the site? Nothing references it; discovery is crawler-side only. Same open question as hobbinomicon — decide once for both.
