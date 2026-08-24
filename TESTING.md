# Testing

This project keeps 100% coverage. The point is not the number, it is that a full suite is what makes it safe to let an agent rewrite a CLI helper and to believe the diff.

## Framework

[Vitest](https://vitest.dev) 4.x, no extra runner or assertion library. Tests are plain TypeScript and run on the Node version pinned in `.nvmrc`.

## Running

```bash
pnpm test        # run the whole suite once
pnpm test:watch  # re-run on change while developing
pnpm check       # schema validation + the full suite, this is what CI runs
```

## Layout

Tests live in `src/tests/`, one file per unit under test:

| File                                | Covers                                                     |
| ----------------------------------- | ---------------------------------------------------------- |
| `src/tests/validator.test.ts`       | the pure helpers of `src/bin/json-resume-validator.cli.ts` |
| `src/tests/render.test.ts`          | the pure helpers of `src/bin/json-resume-render.cli.ts`    |
| `src/tests/theme-blue-buzz.test.ts` | the `render` export of `src/themes/blue-buzz/index.js`     |
| `src/tests/cli-e2e.test.ts`         | both CLIs spawned as real subprocesses                     |

## Layers

- **Unit**: the exported helpers of each CLI, called directly. Fast, no I/O beyond a temporary folder. This is where argument parsing, date formatting, escaping and the essential-field checks are pinned down.
- **Integration**: the theme's `render` is called with whole resume objects, including the two real resumes in `data/`. It exercises every internal helper through the public contract, which is exactly what `resumed` calls.
- **Smoke / E2E**: `src/tests/cli-e2e.test.ts` spawns `node src/bin/*.cli.ts` and asserts exit codes and output. Both CLIs export their helpers for the unit tests and only auto-run behind an `import.meta.url` guard, so these tests exist to prove that guard never breaks the real command line entry point.

The PDF/screenshot path of the render CLI is deliberately not covered: it drives a real Chrome through puppeteer, which is too slow and too environment-dependent for CI. Only `--help` is smoke tested there.

## Conventions

- File naming: `src/tests/<subject>.test.ts`.
- Use `describe` per function or per behaviour group, `it` sentences that state the behaviour ("exits 1 and names the errors on an invalid resume"), not the mechanism.
- Assert what the code _does_. Never `expect(x).toBeDefined()`.
- Use `it.each` for table-driven cases rather than copy-pasting a block.
- Write temporary fixtures with `mkdtemp(join(tmpdir(), 'folio-...'))`. Never write into the repo from a test.
- Never import secrets, API keys or credentials into a test.

## Expectations

- When writing a new function, write a corresponding test.
- When fixing a bug, write a regression test.
- When adding error handling, write a test that triggers the error.
- When adding a conditional, write tests for both paths.
- Never commit code that makes an existing test fail.
