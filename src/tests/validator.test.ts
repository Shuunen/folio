import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import schema from '@jsonresume/schema/schema.json' with { type: 'json' }
import Ajv, { type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { essentialErrors, expandPatterns, formatError, parseArgs, printReports, start, typographyErrors, validateFile } from '../bin/json-resume-validator.cli.ts'

vi.mock(import('node:fs/promises'), async importOriginal => {
  const actual = await importOriginal()
  return { ...actual, readFile: vi.fn<typeof actual.readFile>(actual.readFile) as typeof actual.readFile }
})

/**
 * Compile the same Ajv validator the CLI builds, so tests exercise the real schema
 * @returns the compiled validate function
 */
function buildValidate() {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  return ajv.compile(schema)
}

/** a minimal resume that passes both the schema and the essential checks */
const validResume = { basics: { name: 'Ada Lovelace' }, work: [{ name: 'Analytical Engine', position: 'Engineer' }] }

describe(parseArgs, () => {
  it('defaults to human readable colored output with no flags', () => {
    expect.hasAssertions()
    expect(parseArgs(['resume.json'])).toStrictEqual({ options: { hasColor: true, isJson: false, isQuiet: false, wantsHelp: false }, patterns: ['resume.json'] })
  })

  it('reads every flag and keeps the rest as patterns', () => {
    expect.hasAssertions()
    const { options, patterns } = parseArgs(['-j', '--quiet', '--no-color', 'a.json', 'data/*.json'])
    expect(options).toStrictEqual({ hasColor: false, isJson: true, isQuiet: true, wantsHelp: false })
    expect(patterns).toStrictEqual(['a.json', 'data/*.json'])
  })

  it('accepts both the short and long help flags', () => {
    expect.hasAssertions()
    expect(parseArgs(['-h']).options.wantsHelp).toBe(true)
    expect(parseArgs(['--help']).options.wantsHelp).toBe(true)
  })

  it('returns no pattern when given no argument', () => {
    expect.hasAssertions()
    expect(parseArgs([]).patterns).toStrictEqual([])
  })
})

describe(essentialErrors, () => {
  it('accepts a resume with a name and one filled section', () => {
    expect.hasAssertions()
    expect(essentialErrors(validResume)).toStrictEqual([])
  })

  it('rejects an empty object, which the official schema wrongly accepts', () => {
    expect.hasAssertions()
    expect(essentialErrors({})).toStrictEqual(['basics.name is required and must not be empty', 'at least one non-empty section is required among : work, education, volunteer, projects'])
  })

  it('rejects a blank name', () => {
    expect.hasAssertions()
    expect(essentialErrors({ ...validResume, basics: { name: '   ' } })).toContain('basics.name is required and must not be empty')
  })

  it('rejects an empty work array as if the section was missing', () => {
    expect.hasAssertions()
    expect(essentialErrors({ basics: { name: 'Ada' }, work: [] })).toContain('at least one non-empty section is required among : work, education, volunteer, projects')
  })

  it.each([['education'], ['volunteer'], ['projects']])('accepts %s as the only filled section', section => {
    expect.hasAssertions()
    expect(essentialErrors({ basics: { name: 'Ada' }, [section]: [{ some: 'entry' }] })).toStrictEqual([])
  })

  it.each([
    ['null', undefined],
    ['an array', []],
    ['a string', 'nope'],
    ['a number', 42],
  ])('rejects %s as a whole resume', (_label, content) => {
    expect.hasAssertions()
    expect(essentialErrors(content)).toStrictEqual(['resume must be an object'])
  })

  it('treats a non object basics as missing rather than crashing', () => {
    expect.hasAssertions()
    expect(essentialErrors({ basics: 'Ada', work: [{ name: 'x' }] })).toStrictEqual(['basics.name is required and must not be empty'])
  })
})

describe(typographyErrors, () => {
  /** a resume whose typography is already proper, used as the base of the cases below */
  const cleanResume = { basics: { name: 'Ada Lovelace', summary: 'Une carrière d’ingénieure, en bref : des notes.' }, meta: { language: 'fr' }, work: [{ name: 'Analytical Engine', position: 'Engineer' }] }

  it('accepts a resume already using the proper characters', () => {
    expect.hasAssertions()
    expect(typographyErrors(cleanResume)).toStrictEqual([])
  })

  it.each([
    ['a straight quote', "J'ai fait ceci", 'use the typographic apostrophe ’ instead of the straight quote'],
    ['a straight double quote', 'On dit "ceci"', 'use the typographic quotes “ ” instead of straight double quotes'],
    ['a hyphen used as a separator', 'Développeur - Lead Tech', 'use a spaced en dash – instead of a hyphen as a separator'],
    ['a double hyphen', 'Vite -- et bien', 'use an en dash – instead of a double hyphen'],
    ['three dots', 'Et ainsi de suite...', 'use the ellipsis character … instead of three dots'],
    ['a double space', 'Deux  espaces', 'use a single space between words'],
    ['a trailing space', 'Une phrase ', 'trim the leading or trailing whitespace'],
    ['a leading space', ' Une phrase', 'trim the leading or trailing whitespace'],
  ])('reports %s', (_label, summary, message) => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, basics: { ...cleanResume.basics, summary } }).join('\n')).toContain(`basics.summary ${message}`)
  })

  it('reports a plain space before a French punctuation', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, basics: { ...cleanResume.basics, summary: 'Pour Enedis : rien' } })).toStrictEqual(['basics.summary use a non-breaking space before a French : ; ! ? punctuation, near "Pour Enedis : rien"'])
  })

  it('reports a plain space as the French thousands separator', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, basics: { ...cleanResume.basics, summary: 'Environ 13 000 téléchargements' } })).toStrictEqual([
      'basics.summary use a non-breaking space as the thousands separator, near "Environ 13 000 téléchargements"',
    ])
  })

  it('asks for a comma as the thousands separator in an english resume', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, basics: { name: 'Ada', summary: 'About 13 000 downloads' }, meta: { language: 'en' } })).toStrictEqual(['basics.summary use a comma as the thousands separator, near "About 13 000 downloads"'])
  })

  it('skips the language specific rules when the resume declares no language', () => {
    expect.hasAssertions()
    expect(typographyErrors({ basics: { name: 'Ada', summary: 'Enedis : 13 000 lignes' }, meta: 'Nope' })).toStrictEqual([])
  })

  it('ellipses a long text around the offending spot', () => {
    expect.hasAssertions()
    const summary = `A${'a'.repeat(49)} - ${'b'.repeat(50)}`
    expect(typographyErrors({ ...cleanResume, basics: { ...cleanResume.basics, summary } })).toStrictEqual([`basics.summary use a spaced en dash – instead of a hyphen as a separator, near "…${'a'.repeat(20)} - ${'b'.repeat(20)}…"`])
  })

  it('ignores urls, be they a whole field or quoted inside a sentence', () => {
    expect.hasAssertions()
    const work = [{ highlights: ['Voir https://acme.tld/a--b?q=o’clock pour la suite'], name: 'Acme', position: 'Dev', url: "https://acme.tld/a--b?q='x'" }]
    expect(typographyErrors({ ...cleanResume, work })).toStrictEqual([])
  })

  it('ignores the technical fields, where a straight quote or a hyphen is not a typo', () => {
    expect.hasAssertions()
    const basics = { ...cleanResume.basics, email: "o'hara--ada@acme.tld", image: 'data/ada - lovelace.jpg', phone: '+33 6 12 34 56 78' }
    expect(typographyErrors({ ...cleanResume, $schema: 'https://acme.tld/a--b', basics })).toStrictEqual([])
  })

  it('walks arrays and nested objects to name the offending field', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, work: [{ name: 'Acme' }, { highlights: ['Rien', "Création d'un truc"], name: 'Globex' }] })).toStrictEqual([
      'work.1.highlights.1 use the typographic apostrophe ’ instead of the straight quote, near "Création d\'un truc"',
    ])
  })

  it('ignores the values that are not text, like numbers and booleans', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, basics: { ...cleanResume.basics, hasDrivingLicense: true, score: 42 } })).toStrictEqual([])
  })

  it('reports a value starting with a lowercase letter', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, work: [{ name: 'acme', position: 'Engineer' }] })).toStrictEqual(['work.0.name start with an uppercase letter, near "acme"'])
  })

  it.each([['$schema'], ['email'], ['image'], ['language'], ['url']])('accepts a lowercase %s, which is an identifier rather than a sentence', key => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, work: [{ name: 'Acme', position: 'Engineer', [key]: 'acme' }] })).toStrictEqual([])
  })

  it('accepts a lowercase language inside the languages section, not just in meta', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, languages: [{ fluency: 'Courant', language: 'français' }] })).toStrictEqual([])
  })

  it.each([
    ['a digit', '13 downloads a year'],
    ['a symbol', '+33 6 12 34 56 78'],
    ['an accented uppercase', 'Élève ingénieur'],
  ])('accepts a value starting with %s, only a lowercase letter is a mistake', (_label, position) => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, work: [{ name: 'Acme', position }] })).toStrictEqual([])
  })

  it('applies the key exception to every string of an array, since items have no key of their own', () => {
    expect.hasAssertions()
    expect(typographyErrors({ ...cleanResume, work: [{ highlights: ['ok', 'Fine'], name: 'Acme' }] })).toStrictEqual(['work.0.highlights.0 start with an uppercase letter, near "ok"'])
  })

  it.each([
    ['null', undefined],
    ['an array', []],
    ['a string', 'nope'],
  ])('returns nothing for %s, which the essential checks already reject', (_label, content) => {
    expect.hasAssertions()
    expect(typographyErrors(content)).toStrictEqual([])
  })
})

