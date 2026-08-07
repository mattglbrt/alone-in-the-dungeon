# STATUS — Alone in the Dungeon · updated 2026-08-07

## Now
Live and **everything is deployed**. `main` is level with `origin/main` at `8efaeb2`, working tree clean; the push deployed cleanly. No site code changed this session.

**The contact form works again.** It had been 404ing on submit because Netlify had no form registered — form detection was off when the 08-05 deploy ran, and turning it on doesn't retroactively scan a live build. A rebuild of the same commit fixed it. Form registered, POST returns 200, honeypot discards bots, email notifications go to `matt@hobbinomicon.com`.

The content thread is still the constraint and is unchanged: episode 1 waits on **session content and two more dwarves**.

## Next (ranked)
1. **Send one real contact-form submission** from the live page. Everything is verified except that the notification email actually lands (hooks can be configured and still get spam-filtered on first send). Ten seconds; delete the entry after.
2. **Finish episode 1.** The post stops at the priest saying "I know someone that will help, and I know just where to find him." Needs the search for the wizard, the rolls, how it went. Then flip `draft: true` → `false`.
3. **The priest and the wizard.** Both are unnamed in the text and have no sheets or `characters/` entries. Sheets are coming from Matt. Once they exist: name them in the prose, add the entries, and add their ids to the post's `characters` array so their cards render under the episode. The whole party will be dwarves.
4. **Link the hobby post to episode 1.** `shadowdark-repaired-something-in-me/index.mdx:77` still carries `{/* TODO: link this to the Borb solo campaign episode 1 once that post exists. */}` at the "I'll put the link right here when it's up" line. Fill with `/live-plays/inheritance-episode-1/` on publish.
5. **Write the six backstories.** `src/content/characters/*.mdx`, below the `---`, 3–5 sentences each. Unblocked, untouched for three sessions. The rival-cult premise gives all six a common spine.
6. **Write session 3.** Its file is frontmatter only; the party grid renders underneath whatever gets written.
7. **Re-measure PSI on an ordinary day** and rewrite the CLAUDE.md baseline. The recorded 98 / LCP 2.3s is the *homepage*, not a post page, and the 08-03 100 was measured on a warm edge.
8. **Newsletter capture** (e.g. Buttondown) — still the only owned re-engagement channel missing. Decide once with hobbinomicon.

## Blockers
Episode 1 can't be finished without Matt's session content and the two dwarf sheets. Everything else is unblocked.

## Recently done
- 08-07 — **Contact form 404 fixed.** Cause was Netlify form registration, not markup: detection was off at the 08-05 deploy and enabling it doesn't rescan a live build. Rebuilt `a7d7891`; form `contact` registered, POST → 200, honeypot verified discarding, notification hook → `matt@hobbinomicon.com`. No site code changed; wrap committed as `8efaeb2`, whose deploy also came up clean with the form still registered.
- 08-04–05 — **Inheritance** created: series entry, Borb's full sheet (Dwarf Witch, level 3, Gede, familiar Bitter), episode 1 draft with preface and opening scene. Premise assembled: the mercenary company thinks the job is done, the family is unburied, the Necronomicon page is still in the house, and Lord Ravenmere's ghost will hand over the manor for both. Committed and pushed as part of `f17b736`.
- 08-03 — Hero image perf fix in `PostLayout.astro` covering every post hero: `fetchpriority="high"` + `quality={70}`. Post went 81 → 100, LCP 4.3s → 1.0s (`cb572a9`).
- 08-02 — First `hobby` post shipped: "Shadowdark Repaired Something in Me" (`d7feb27`).

## Reference
Netlify site id `1189528c-0e46-41fe-b567-01731cd8fea2`. No `netlify.toml` — build settings live in the dashboard. **Any new form needs a deploy *after* its markup is in the built HTML**; the scanner only runs during deploy post-processing.

## Open questions
- **Borb's level is a Claude inference.** Two rolled talents implies levels 2 and 3, and 14 HP fits, but Matt never stated it. Same for **AC 8** (derived as 10 − 2 for DEX 7, no armor). Confirm before these numbers travel into the GEO output.
- **Is Lady Ravenmere Lord Ravenmere's wife?** Episode 1 says "neither of them was killing his wife." That relation was inferred, not given.
- **Character page and post prose have deliberately drifted.** Matt's rewrite changed wording Borb's page still carries. Syncing was declined ("do not change the prose"). Revisit only if he asks.
- **Is the all-dwarf party a coincidence or the point?** Borb left dwarven society over what it does to nature and is now recruiting exclusively from it. If the priest is deliberately assembling dwarves, nobody has told Borb why.
- **How far do the two campaigns touch?** Borb's craft is explicitly "not the kind bargained from Shune"; three of the S1 party serve Shune, and the module hints Evie Hanacarn may be her agent.
- **Post title.** "Inheritance Episode 1" matches the site's "Shadowdark Live Play Session 1" convention but is flat against `voice.md`'s "punchy, an upgrade of a lazy title."
- **Worth adding an srcset candidate below 720w?** Real bytes for phone readers; page scores 100 without it.
- **Should the review-of-the-adventure post exist separately?** The hobby post explicitly defers it until a few more sessions as a paying player.
- **Session-accurate rosters.** Posts show *current* stats; the first level-up needs a real answer (per-post overrides?).
- Shared newsletter provider across AITD + Hobbinomicon, or separate lists?
- Should `/llms.txt` be linked from the site? Same question open on hobbinomicon.
- Nav link for `/characters/`? Declined 07-27. `/hobby/` and now `/series/inheritance/` are non-empty too, so nav may deserve one look.
