/**
 * Shared helpers for the GEO build outputs: the `.md` endpoints, /llms.txt,
 * and /llms-full.txt.
 *
 * These render from the *raw* MDX body rather than Astro's rendered HTML, so
 * the output stays real markdown. The only transformation is mechanical:
 * strip the MDX scaffolding (imports, JSX) and convert the handful of
 * components that carry citable text into equivalent markdown. No wording is
 * ever changed or invented.
 *
 * Ported from the hobbinomicon implementation (2026-07-21); kept deliberately
 * close to it so fixes can move between the two sites.
 */

export const SITE = 'https://aloneinthedungeon.com';

/** Absolute canonical URL for a site-relative path. */
export function canonical(path: string): string {
  const clean = `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}/`;
  return `${SITE}${clean === '//' ? '/' : clean}`;
}

/**
 * Find the index of the `>` that closes a JSX tag opening at `start`,
 * skipping over quoted attribute values so a `>` inside a description
 * doesn't end the tag early.
 */
function findTagEnd(src: string, start: number): number {
  let quote: string | null = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '>') {
      return i;
    }
  }
  return -1;
}

/** Pull `key="value"` pairs out of a JSX tag's attribute text. */
function parseProps(attrText: string): Record<string, string> {
  const props: Record<string, string> = {};
  const re = /([A-Za-z][A-Za-z0-9]*)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrText)) !== null) {
    props[m[1]] = m[2];
  }
  return props;
}

/**
 * Props whose values are JSX expressions rather than strings — `hp={7}`,
 * `stats={{ str: 16 }}`. Needed for CharacterCard, whose entire stat block
 * is numeric and is the most citable thing on a session post.
 */
function parseExprProps(attrText: string): Record<string, string> {
  const props: Record<string, string> = {};
  const re = /([A-Za-z][A-Za-z0-9]*)\s*=\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrText)) !== null) {
    // Walk to the matching brace so nested objects come through whole.
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < attrText.length && depth > 0; i++) {
      if (attrText[i] === '{') depth++;
      else if (attrText[i] === '}') depth--;
    }
    props[m[1]] = attrText.slice(m.index + m[0].length, i - 1).trim();
  }
  return props;
}

const STAT_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

/** `{ str: 16, dex: 11 }` -> `STR 16, DEX 11`, in fixed order. */
function formatStats(expr: string): string {
  const out: string[] = [];
  for (const key of STAT_KEYS) {
    const m = new RegExp(`\\b${key}\\s*:\\s*(-?\\d+)`).exec(expr);
    if (m) out.push(`${key.toUpperCase()} ${m[1]}`);
  }
  return out.join(', ');
}

/**
 * Components whose props carry text worth keeping, mapped to markdown.
 * Anything not listed here has its tags dropped; children (if any) survive,
 * which is what we want for layout-only wrappers like PartyGrid.
 */
const COMPONENT_TO_MARKDOWN: Record<
  string,
  (p: Record<string, string>, e: Record<string, string>) => string
> = {
  YouTubeEmbed: (p) =>
    p.youtubeId
      ? `[Watch on YouTube${p.title ? `: ${p.title}` : ''}](https://www.youtube.com/watch?v=${p.youtubeId})`
      : '',

  // A character sheet is dense, factual, quotable content — exactly what a
  // model would cite from a session report. Rendered as a labelled block
  // rather than a list item so the stats stay attached to the character.
  CharacterCard: (p, e) => {
    if (!p.name) return '';
    const heading = [p.name, p.title].filter(Boolean).join(' — ');
    const lines = [`**${heading}**`];

    const identity = [p.ancestry, p.charClass].filter(Boolean).join(' ');
    const level = e.level ?? p.level;
    if (identity || level) {
      lines.push(`- ${[identity, level ? `level ${level}` : ''].filter(Boolean).join(', ')}`);
    }

    const stats = e.stats ? formatStats(e.stats) : '';
    if (stats) lines.push(`- ${stats}`);

    const hp = e.hp ?? p.hp;
    const maxHp = e.maxHp ?? p.maxHp;
    const ac = e.ac ?? p.ac;
    const vitals = [
      hp ? `HP ${maxHp ? `${hp}/${maxHp}` : hp}` : '',
      ac ? `AC ${ac}` : '',
    ].filter(Boolean);
    if (vitals.length) lines.push(`- ${vitals.join(', ')}`);

    // gear={['club', 'shortbow']} -> club, shortbow
    if (e.gear) {
      const gear = [...e.gear.matchAll(/'([^']*)'|"([^"]*)"/g)]
        .map((m) => m[1] ?? m[2])
        .filter(Boolean);
      if (gear.length) lines.push(`- Gear: ${gear.join(', ')}`);
    }

    if (p.talent) lines.push(`- Talent: ${p.talent}`);
    if (p.epitaph) lines.push(`- Died: ${p.epitaph}`);
    else if (e.dead === 'true' || p.dead === 'true') lines.push('- Died during this session');

    return lines.join('\n');
  },
};

