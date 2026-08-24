#!/usr/bin/env node

/**
 * Validate one or more JSON files against the official JSON Resume schema,
 * plus a few essential checks the schema itself does not enforce, see essentialErrors & typographyErrors below.
 * Schema source : https://github.com/jsonresume/jsonresume.org/tree/main/packages/schema
 * Usage : node src/bin/json-resume-validator.cli.ts [options] <files...>
 */

import { globSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { argv, cwd, exit, stdout } from 'node:process'
import schema from '@jsonresume/schema/schema.json' with { type: 'json' }
import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'

type FileReport = {
  errors: string[]
  file: string
  isValid: boolean
}

const colors = {
  bold: '\u001B[1m',
  dim: '\u001B[2m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  reset: '\u001B[0m',
  yellow: '\u001B[33m',
}

/** the number of spaces used to indent the JSON report */
const jsonIndent = 2

/** the number of leading argv entries to skip, the node binary & the script path */
const cliArgvOffset = 2

const usage = `${colors.bold}json-resume-validator${colors.reset} : validate JSON files against the JSON Resume schema

${colors.bold}Usage${colors.reset}
  node src/bin/json-resume-validator.cli.ts [options] <files or globs...>

${colors.bold}Options${colors.reset}
  -h, --help     show this help
  -j, --json     output a JSON report instead of human readable text
  -q, --quiet    only report failing files
  --no-color     disable colored output

${colors.bold}Examples${colors.reset}
  node src/bin/json-resume-validator.cli.ts resume.json
  node src/bin/json-resume-validator.cli.ts "data/cv/*JsonResume*.json"

Beware, in globs the parenthesis are extglob operators, quote & escape them if needed.

Exit code is 0 when every file is valid, 1 otherwise.
`

/**
 * Parse the command line arguments
 * @param args the raw arguments, without the node & script paths
 * @returns the parsed options and the remaining file patterns
 */
export function parseArgs(args: string[]) {
  const patterns: string[] = []
  const options = { hasColor: true, isJson: false, isQuiet: false, wantsHelp: false }
  for (const arg of args)
    if (arg === '-h' || arg === '--help') options.wantsHelp = true
    else if (arg === '-j' || arg === '--json') options.isJson = true
    else if (arg === '-q' || arg === '--quiet') options.isQuiet = true
    else if (arg === '--no-color') options.hasColor = false
    else patterns.push(arg)
  return { options, patterns }
}

/**
 * Expand the given patterns into a sorted list of unique absolute file paths
 * @param patterns the file paths or globs given on the command line
 * @returns the matching file paths
 */
export function expandPatterns(patterns: string[]) {
  const files = new Set<string>()
  for (const pattern of patterns) for (const match of globSync(pattern)) files.add(path.resolve(match))
  return [...files].toSorted()
}

/**
 * Turn an Ajv error into a readable one liner
 * @param error the Ajv error object
 * @returns the human readable message
 */
export function formatError(error: ErrorObject) {
  const field = error.instancePath === '' ? 'resume' : error.instancePath.slice(1).replaceAll('/', '.')
  if (error.keyword === 'pattern' && String(error.params.pattern).includes('[1-2][0-9]{3}')) return `${field} must be a date like 2024, 2024-06 or 2024-06-29`
  const details = error.keyword === 'additionalProperties' ? ` (${String(error.params.additionalProperty)})` : ''
  return `${field} ${error.message ?? 'is invalid'}${details}`
}

/**
 * Check the things the official schema does not enforce, it has no required field at all
 * so an empty object or any random json file would be a valid JSON Resume for it
 * @param content the parsed file content
 * @returns the additional error messages
 */
export function essentialErrors(content: unknown) {
  const errors: string[] = []
  if (content === null || typeof content !== 'object' || Array.isArray(content)) return ['resume must be an object']
  const resume = content as Record<string, unknown>
  const basics = (typeof resume.basics === 'object' && resume.basics !== null ? resume.basics : {}) as Record<string, unknown>
  if (typeof basics.name !== 'string' || basics.name.trim() === '') errors.push('basics.name is required and must not be empty')
  const sections = ['work', 'education', 'volunteer', 'projects']
  const hasContent = sections.some(section => Array.isArray(resume[section]) && (resume[section] as unknown[]).length > 0)
  if (!hasContent) errors.push(`at least one non-empty section is required among : ${sections.join(', ')}`)
  return errors
}

type TextLeaf = {
  field: string
  key: string
  text: string
}

type TypographyRule = {
  /** the keys the rule does not apply to, for values that are not prose */
  exceptKeys?: string[]
  /** the languages the rule applies to, undefined means every language */
  languages?: string[]
  /** what the author should have typed instead */
  message: string
  /** the sloppy pattern to catch */
  pattern: RegExp
}

/** the number of characters shown around a match, so the offending spot is easy to locate */
const contextRadius = 20

/** urls are not prose, they are blanked out before the typography rules run */
const urlPattern = /https?:\/\/\S+/gu

/** the leaf keys holding technical values, schema urls, mail addresses, image paths, where typography rules do not apply */
const nonProseKeys = new Set(['$schema', 'email', 'image', 'lastModified', 'phone', 'url'])

/** the typography shortcuts to catch, each one maps a sloppy pattern to the proper character */
const typographyRules: TypographyRule[] = [
  { message: 'use the typographic apostrophe ’ instead of the straight quote', pattern: /'/u },
  { message: 'use the typographic quotes “ ” instead of straight double quotes', pattern: /"/u },
  { message: 'use a spaced en dash – instead of a hyphen as a separator', pattern: / - /u },
  { message: 'use an en dash – instead of a double hyphen', pattern: /--/u },
  { message: 'use the ellipsis character … instead of three dots', pattern: /\.\.\./u },
  { message: 'use a single space between words', pattern: / {2}/u },
  { message: 'trim the leading or trailing whitespace', pattern: /^\s|\s$/u },
  { languages: ['fr'], message: 'use a non-breaking space before a French : ; ! ? punctuation', pattern: / [:;!?]/u },
  { languages: ['fr'], message: 'use a non-breaking space as the thousands separator', pattern: /\d \d{3}(?!\d)/u },
  { languages: ['en'], message: 'use a comma as the thousands separator', pattern: /\d \d{3}(?!\d)/u },
  { exceptKeys: ['$schema', 'email', 'image', 'language', 'url'], message: 'start with an uppercase letter', pattern: /^\p{Ll}/u },
]

/**
 * Collect every prose string of the resume, keeping track of where it lives
 * @param value the current node, of any shape
 * @param field the dotted path of the current node, empty for the resume root
 * @param key the object key the current node hangs from, array items inherit the one of their array
 * @returns the text leaves found below the given node
 */
function collectTexts(value: unknown, field: string, key: string): TextLeaf[] {
  if (typeof value === 'string') return [{ field, key, text: value }]
  if (Array.isArray(value)) return value.flatMap((item: unknown, index) => collectTexts(item, `${field}.${index}`, key))
  if (value === null || typeof value !== 'object') return []
  return Object.entries(value)
    .filter(([entryKey]) => !nonProseKeys.has(entryKey))
    .flatMap(([entryKey, item]) => collectTexts(item, field === '' ? entryKey : `${field}.${entryKey}`, entryKey))
}

/**
 * Quote the offending part of a text, with a bit of context around it, so the error is easy to act on
 * @param text the blanked prose the rule matched in
 * @param match the regexp match
 * @returns the excerpt, ellipsed when it does not start or end the text
 */
function excerptAround(text: string, match: RegExpExecArray) {
  const from = Math.max(0, match.index - contextRadius)
  const to = Math.min(text.length, match.index + match[0].length + contextRadius)
  return `${from === 0 ? '' : '…'}${text.slice(from, to)}${to === text.length ? '' : '…'}`
}

/**
 * Check the typography of every prose string, the schema does not care about it but a resume is a printed document
 * @param content the parsed file content
 * @returns the typography error messages
 */
export function typographyErrors(content: unknown) {
  if (content === null || typeof content !== 'object' || Array.isArray(content)) return []
  const resume = content as Record<string, unknown>
  const meta = (typeof resume.meta === 'object' && resume.meta !== null ? resume.meta : {}) as Record<string, unknown>
  const language = typeof meta.language === 'string' ? meta.language : ''
  const errors: string[] = []
  for (const { field, key, text } of collectTexts(resume, '', '')) {
    const prose = text.replaceAll(urlPattern, 'url')
    for (const rule of typographyRules) {
      if (rule.languages !== undefined && !rule.languages.includes(language)) continue
      if (rule.exceptKeys?.includes(key) === true) continue
      const match = rule.pattern.exec(prose)
      if (match !== null) errors.push(`${field} ${rule.message}, near "${excerptAround(prose, match)}"`)
    }
  }
  return errors
}

/**
 * Validate a single file against the JSON Resume schema
 * @param file the absolute file path
 * @param validate the compiled Ajv validate function
 * @returns the file report
 */
export async function validateFile(file: string, validate: ValidateFunction) {
  const name = path.relative(cwd(), file)
  let content: unknown = undefined
  try {
    content = JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return { errors: [`cannot read or parse JSON : ${reason}`], file: name, isValid: false } satisfies FileReport
  }
  const errors = validate(content) ? [] : (validate.errors ?? []).map(error => formatError(error))
  errors.push(...essentialErrors(content), ...typographyErrors(content))
  return { errors, file: name, isValid: errors.length === 0 } satisfies FileReport
}

/**
 * Print the human readable report
 * @param reports the file reports
 * @param options the output options
 */
export function printReports(reports: FileReport[], options: { hasColor: boolean; isQuiet: boolean }) {
  const paint = (color: keyof typeof colors, text: string) => (options.hasColor ? `${colors[color]}${text}${colors.reset}` : text)
  for (const report of reports) {
    if (report.isValid) {
      if (!options.isQuiet) stdout.write(`${paint('green', '✓')} ${report.file}\n`)
      continue
    }
    const count = `${report.errors.length} error${report.errors.length > 1 ? 's' : ''}`
    stdout.write(`${paint('red', '✗')} ${report.file} ${paint('dim', `(${count})`)}\n`)
    for (const error of report.errors) stdout.write(`  ${paint('yellow', '•')} ${error}\n`)
  }
  const nbInvalid = reports.filter(report => !report.isValid).length
  const summary = nbInvalid === 0 ? paint('green', `all ${reports.length} file(s) are valid JSON Resume`) : paint('red', `${nbInvalid} of ${reports.length} file(s) are invalid`)
  stdout.write(`\n${summary}\n`)
}

/**
 * Read, validate & report the given files
 * @param args the raw arguments, without the node & script paths
 * @returns the process exit code
 */
export async function start(args: string[]) {
  const { options, patterns } = parseArgs(args)
  if (options.wantsHelp || patterns.length === 0) {
    stdout.write(usage)
    return options.wantsHelp ? 0 : 1
  }
  const files = expandPatterns(patterns)
  if (files.length === 0) {
    stdout.write(`no file found for : ${patterns.join(', ')}\n`)
    return 1
  }
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const reports = await Promise.all(files.map(file => validateFile(file, validate)))
  const isValid = reports.every(report => report.isValid)
  if (options.isJson) stdout.write(`${JSON.stringify({ isValid, reports }, undefined, jsonIndent)}\n`)
  else printReports(reports, options)
  return isValid ? 0 : 1
}

/** only run when invoked as a CLI, so tests can import the helpers above */
/* v8 ignore next -- the entrypoint itself only runs in a subprocess, see src/tests/cli-e2e.test.ts */
if (argv[1] !== undefined && path.resolve(argv[1]) === import.meta.filename) exit(await start(argv.slice(cliArgvOffset)))
