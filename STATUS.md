# STATUS — Alone in the Dungeon · updated 2026-07-27

## Now
Live and polished. **Six commits sit unpushed on `main`** (ahead of `origin/main` by 6) — a whole feature is built and verified locally but not deployed.

The Shadowdark party is real: six character sheets filled from Matt's actual sheets, each with its own page at `/characters/<name>/`, a roster index, and a cast section on every session post. Sheets live in a `characters` collection and nowhere else.

The content thread is still the constraint, and it narrowed to two specific writing jobs: **six backstories** (each file has one placeholder line) and **session 3's prose** (its file is now frontmatter only — the party renders underneath automatically).

## Next (ranked)
1. **Push.** Six commits, all verified against a clean production build, none deployed. Nothing else should happen first.
2. **Write the six backstories.** `src/content/characters/*.mdx`, below the `---`. 3–5 sentences each, per Matt's spec. `npm run dev` previews live.
3. **Write session 3.** Level-1 advancement happened off-screen; session 2's stated obligation was names, stats and backstories. The cards now deliver the first two.
4. **Re-run PSI mobile.** Genuinely warranted this time, unlike after the GEO work: new pages, a new component, and six stat cards now render at the foot of session posts. Baseline to beat: 98 / 100 / 100 / 100, LCP 2.3s (07-08).
5. **Newsletter capture** (e.g. Buttondown) — still the only owned re-engagement channel missing. Decide with hobbinomicon; same decision, two sites.

## Blockers
—

## Recently done
- 07-27 — Character pages shipped: `characters` collection, `/characters/` roster, page each (backstory above sheet, then Appears In feed). Cast declared post-side; "The Cast" on every post with a spoiler note; **full sheets only on the newest episode**, since collection stats are current and would misrepresent an older session (`389377d`, `3abe7ca`, `fdd7b04`, `0689020`).
- 07-27 — Six real sheets replace the `NAME` placeholders; all 36 modifiers checked against their scores. `CharacterCard` gained eight optional props plus a list-capable `talent` (`8efda07`, `d71d5d4`).
- 07-22 — GEO port verified live; drafts visible under `npm run dev` (`72eae24`, `7dd2d30`).
- 07-08 — perf pass complete; PSI baseline recorded.

## Open questions
- **Session-accurate rosters.** Posts now show *current* stats. Mitigated by showing full sheets only on the newest episode, but the first level-up is when this needs a real answer (per-post overrides?). Cheaper to decide before it happens than after.
- **Was the 3-and-3 god split deliberate?** Shune the Vile (Malchor, Tragan, Morgan) against Gede (Bram, Pinch, Poke). Unconfirmed either way.
- Shared newsletter provider across AITD + Hobbinomicon, or separate lists?
- Should `/llms.txt` be linked from the site? Discovery is crawler-side only. Same question open on hobbinomicon — decide once for both.
- Nav link for `/characters/`? Declined 07-27; pages are reachable from posts and via breadcrumb. Revisit if the roster grows past one campaign.

## Closed this session
- ~~Cult-purge goal vs. two cultist PCs~~ — the party **is** a rival cult going after competitors. No hypocrisy to resolve, nothing to reveal. (Memory: `shadowdark-s1-rival-cult-premise`.)
- ~~Retrofit character cards onto Kal Arath?~~ — no. Cards are Shadowdark-only; Kal Arath gets its own when it needs one.
