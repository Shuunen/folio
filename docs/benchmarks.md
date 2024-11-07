
# Benchmarks

| date       | command alias | delay  | comment                                  | machine           |
| ---------- | ------------- | ------ | ---------------------------------------- | ----------------- |
| 2024-10-08 | build         | 8.8 s  | initial setup                            | Duc Win11 Node 20 |
| 2024-10-08 | eslint        | 220 ms | initial with eslint 8 & only next-config | Duc Win11 Node 20 |
| 2024-10-08 | tsc           | 920 ms | initial with typescript 5.6.2            | Duc Win11 Node 20 |
| 2024-10-08 | vitest        | 1.2 s  | initial setup                            | Duc Win11 Node 20 |
| 2024-10-08 | vitest-c8     | 1.5 s  | initial setup                            | Duc Win11 Node 20 |

Command aliases :

- build : `hyperfine --runs 3 --warmup 3 'npx next build'`
- tsc : `hyperfine --runs 4 --warmup 3 'node node_modules/typescript/bin/tsc --noEmit'`
- eslint : `hyperfine --runs 5 --warmup 3 'node node_modules/eslint/bin/eslint'`
- vitest : `hyperfine --runs 5 --warmup 3 'npx vitest --run'`
- vitest-c8 : `hyperfine --runs 5 --warmup 3 'npx vitest --coverage --run'`
