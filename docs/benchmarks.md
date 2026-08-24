# Benchmarks

Timings for the commands in `package.json`, measured with [hyperfine](https://github.com/sharkdp/hyperfine).

## Current stack

| date       | command alias        | delay  | comment                              | machine              |
| ---------- | -------------------- | ------ | ------------------------------------ | -------------------- |
| 2026-08-21 | check (cold)         | 2.09 s | all 6 tasks, turbo cache bypassed    | Duc Zorin 18 Node 24 |
| 2026-08-21 | check (cached)       | 174 ms | every task a turbo cache hit         | Duc Zorin 18 Node 24 |
| 2026-08-21 | lint:types           | 417 ms | tsc 2 projects, app + node           | Duc Zorin 18 Node 24 |
| 2026-08-21 | lint:format          | 351 ms | oxfmt --check                        | Duc Zorin 18 Node 24 |
| 2026-08-21 | lint:issues          | 334 ms | oxlint, type-aware                   | Duc Zorin 18 Node 24 |
| 2026-08-21 | check:resume:custom  | 85 ms  | own validator, 4 resumes             | Duc Zorin 18 Node 24 |
| 2026-08-21 | check:resume:resumed | 332 ms | resumed validate, 2 JsonResume files | Duc Zorin 18 Node 24 |
| 2026-08-21 | test:unit            | 1.54 s | vitest run --coverage                | Duc Zorin 18 Node 24 |
| 2026-08-21 | render-node          | 13.4 s | 8 renders (html + pdf)               | Duc Zorin 18 Node 24 |
| 2026-08-21 | render-bun           | 13.2 s | same 8 renders                       | Duc Zorin 18 Bun 1.3 |

Command aliases :

- check (cold) : `hyperfine --runs 3 --warmup 1 'npx turbo run lint:types lint:format lint:issues check:resume:custom check:resume:resumed test:unit --force'`
- check (cached) : same without `--force`
- lint:types : `hyperfine --runs 5 --warmup 3 'npx tsc -p tsconfig.app.json && npx tsc -p tsconfig.node.json'`
- lint:format : `hyperfine --runs 5 --warmup 3 'npx oxfmt --check'`
- lint:issues : `hyperfine --runs 5 --warmup 3 'npx oxlint --type-aware --deny-warnings --report-unused-disable-directives'`
- check:resume:custom : `hyperfine --runs 5 --warmup 3 'node src/bin/json-resume-validator.cli.ts "data/*.json"'`
- check:resume:resumed : `hyperfine --runs 5 --warmup 3 'for file in data/*"(JsonResume)".json; do npx resumed validate "$file"; done'`
- test:unit : `hyperfine --runs 5 --warmup 2 'npx vitest run --coverage'`
- render-node : `hyperfine --runs 3 --warmup 1 'node src/bin/json-resume-render.cli.ts'`
- render-bun : `hyperfine --runs 3 --warmup 1 'bun src/bin/json-resume-render.cli.ts'`

The individual tasks are measured through their underlying binaries rather than `pnpm run`, so the numbers exclude the pnpm and turbo wrappers. `check` is measured through turbo, since scheduling is the point of that command.

Notes:

- The whole `check` gate is 2.09 s cold, less than the ~3.0 s its six tasks take added up, because turbo runs them in parallel across the 16 threads. A fully cached re-run is 174 ms, essentially just turbo's own startup.
- `render` is not part of `check` and dwarfs everything else at 13 s. See below.

## Node vs Bun on `render` (2026-08-21)

| runtime | mean ± σ         | range               | user CPU |
| ------- | ---------------- | ------------------- | -------- |
| node 24 | 13.371 s ± 7 ms  | 13.365 s … 13.379 s | 1.349 s  |
| bun 1.3 | 13.235 s ± 24 ms | 13.216 s … 13.262 s | 1.426 s  |

Bun wins by 136 ms (`1.01x`), about 1% of the wall time, and not a reason to switch runtimes on its own. The render is dominated by Puppeteer: launching Chromium and waiting on eight `page.pdf()` calls, work that happens outside the JS runtime entirely. Both runtimes burn only ~1.4 s of user CPU across the 13 s, so there is almost no JS execution left for a faster runtime to speed up. Expect the gap to matter only if the renderer ever stops shelling out to a browser.

Output equivalence: the 8 HTML files are byte-identical between the two runtimes. The 8 PDFs differ, but so do two consecutive Node runs, since Puppeteer stamps `/CreationDate` and `/ModDate` into every PDF, so they are never reproducible byte-for-byte. That is a property of the renderer, not a Node/Bun difference. The CLI otherwise runs unmodified under Bun.

Machine: AMD Ryzen 7 7800X3D (16 threads), Zorin OS 18.1.

## Historical

The rows below predate the current stack: the project was a Next.js app linted with ESLint at the time, and none of these commands exist in `package.json` any more. Kept for the record only.

| date       | command alias | delay  | comment                                  | machine           |
| ---------- | ------------- | ------ | ---------------------------------------- | ----------------- |
| 2024-10-08 | build         | 8.8 s  | initial setup                            | Duc Win11 Node 20 |
| 2024-10-08 | eslint        | 220 ms | initial with eslint 8 & only next-config | Duc Win11 Node 20 |
| 2024-10-08 | tsc           | 920 ms | initial with typescript 5.6.2            | Duc Win11 Node 20 |
| 2024-10-08 | vitest        | 1.2 s  | initial setup                            | Duc Win11 Node 20 |
| 2024-10-08 | vitest-c8     | 1.5 s  | initial setup                            | Duc Win11 Node 20 |

- build : `hyperfine --runs 3 --warmup 3 'npx next build'`
- tsc : `hyperfine --runs 4 --warmup 3 'node node_modules/typescript/bin/tsc --noEmit'`
- eslint : `hyperfine --runs 5 --warmup 3 'node node_modules/eslint/bin/eslint'`
- vitest : `hyperfine --runs 5 --warmup 3 'npx vitest --run'`
- vitest-c8 : `hyperfine --runs 5 --warmup 3 'npx vitest --coverage --run'`
