# STATUS — Alone in the Dungeon · updated 2026-11-17

## Now
Live and deployed. The site copy now carries the **wider scope** (Matt, 2026-11-17): solo play first (wargames and RPGs), then TTRPGs at large and the hobby. Solo RPGs are TTRPGs, so copy never lists them as separate categories. Philosophy and the occult are not topics; they show up only where they come naturally in posts.

**Inheritance is removed.** The Borb solo campaign is still coming under another name, so Borb's sheet and the essay's "Borb isn't done" promise stay.

Nothing is in flight in code. The next site work waits on December's videos.

## Next (ranked)
1. **Substack subscribe button.** Points at the Alone in the Dungeon publication (one `mattglbrt` account, no second list). Needs the publication URL from Matt. First issue Tue 19 Jan 2027.
2. **When the first videos exist** (production starts in December, four banked, the solo RPG kit remake first; regular publishing from the week of Mon 4 Jan 2027):
   - Hobby tips go in as `hobby` posts, the kit remake as a `guides` post, both `format: video`. No build needed.
   - KDM videos go in as live-play posts with `system: Kingdom Death: Monster`, linking the KDM channel.
   - Decide then: a `/vlogs/` section (no current type fits vlogs) and moving Hobby to the top nav.
3. **The Borb solo campaign.** New series when Matt has its name and first session; attach Borb's sheet and fill the essay's link (`shadowdark-repaired-something-in-me/index.mdx:77` TODO).
4. **Shadowdark session 3** is still a frontmatter-only draft.

## Blockers
—

## Notes
- **Not decided:** the mix of solo to general content. The strategy doc proposes three in four uploads solo. Matt decides Sun 3 Jan 2027.
- **Goal:** the first 100 subscribers on the YouTube channel, and the same on the KDM channel.
- The Convergence stories for Garreth Vale, Triste and Eloryn Vale stay published. Matt considered removing them on 11-17 and kept them. `draft: true` hides a post without deleting it.

## Recently done
- 11-17 — **Scope copy pass** (`c4be894`): meta, schema, RSS and llms.txt descriptions widened; two new lines on the about page. **Inheritance removed** (`c52808f`): series and episode 1 draft deleted, `/series/inheritance/` 301s to `/series/`, Borb's sheet detached and kept.
- 11-01 — **Mac migration done.** fnm + Node 24.19.0 (the system node is v26). Build, Pagefind and dev all clean. No `.env` needed. npm 11 skipped esbuild/fsevents install scripts (allowScripts); the build doesn't need them.
- 10-13 — **Deploy checks closed** (`e0662f6`). Contact form verified. Homepage PSI 99 / 100 / 100 / 100, LCP 2.1s. Mausritter resources section added.
- 09-30 — **Mausritter scale guide shipped** (`7e0a655`). Table styling. `formatDate` pinned to UTC.

## Reference
Netlify site id `1189528c-0e46-41fe-b567-01731cd8fea2`. No `netlify.toml`. Build settings live in the dashboard. **A new form needs a deploy after its markup exists.** Drafts show only under `npm run dev`, not `build`/`preview`.

**YouTube.** KDM channel: "Alone in the Dungeon: KDM", https://www.youtube.com/channel/UC8605grw5cw-xlThSBW304g (renamed 11-17). Subscribers on 11-17: 0 on the main channel, 0 on KDM, no videos on either yet. The strategy docs still need these (orchestrator).

**Footer byline** is "A Matt Gilbert joint." linking to mattglbrt.com. Matt kept that wording over "By Matt Gilbert".

## Open questions
- **Mausritter rulebook specifics are unverified** ("2.3, ch. 8", the 11 entries, the stat blocks, the 12" move, the fireball ranges). They came from Matt's notes as-is.
- **Borb's level 3 and AC 8 are Claude inferences.** Confirm them.
- The homepage schema description says "tips, and vlogs" before either exists on the site. Fine if December delivers; trim it otherwise.
- Session-accurate rosters once someone levels up (per-post overrides?).
- `/llms.txt` link, and a nav link for `/characters/` and `/series/`. Declined 07-27.
