# TODOS

## Resumes

### Add a lang flag switch

**What:** Let the render CLI pick which language to render instead of always rendering every resume it finds.

**Why:** Rendering both the French CV and the English resume with every theme means a full Chrome run each time. Most of the time you only want one language.

**Context:** Carried over from the previous site's todo list. `src/bin/json-resume-render.cli.ts` already knows each resume's language: `readResume` reads it from `meta.canonical`, and `langOrder` sorts on it. A `--lang fr` flag would filter `resumes` right after that sort. Note the language is now read from the canonical file name only, so a resume with no `meta.canonical` and no `meta.language` reports `xx`.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Site

### Add some illustrations

**What:** Add illustrations to the site, for example from <https://iconpark.oceanengine.com/illustrations/18>.

**Why:** The pages read as plain text and could use some visual warmth.

**Context:** Carried over from the previous site's todo list. The Vue, Vite and Tailwind site this referred to was removed in 5.0.0, so this item is waiting on the new site. Revisit once that exists and it is clear which pages need artwork.

**Effort:** M
**Priority:** P4
**Depends on:** The new website

## Completed

- Replace WeSave by Amundi WeSave and put the Amundi logo on the resume
