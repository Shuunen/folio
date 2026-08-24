# Changelog

All notable changes to this project are documented in this file.

## [5.0.0] - 2026-08-24

The folio is now a JSON Resume repository. The resumes themselves are the source of truth, and they are rendered to standalone HTML and PDF with a set of themes instead of being hand maintained as a website.

### Added in 5.0.0

- Two JSON Resume files in `data/`, one French CV and one English resume, updated from LinkedIn and validated against the official schema.
- `pnpm render` renders every resume with every theme to HTML and PDF in `dist/resumes/`, plus an `index.html` listing each theme as a card with a preview screenshot. Browse it with `pnpm dev`.
- `pnpm check` validates every resume against the JSON Resume schema, with a few essential checks the schema itself does not enforce, such as requiring a name and at least one filled section.
- `blue-buzz`, a custom theme in `src/themes/blue-buzz` mimicking the DoYouBuzz minimal design: blue accent, profile on top, 70/30 two column body, and section titles localized in English or French from the resume itself.
- A vitest suite covering both CLI scripts and the theme, run by `pnpm check` and by CI.
- The validator also checks the typography of every prose string, since a resume is a printed document : typographic apostrophes and quotes, en dashes, the ellipsis character, single spaces, French non-breaking spaces before `: ; ! ?`, thousands separators, and a leading uppercase letter.
- `--theme <name>` narrows a render to one or more themes, and `pnpm render:blue` is the shortcut for `blue-buzz`, with a `render:blue:watch` variant that re-renders on every change to the theme, the CLIs or the resumes.
- `blue-buzz` emphasizes the words listed in `data/keyword.txt` wherever they appear in a free text, so the technologies stand out when the resume is skimmed.

### Changed in 5.0.0

- The version is now `5.0.0`: the previous Vue, Vite and Tailwind site is gone and nothing from the old page carries over.
- CI runs `pnpm check`, which now covers schema validation and the test suite.
- `pnpm check` runs its steps through turbo, so an unchanged step is served from cache instead of being run again.
- The CLIs and the theme moved under `src/`, next to the test suite, and the resumes are validated twice : by the custom validator and by `resumed validate`.

### Fixed in 5.0.0

- `blue-buzz` read any seven character value as a year and month, so a `startDate` of `someday` was shown as `Dec 2000`. The raw value is kept instead.
- `blue-buzz` guessed the language from a bare `fr` anywhere in the resume, so an English resume served from a `.fr` domain, or one whose title contained `FR`, was rendered with French section titles. The language now comes from the canonical file name.
- The renderer reported a malformed resume with a raw stack trace. It now names the file, keeps going with the readable ones, and exits cleanly when none can be read.
- A failing PDF export or screenshot left its browser page open. Pages are now always closed.

### Removed in 5.0.0

- The Vue, Vite and Tailwind website, its pages, components, assets and configuration.
- The old resume documents in PDF and DOCX form, superseded by the JSON Resume files.
