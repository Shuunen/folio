import path from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-expect-error no types
import { FlatCompat } from '@eslint/eslintrc'
// @ts-expect-error no types
import js from '@eslint/js'
// @ts-expect-error no types
import shuunen from 'eslint-plugin-shuunen'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
})

//  by default next 14 had .eslintrc.json with "extends": ["next/core-web-vitals", "next/typescript"]
const config = [
  ...compat.extends('next/core-web-vitals'),
  ...shuunen.configs.base,
  // ...shuunen.configs.node,
  ...shuunen.configs.browser,
  ...shuunen.configs.typescript,
]

export default config
