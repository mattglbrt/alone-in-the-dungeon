# Session Log — Alone in the Dungeon

Append-only. **Newest entry first.**

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
