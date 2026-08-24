import { execFile } from 'node:child_process'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const run = promisify(execFile)

/** the ansi escape character, built from its code point so no control byte sits in this file */
const escapeChar = String.fromCodePoint(27)

/**
 * Run one of the cli scripts and capture its exit code, these tests guard the main guard :
 * the scripts export their helpers for the unit tests, they must still run as real clis
 * @param script the script path, relative to the repo root
 * @param args the command line arguments
 * @returns the exit code and both output streams
 */
async function runCli(script: string, args: string[]) {
  try {
    const { stderr, stdout } = await run('node', [script, ...args])
    return { code: 0, stderr, stdout }
  } catch (error) {
    const failure = error as { code?: number; stderr?: string; stdout?: string }
    return { code: failure.code ?? 1, stderr: failure.stderr ?? '', stdout: failure.stdout ?? '' }
  }
}

/**
 * Write a resume file in a fresh temporary folder
 * @param content the resume content, a string is written as is so invalid json can be tested
 * @returns the written file path
 */
async function writeResume(content: unknown) {
  const directory = await mkdtemp(path.join(tmpdir(), 'folio-e2e-'))
  const file = path.join(directory, 'resume.json')
  await writeFile(file, typeof content === 'string' ? content : JSON.stringify(content), 'utf8')
  return file
}

const validator = 'src/bin/json-resume-validator.cli.ts'
const renderer = 'src/bin/json-resume-render.cli.ts'
const validResume = { basics: { name: 'Ada Lovelace' }, work: [{ name: 'Analytical Engine', position: 'Engineer' }] }

describe('json-resume-validator cli', () => {
  it('exits 0 and reports success on a valid resume', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, [await writeResume(validResume)])
    expect(code).toBe(0)
    expect(stdout).toContain('all 1 file(s) are valid JSON Resume')
  })

  it('exits 1 and names the errors on an invalid resume', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, [await writeResume({})])
    expect(code).toBe(1)
    expect(stdout).toContain('1 of 1 file(s) are invalid')
    expect(stdout).toContain('basics.name is required and must not be empty')
  })

  it('exits 0 and prints the usage on --help', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, ['--help'])
    expect(code).toBe(0)
    expect(stdout).toContain('json-resume-validator')
    expect(stdout).toContain('Usage')
  })

  it('exits 1 and prints the usage when given no argument', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, [])
    expect(code).toBe(1)
    expect(stdout).toContain('Usage')
  })

  it('exits 1 when no file matches the given pattern', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, [path.join(tmpdir(), 'folio-no-match-xyz', '*.json')])
    expect(code).toBe(1)
    expect(stdout).toContain('no file found for')
  })

  it('emits a machine readable report with --json', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, ['--json', await writeResume(validResume)])
    expect(code).toBe(0)
    const report = JSON.parse(stdout)
    expect(report.isValid).toBe(true)
    expect(report.reports).toHaveLength(1)
    expect(report.reports[0].errors).toStrictEqual([])
  })

  it('reports an unparsable file as invalid rather than crashing', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, [await writeResume('{ not json')])
    expect(code).toBe(1)
    expect(stdout).toContain('cannot read or parse JSON')
  })

  it('hides passing files with --quiet but still prints the summary', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, ['--quiet', await writeResume(validResume)])
    expect(code).toBe(0)
    expect(stdout).toContain('all 1 file(s) are valid JSON Resume')
    expect(stdout.split('\n').filter(line => line.includes('resume.json'))).toStrictEqual([])
  })

  it('drops the ansi codes with --no-color', async () => {
    expect.hasAssertions()
    const { stdout } = await runCli(validator, ['--no-color', await writeResume(validResume)])
    expect(stdout).not.toContain(escapeChar)
  })

  it('keeps the ansi codes by default', async () => {
    expect.hasAssertions()
    const { stdout } = await runCli(validator, [await writeResume(validResume)])
    expect(stdout).toContain(escapeChar)
  })

  it('validates the resumes actually shipped in data/', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(validator, ['data/*.json'])
    expect(code).toBe(0)
    expect(stdout).toContain('are valid JSON Resume')
  })
})

describe('json-resume-render cli', () => {
  it('exits 0 and prints the usage on --help, without launching a browser', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(renderer, ['--help'])
    expect(code).toBe(0)
    expect(stdout).toContain('json-resume-render')
    expect(stdout).toContain('--out <folder>')
  })

  it('reports an unreadable resume instead of dumping a stack trace', async () => {
    expect.hasAssertions()
    const file = await writeResume('{ broken json')
    const { code, stderr, stdout } = await runCli(renderer, ['--out', path.join(tmpdir(), 'folio-e2e-out'), file])
    expect(code).toBe(1)
    expect(stdout).toContain('cannot read')
    expect(stdout).toContain('no readable resume file')
    expect(stderr).not.toContain('SyntaxError')
    expect(stderr).not.toContain('at JSON.parse')
  })

  it('exits 1 when the given file does not exist', async () => {
    expect.hasAssertions()
    const { code, stdout } = await runCli(renderer, [path.join(tmpdir(), 'folio-render-missing-xyz.json')])
    expect(code).toBe(1)
    expect(stdout).toContain('no resume file found')
  })
})
