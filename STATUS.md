# STATUS — Alone in the Dungeon · updated 2026-08-03

## Now
Live, polished, and **everything is deployed** — `main` is level with `origin/main`, nothing sitting local. (The 07-27 STATUS claimed six unpushed commits; that was stale, the push had already happened.)

The site has its **first `hobby` post**: Matt's first tabletop RPG as a player since 2002, playing *The Tragedy of Ravenmere Manor* through a paid DM service. `/hobby/` had been building empty until now. It scores **100/100/100/100** mobile after a hero-image fix that applies to every post.

The content thread is still the constraint, and it grew a third job. **Six backstories**, **session 3's prose**, and now **episode 1 of Borb's solo campaign** — the sequel this post explicitly promises.

## Next (ranked)
1. **Borb's sheet, then episode 1.** Blocked on Matt only: stats, HP/AC, level, gear, spells, deity or patron, talent, the frog familiar's name, and why Borb goes back out alone. The new series has no name, slug, or `series` entry yet. Post one ends on "First session is coming. I'll put the link right here when it's up" with a TODO at the spot.
2. **Write the six backstories.** `src/content/characters/*.mdx`, below the `---`. 3–5 sentences each. `npm run dev` previews live.
3. **Write session 3.** Its file is frontmatter only; the party grid renders underneath whatever gets written.
4. **Re-measure PSI on an ordinary day** and rewrite the CLAUDE.md baseline. Today's 100 is real but inflated (see Open questions), and the recorded 98 / LCP 2.3s baseline is the *homepage*, not a post page.
5. **Newsletter capture** (e.g. Buttondown) — still the only owned re-engagement channel missing. Decide with hobbinomicon; same decision, two sites.

## Blockers
Episode 1 cannot start without Borb's character sheet from Matt. Everything else is unblocked.

## Recently done
- 08-03 — Hero image perf fix in `PostLayout.astro`, covering **every** post hero: `fetchpriority="high"` (it was eager but unprioritized, unlike the homepage featured thumb) and `quality={70}` (720w candidate 81.0 → 63.7 KiB). Post went 81 → **100**, LCP 4.3s → 1.0s (`cb572a9`). Session 1 and 2 heroes got re-encoded as a side effect.
- 08-02 — First `hobby` post shipped: "Shadowdark Repaired Something in Me" — Ravenmere Manor as a player, 10/10 for Rogue Game Masters, and the essay about Shadowdark breaking the buy-and-shelve cycle. Matt drafted; edited to `voice.md`, nine headers, hero image of Borb (`d7feb27`).
- 07-27 — Character pages shipped: `characters` collection, `/characters/` roster, page each, cast on every post, full sheets only on the newest episode (`389377d`, `3abe7ca`, `fdd7b04`, `0689020`).
- 07-22 — GEO port verified live; drafts visible under `npm run dev` (`72eae24`, `7dd2d30`).

## Open questions
- **Is today's 100 trustworthy?** Probably not at face value. The 81 was measured on a page deployed ~1 minute earlier (cold Netlify edge); the 100 on a warm one. TBT fell 130ms → 10ms when nothing touched JavaScript, which no image change explains. Re-run before recording it anywhere.
- **Worth adding an srcset candidate below 720w?** Lighthouse's *larger* finding (61.2 KiB) was the 720w file being oversized for its 356×267 display box. Left alone since the page scores 100 without it, but it's real bytes for phone readers.
- **Should the review-of-the-adventure post exist separately?** This post explicitly defers it: Matt said he'll write about being a paying player after a few more sessions.
- **Session-accurate rosters.** Posts show *current* stats. Mitigated by full sheets on the newest episode only, but the first level-up needs a real answer (per-post overrides?).
- **Was the 3-and-3 god split deliberate?** Shune the Vile (Malchor, Tragan, Morgan) against Gede (Bram, Pinch, Poke). Unconfirmed.
- Shared newsletter provider across AITD + Hobbinomicon, or separate lists?
- Should `/llms.txt` be linked from the site? Same question open on hobbinomicon — decide once for both.
- Nav link for `/characters/`? Declined 07-27. Now that `/hobby/` is non-empty too, nav may deserve one look rather than two separate calls.
