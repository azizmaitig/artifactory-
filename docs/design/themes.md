# Theme library — artifact-builder design presets

Token blocks + voice for the gate-4 direction pick. **Selection rule: subject-first, never default unasked.** Pick from the subject's world (`brief > theme preset > model choices`); a vague brief gets the 3-direction step (conservative / bold / subject-derived) instead of an automatic preset. Presets are **starting points, not house styles** — each gate-4 plan must tune color/type/layout to the brief and add a signature element (ADR-001 rev; ticket 12 no-hardcoded-element doctrine).

Presets earn their place through real projects (corpus standard pending — map fog).

---

## festival-dark

Baseline preset (demoted from ADR-001's "default template"; ADR-001 is this preset's canonical record).

```css
:root {
  --bg: #0A0C0E;            /* dark base */
  --surface: #14171A;       /* layered surfaces */
  --hairline: rgba(255,255,255,0.08);
  --accent: #3FD8C4;        /* single accent (reference: teal) */
  --text-primary: #E8EAED;
  --text-secondary: #9AA4AE;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;  /* tabular-nums readouts */
  --font-body: system-ui, sans-serif;
}
```

**Voice:** sensor-lab at night — telemetry readouts, instrument feel.
**When to use:** interactive sims/tools with live numbers, physics/data readouts, engineering briefs (the festival class). Utilitarian treatment; craft, no flashy hero.

## paper-editorial

```css
:root {
  --bg: #FAF7F0;            /* warm paper */
  --surface: #FFFFFF;
  --hairline: rgba(26,24,21,0.12);
  --accent: #8A3324;        /* muted oxblood */
  --text-primary: #1A1815;  /* ink */
  --text-secondary: #6B655C;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;  /* footnotes, data */
  --font-body: Georgia, "Times New Roman", serif;              /* editorial voice */
}
```

**Voice:** printed report — doc-quality craft, restrained typography.
**When to use:** editorial briefs, reports/explainers, data stories with prose. Stronger typographic voice; display serif with restraint.

## terminal

```css
:root {
  --bg: #0A0A0A;            /* true black */
  --surface: #111111;
  --hairline: rgba(255,255,255,0.10);
  --accent: #33FF66;        /* phosphor green (alternate: #FFB000 amber) */
  --text-primary: #D8FFE8;
  --text-secondary: #7FA88C;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;  /* everything mono */
  --font-body: var(--mono);
}
```

**Voice:** raw instrument — command-line honesty, no chrome.
**When to use:** tools/utilities, log viewers, CLI-adjacent subjects, anything whose native surface is a terminal. Mono-everything is the point, not a fallback.

## bold-signal

```css
:root {
  --bg: #F5F3EE;            /* near-white */
  --surface: #FFFFFF;
  --hairline: rgba(10,10,10,0.15);
  --accent: #FF4D00;        /* one loud accent */
  --text-primary: #0A0A0A;  /* heavy black type */
  --text-secondary: #555555;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;  /* labels, readouts */
  --font-body: system-ui, sans-serif;
}
```

**Voice:** poster-grade confidence — big type, strict grid, minimal chrome.
**When to use:** exhibit/poster-like artifacts, single-claim data stories, pieces that must grab at a glance. Display weight (700+) with restraint; the signature element earns its place here most easily.

---

## Anti-slop reminder (ban list, not an allowed look)

Every preset must still pass gate-4 review: revise anything that reads like a generic default — everything centered, rounded-lg everywhere, accent bar/rail on cards, cream+serif+terracotta, near-black + lone accent as undifferentiated default, purple gradient hero, Inter/Space Grotesk default, emoji markers. And: dark is only legitimate when **chosen** — "if the background were near-black, would every text still be readable?"