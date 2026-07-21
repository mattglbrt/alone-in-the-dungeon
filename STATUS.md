# STATUS — Alone in the Dungeon · updated 2026-07-21

## Now
Live and polished. Everything on the README punch list is done except newsletter. PSI mobile baseline (07-08): 98 perf / 100 / 100 / 100, LCP 2.3s — remaining points are documented closed trade-offs.

Active thread is content: Shadowdark season 1. Sessions 1–2 are committed and live. Session 3 exists as a draft shell — frontmatter plus a party grid of six placeholder characters, no prose yet.

## Next (ranked)
1. **Fill in the real character sheets.** All six cards in session 3 carry `name="NAME"` and invented stats. This is the post's stated opening obligation from session 2.
2. **Eyeball the party grid in a browser.** `npm run dev` — it was verified by HTML inspection only, never actually viewed. Check spacing and the 3/2/1-up breakpoints.
3. **Write session 3.** Level-1 advancement happened off-screen between sessions; backstories are promised alongside the stats.
4. Commit the two new components + the session 3 draft.
5. Newsletter capture (e.g. Buttondown) — the only owned re-engagement channel missing. Decide provider with hobbinomicon at the same time (same decision, two sites).

## Blockers
—

## Recently done
- 07-21 — `CharacterCard.astro` + `PartyGrid.astro` built; session 3 scaffolded as a draft.
- 07-21 — Shadowdark session 2 ending written and committed, along with the org-standard docs.
- 07-10..07-21 — Shadowdark season 1 sessions 1 & 2 copy-edited; session 1 hero image set; news section removed, `/news` → The Hobbinomicon.
- 07-08 — perf pass complete; PSI baseline recorded.

## Open questions
- Shared newsletter provider across AITD + Hobbinomicon, or separate lists?
- Season 1 arc: cult purge is the stated party goal, but two PCs are cult members. How long before that breaks, and does it break in play or by authorial choice?
- Should the character cards be retrofitted onto Kal Arath posts, or stay a Shadowdark-season-1 thing? The components are system-agnostic either way.
