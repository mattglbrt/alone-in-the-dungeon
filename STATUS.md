# STATUS — Alone in the Dungeon · updated 2026-10-13

## Now
Live and deployed. `main` @ `e0662f6`, pushed; the deploy came up in ~60s. The only uncommitted change is the pre-existing `.claude/commands/wrap.md` edit.

**New 10-13:** all three post-09-30 deploy checks are closed. The contact form email is confirmed. The homepage PSI is 99 / 100 / 100 / 100 (LCP 2.1s), now the baseline. The Mausritter guide gained a resources section (six links Matt uses with his kids). Two-column tables no longer shrink on phones.

The content thread is still the constraint: episode 1 waits on **session content and two more dwarves**.

## Next (ranked)
1. **PSI mobile on the Mausritter post and a normal post.** Homepage done 10-13 (99 / 100 / 100 / 100, LCP 2.1s; baseline updated in CLAUDE.md).
2. **Finish Inheritance episode 1.** It stops at the priest's "I know just where to find him." Then flip `draft: true` → `false`.
3. **The priest and the wizard.** Sheets are coming from Matt. Once they exist: names in the prose, `characters/` entries, and ids in the post's `characters` array.
4. **Link the hobby post to episode 1** (`shadowdark-repaired-something-in-me/index.mdx:77` TODO) → `/live-plays/inheritance-episode-1/` on publish.
5. **Write the six backstories** (`src/content/characters/*.mdx`, 3–5 sentences each). Unblocked.
6. **Write session 3.** Its file is frontmatter only.
7. **Newsletter capture.** Hobbinomicon went with Substack (first issue 06 Oct). Decide whether AITD shares it.
8. **Matt: Episode 1 content** — the session content and the two dwarf sheets (moved from Blockers, 10-13).

## Blockers
—

## Recently done
- 10-13 — **Deploy checks closed** (`e0662f6`). The contact form email arrived (test entry deleted). Homepage PSI 99 / 100 / 100 / 100, LCP 2.1s. Mobile table scroll is now only for 3+ columns, so the Appendix N tables fill the column (Matt checked on a phone). **Mausritter resources section** added: six links.
- 09-30 — **Mausritter scale guide shipped** (`7e0a655`), rewritten in Matt's voice from his `scale.md` GM notes. **Table styling**: sans at 0.8em, cell padding, striping; 4+ column tables break out to ~60rem on desktop; below 48rem, tables scroll inside themselves. **`formatDate` pinned to UTC**; review reading dates now use it too.
- Aug–Sep (from git) — Astro 7.3.2 upgrade, Node 24.19.0 pin, `.gitattributes`.
- 08-07 — Contact form 404 fixed (Netlify registration; rebuild, no code).
- 08-04–05 — Inheritance created: series, Borb's sheet, episode 1 draft.
- 08-03 — Post hero perf fix: 81 → 100, LCP 4.3s → 1.0s (`cb572a9`).

## Reference
Netlify site id `1189528c-0e46-41fe-b567-01731cd8fea2`. No `netlify.toml`. Build settings live in the dashboard. **A new form needs a deploy after its markup exists.** Drafts show only under `npm run dev`, not `build`/`preview`.

## Open questions
- **Mausritter rulebook specifics are unverified** ("2.3, ch. 8", the 11 entries, the stat blocks, the 12" move, the fireball ranges). They came from Matt's notes as-is.
- **Borb's level 3 and AC 8 are Claude inferences.** Confirm them.
- **Is Lady Ravenmere Lord Ravenmere's wife?** Inferred, not given.
- **All-dwarf party: coincidence or the point?** How far do the two campaigns (Shune) touch?
- **Post title** "Inheritance Episode 1" is flat against `voice.md`.
- Session-accurate rosters once someone levels up (per-post overrides?).
- `/llms.txt` link, and a nav link for `/characters/`, `/hobby/`, and `/series/`. Declined 07-27; maybe worth one look now that guides has Mausritter too.