describe(formatError, () => {
  it('names the root as resume when the error has no instance path', () => {
    expect.hasAssertions()
    expect(formatError({ instancePath: '', keyword: 'type', message: 'must be object', params: {}, schemaPath: '#/type' })).toBe('resume must be object')
  })

  it('turns a json pointer into a dotted path', () => {
    expect.hasAssertions()
    expect(formatError({ instancePath: '/work/0/startDate', keyword: 'type', message: 'must be string', params: {}, schemaPath: '#/type' })).toBe('work.0.startDate must be string')
  })

  it('explains the date pattern instead of dumping the regex', () => {
    expect.hasAssertions()
    expect(formatError({ instancePath: '/work/0/startDate', keyword: 'pattern', message: 'must match pattern', params: { pattern: '^([1-2][0-9]{3})' }, schemaPath: '#/pattern' })).toBe(
      'work.0.startDate must be a date like 2024, 2024-06 or 2024-06-29',
    )
  })

  it('names the offending key on an additionalProperties error', () => {
    expect.hasAssertions()
    expect(formatError({ instancePath: '/basics', keyword: 'additionalProperties', message: 'must NOT have additional properties', params: { additionalProperty: 'nickname' }, schemaPath: '#/additionalProperties' })).toBe(
      'basics must NOT have additional properties (nickname)',
    )
  })

  it('falls back to "is invalid" when Ajv gives no message', () => {
    expect.hasAssertions()
    expect(formatError({ instancePath: '/basics', keyword: 'type', params: {}, schemaPath: '#/type' })).toBe('basics is invalid')
  })
})