/**
 * Strip MDX scaffolding from a raw body, leaving plain markdown.
 */
export function stripMdx(body: string): string {
  // Drop import statements (all content imports are single-line).
  let out = body.replace(/^import\s+.*$/gm, '');

  let result = '';
  let i = 0;
  while (i < out.length) {
    const lt = out.indexOf('<', i);
    if (lt === -1) {
      result += out.slice(i);
      break;
    }

    const after = out[lt + 1];
    const isClose = after === '/';
    const nameStart = isClose ? lt + 2 : lt + 1;
    const isComponent = /[A-Z]/.test(out[nameStart] ?? '');

    // Not a JSX component tag (plain markdown `<`, HTML, autolink) — pass through.
    if (!isComponent) {
      result += out.slice(i, lt + 1);
      i = lt + 1;
      continue;
    }

    const end = findTagEnd(out, lt);
    if (end === -1) {
      result += out.slice(i);
      break;
    }

    result += out.slice(i, lt);

    if (!isClose) {
      const nameMatch = /^([A-Za-z0-9]+)/.exec(out.slice(nameStart, end));
      const name = nameMatch ? nameMatch[1] : '';
      const attrText = out.slice(nameStart + name.length, end).replace(/\/$/, '');
      const render = COMPONENT_TO_MARKDOWN[name];
      if (render) {
        const md = render(parseProps(attrText), parseExprProps(attrText));
        if (md) result += `\n\n${md}\n\n`;
      }
    }

    i = end + 1;
  }

  let cleaned = result.replace(/[ \t]+$/gm, '');

  // <div> only ever wraps layout here and means nothing in a markdown export —
  // drop the tags, keep what's inside.
  cleaned = cleaned.replace(/^[ \t]*<\/?div(?:\s[^>]*)?>[ \t]*$/gm, '');

  // Any other wrapper left empty once its JSX children converted out.
  let before: string;
  do {
    before = cleaned;
    cleaned = cleaned.replace(/<(\w+)(?:\s[^>]*)?>\s*<\/\1>/g, '');
  } while (cleaned !== before);

  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

export interface MarkdownDoc {
  title: string;
  description?: string;
  url: string;
  date?: Date;
  updated?: Date;
  tags?: string[];
  /** Extra frontmatter lines, e.g. `system: Shadowdark` on a session post. */
  extra?: Record<string, string | undefined>;
  body: string;
}

function yamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Render a document as markdown with a YAML frontmatter header. */
export function renderMarkdownDoc(doc: MarkdownDoc): string {
  const lines: string[] = ['---'];
  lines.push(`title: ${yamlString(doc.title)}`);
  if (doc.description) lines.push(`description: ${yamlString(doc.description)}`);
  if (doc.date) lines.push(`date: ${isoDate(doc.date)}`);
  if (doc.updated) lines.push(`updated: ${isoDate(doc.updated)}`);
  for (const [key, value] of Object.entries(doc.extra ?? {})) {
    if (value) lines.push(`${key}: ${yamlString(value)}`);
  }
  if (doc.tags?.length) {
    lines.push(`tags: [${doc.tags.map((t) => yamlString(t)).join(', ')}]`);
  }
  lines.push(`canonical: ${doc.url}`);
  lines.push('source: Alone in the Dungeon (aloneinthedungeon.com)');
  lines.push('---', '');
  lines.push(`# ${doc.title}`, '');
  const body = stripMdx(doc.body);
  if (body) lines.push(body, '');
  return lines.join('\n');
}

/** Standard plain-text response for these endpoints. */
export function textResponse(body: string, contentType = 'text/markdown'): Response {
  return new Response(body, {
    headers: { 'Content-Type': `${contentType}; charset=utf-8` },
  });
}
