# folio

Romain Racamier-Lafon's resume data, published as [JSON Resume](https://jsonresume.org) documents rendered to HTML and PDF with a set of themes.

## Skill routing

Always invoke a skill FIRST for matching requests, never answer directly.

- Brainstorm / product idea → office-hours
- Bug / error → investigate
- Ship / deploy / PR → ship
- QA / find bugs → qa
- Code review → review
- Update docs → document-release
- Weekly retro → retro
- Design system → design-consultation
- Visual audit → design-review
- Architecture review → plan-eng-review
- Save / resume progress → context-save / context-restore
- Code quality → health

## Layout

- `data/`: the resumes themselves, one JSON Resume file per language, plus the photos and, in `data/icons/`, the company logos the work & volunteer entries point at through their `image` field.
- `src/bin/json-resume-validator.cli.ts`: validates the resumes against the official schema plus a few essential checks the schema does not enforce.
- `src/bin/json-resume-render.cli.ts`: renders every resume with every theme to HTML and PDF, and builds an index page of preview cards.
- `src/themes/blue-buzz/`: a local JSON Resume theme, linked into the root package.
- `src/tests/`: the whole suite, one file per unit under test.
- `dist/resumes/`: render output, served by `pnpm dev` on port 8089.

Both CLIs export their pure helpers so they can be unit tested, and only auto-run when invoked directly (an `import.meta.url` guard at the bottom of each file). Keep that guard when editing them.

## Project docs

- `README.md`: what the project is and how to use it
- `TESTING.md`: the full testing guide
- `CHANGELOG.md`: release history
- `TODOS.md`: open work items, each with What / Why / Context / Effort / Priority

## Versioning

Version lives in `package.json`. Must follow SEMVER `major.minor.patch` format only (e.g. `1.2.3`), no fourth segment. Every release gets a `CHANGELOG.md` entry.

## Dependencies

pnpm workspace, themes are the workspace packages. Dependency versions live in the `catalog:` block of `pnpm-workspace.yaml`, the single source of truth. Never pin a version inside a `package.json`, add or bump it in the catalog instead.

## After any codebase change

Run `pnpm check` (types, formatting, lint, resume schema validation, tests). Fix all failures before done. It is also what CI runs.

Individual steps when iterating: `pnpm lint:types`, `pnpm lint:format:fix`, `pnpm lint:issues:fix`, `pnpm test:watch`.

## Linting rules

Never disable a lint rule without asking the user. Try to fix the code first, then if too complex, ask the user if they want to disable the rule for that line/file. Unused disable directives fail the lint, so remove one as soon as the code no longer needs it.

## Code practices

- **Constants**: camelCase only, never UPPER_SNAKE_CASE
- **Absent values**: `undefined`, never `null`, except when reading parsed JSON, where `null` is real data and must be handled
- **Narrowing**: fail loudly with an explicit check and message, never `x!`
- **JSDoc**: every exported helper gets a block with a one-line summary, `@param` and `@returns`
- **Reuse first**: before writing a helper or a constant, check [shuutils](https://github.com/Shuunen/shuutils), its types live in `node_modules/shuutils/dist/shuutils.d.ts`. Only write your own when the lib has nothing that fits
- **Imports**: node builtins with the `node:` prefix, sorted (oxfmt does it)
- **Formatting**: no semicolons, single quotes, 2 spaces, trailing commas, all enforced by oxfmt, never hand-format against it

## Testing practices

See [TESTING.md](TESTING.md) for the full guide. In short:

- **Coverage**: 100% is enforced by the vitest thresholds, tests make vibe coding safe
- **Framework**: Vitest 4.x, no extra assertion library
- **Globals**: `describe`, `it`, `expect` are imported from `vitest`, not global
- **File naming**: `src/tests/<subject>.test.ts` only, never `.spec.ts`
- **Naming**: `it` sentences state the behaviour, not the mechanism
- **Assertions**: assert what the code _does_, never `expect(x).toBeDefined()`
- **Table-driven**: use `it.each` rather than copy-pasting a block
- **Fixtures**: `mkdtemp(join(tmpdir(), 'folio-...'))`, never write into the repo
- **Secrets**: never import secrets, API keys or credentials into a test

Expectations:

- When writing new functions, write a corresponding test.
- When fixing a bug, write a regression test.
- When adding error handling, write a test that triggers the error.
- When adding a conditional (if/else, switch), write tests for BOTH paths.
- Never commit code that makes existing tests fail.