describe(validateFile, () => {
  it('reports a valid resume file as valid with no error', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'ok.json')
    await writeFile(file, JSON.stringify(validResume), 'utf8')
    const report = await validateFile(file, buildValidate())
    expect(report.isValid).toBe(true)
    expect(report.errors).toStrictEqual([])
  })

  it('reports unparsable json as invalid instead of throwing', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'broken.json')
    await writeFile(file, '{ not json', 'utf8')
    const report = await validateFile(file, buildValidate())
    expect(report.isValid).toBe(false)
    expect(report.errors[0]).toMatch(/^cannot read or parse JSON : /u)
  })

  it('reports a missing file as invalid instead of throwing', async () => {
    expect.hasAssertions()
    const report = await validateFile(path.join(tmpdir(), 'folio-does-not-exist.json'), buildValidate())
    expect(report.isValid).toBe(false)
    expect(report.errors[0]).toMatch(/^cannot read or parse JSON : /u)
  })

  it('catches an empty resume through the essential checks', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'empty.json')
    await writeFile(file, '{}', 'utf8')
    const report = await validateFile(file, buildValidate())
    expect(report.isValid).toBe(false)
    expect(report.errors).toContain('basics.name is required and must not be empty')
  })

  it('reports a schema violation, here a work entry that is not an array', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'bad-work.json')
    await writeFile(file, JSON.stringify({ basics: { name: 'Ada' }, work: 'nope' }), 'utf8')
    const report = await validateFile(file, buildValidate())
    expect(report.isValid).toBe(false)
    expect(report.errors.some(error => error.startsWith('work '))).toBe(true)
  })
})

describe(expandPatterns, () => {
  it('resolves matches to absolute paths, sorted and deduplicated', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    await writeFile(path.join(directory, 'b.json'), '{}', 'utf8')
    await writeFile(path.join(directory, 'a.json'), '{}', 'utf8')
    const files = expandPatterns([path.join(directory, '*.json'), path.join(directory, 'a.json')])
    expect(files).toStrictEqual([path.join(directory, 'a.json'), path.join(directory, 'b.json')])
  })

  it('returns nothing when no file matches', () => {
    expect.hasAssertions()
    const missing = path.join(tmpdir(), 'folio-no-such-dir-xyz', '*.json')
    expect(expandPatterns([missing])).toStrictEqual([])
  })
})

/**
 * Capture everything the cli writes to stdout instead of polluting the test output
 * @returns a function giving the captured text so far
 */
