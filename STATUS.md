# STATUS — Alone in the Dungeon · updated 2026-09-30

## Now
Live and deployed. `main` @ `7e0a655`, pushed; the deploy came up in ~45s. The only uncommitted change is the pre-existing `.claude/commands/wrap.md` edit.

**New today:** the first Mausritter post, "A Human Is Seventeen Mice Tall: A Mausritter Scale Guide" (`/guides/mausritter-scale-guide/`). Post tables are finally styled site-wide. Local dev no longer shows every post a day early (production never did).

Also on `main`, recorded from git (these commits weren't logged): Astro 7.3.2 upgrade (`33d38c3`), Node 24.19.0 pinned (`a515dff`).

The content thread is still the constraint: episode 1 waits on **session content and two more dwarves**.

## Next (ranked)
1. **Send one real contact-form submission** from `/contact/` and check `matt@hobbinomicon.com`, including spam. The form is registered and returns 200 as of today's deploy. Only email delivery is unverified. Delete the entry afterward.
2. **Re-measure PSI mobile** on the Mausritter post, a normal post, and the homepage, now that Astro 7.3.2 and the table CSS are live. Rewrite the CLAUDE.md baseline (the recorded 98 / LCP 2.3s is the homepage from July).
3. **Eyeball the Dolmenwood Appendix N page.** The new table styles apply there, and nobody has looked at it yet.
4. **Finish Inheritance episode 1.** It stops at the priest's "I know just where to find him." Then flip `draft: true` → `false`.
5. **The priest and the wizard.** Sheets are coming from Matt. Once they exist: names in the prose, `characters/` entries, and ids in the post's `characters` array.
6. **Link the hobby post to episode 1** (`shadowdark-repaired-something-in-me/index.mdx:77` TODO) → `/live-plays/inheritance-episode-1/` on publish.
7. **Write the six backstories** (`src/content/characters/*.mdx`, 3–5 sentences each). Unblocked.
8. **Write session 3.** Its file is frontmatter only.
9. **Newsletter capture.** Hobbinomicon went with Substack (first issue 06 Oct). Decide whether AITD shares it.
10. **Matt: Episode 1 content** — the session content and the two dwarf sheets (moved from Blockers, 10-13).

## Blockers
—

## Recently done
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