function captureOutput() {
  const chunks: string[] = []
  vi.spyOn(process.stdout, 'write').mockImplementation(chunk => {
    chunks.push(String(chunk))
    return true
  })
  return () => chunks.join('')
}

describe(printReports, () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lists the valid files and a green summary when everything passes', () => {
    expect.hasAssertions()
    const output = captureOutput()
    printReports([{ errors: [], file: 'a.json', isValid: true }], { hasColor: false, isQuiet: false })
    expect(output()).toBe('\u2713 a.json\n\nall 1 file(s) are valid JSON Resume\n')
  })

  it('hides the valid files when quiet', () => {
    expect.hasAssertions()
    const output = captureOutput()
    printReports([{ errors: [], file: 'a.json', isValid: true }], { hasColor: false, isQuiet: true })
    expect(output()).toBe('\nall 1 file(s) are valid JSON Resume\n')
  })

  it('details the errors of a failing file and counts them in the summary', () => {
    expect.hasAssertions()
    const output = captureOutput()
    printReports(
      [
        { errors: ['first', 'second'], file: 'b.json', isValid: false },
        { errors: [], file: 'a.json', isValid: true },
      ],
      { hasColor: false, isQuiet: false },
    )
    expect(output()).toContain('\u2717 b.json (2 errors)')
    expect(output()).toContain('  \u2022 first\n  \u2022 second\n')
    expect(output()).toContain('1 of 2 file(s) are invalid')
  })

  it('says "1 error" and not "1 errors" for a single error', () => {
    expect.hasAssertions()
    const output = captureOutput()
    printReports([{ errors: ['lonely'], file: 'b.json', isValid: false }], { hasColor: false, isQuiet: false })
    expect(output()).toContain('(1 error)')
  })

  it('wraps the output in ansi color codes when colors are on', () => {
    expect.hasAssertions()
    const output = captureOutput()
    printReports([{ errors: [], file: 'a.json', isValid: true }], { hasColor: true, isQuiet: false })
    expect(output()).toContain('\u001B[32m\u2713\u001B[0m a.json')
  })
})

describe(start, () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prints the usage and exits 0 on --help', async () => {
    expect.hasAssertions()
    const output = captureOutput()
    await expect(start(['--help'])).resolves.toBe(0)
    expect(output()).toContain('json-resume-validator')
  })

  it('prints the usage and exits 1 when given no pattern', async () => {
    expect.hasAssertions()
    const output = captureOutput()
    await expect(start([])).resolves.toBe(1)
    expect(output()).toContain('Usage')
  })

  it('exits 1 when no file matches the given pattern', async () => {
    expect.hasAssertions()
    const missing = path.join(tmpdir(), 'folio-no-such-dir-xyz', '*.json')
    const output = captureOutput()
    await expect(start([missing])).resolves.toBe(1)
    expect(output()).toContain('no file found for :')
  })

  it('exits 0 and reports success on a valid resume', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'good.json')
    await writeFile(file, JSON.stringify(validResume), 'utf8')
    const output = captureOutput()
    await expect(start([file])).resolves.toBe(0)
    expect(output()).toContain('all 1 file(s) are valid JSON Resume')
  })

  it('exits 1 and names the errors on an invalid resume', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'bad.json')
    await writeFile(file, '{}', 'utf8')
    const output = captureOutput()
    await expect(start(['--no-color', file])).resolves.toBe(1)
    expect(output()).toContain('basics.name is required and must not be empty')
  })

  it('outputs a JSON report on --json', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'good.json')
    await writeFile(file, JSON.stringify(validResume), 'utf8')
    const output = captureOutput()
    await expect(start(['--json', file])).resolves.toBe(0)
    const report = JSON.parse(output()) as unknown
    expect(report).toStrictEqual({ isValid: true, reports: [{ errors: [], file: expect.stringContaining('good.json'), isValid: true }] })
  })
})

describe('validateFile edge cases', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reports a non Error rejection, here a raw string thrown while reading', async () => {
    expect.hasAssertions()
    vi.mocked(readFile).mockRejectedValueOnce('disk on fire')
    const report = await validateFile('whatever.json', buildValidate())
    expect(report.isValid).toBe(false)
    expect(report.errors).toStrictEqual(['cannot read or parse JSON : disk on fire'])
  })

  it('survives a validator that fails without filling its errors', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-validator-'))
    const file = path.join(directory, 'good.json')
    await writeFile(file, JSON.stringify(validResume), 'utf8')
    const validate = Object.assign(() => false, { errors: undefined }) as unknown as ValidateFunction
    const report = await validateFile(file, validate)
    expect(report.errors).toStrictEqual([])
    expect(report.isValid).toBe(true)
  })
})
