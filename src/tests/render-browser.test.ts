import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execPath } from 'node:process'
import { pathToFileURL } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBrowser, start, type Theme } from '../bin/json-resume-render.cli.ts'

vi.mock(import('node:fs/promises'), async importOriginal => {
  const actual = await importOriginal()
  return { ...actual, readFile: vi.fn<typeof actual.readFile>(actual.readFile) as typeof actual.readFile }
})

const page = {
  addStyleTag: vi.fn<(options: unknown) => Promise<void>>(),
  close: vi.fn<() => Promise<void>>(),
  goto: vi.fn<(url: string, options: unknown) => Promise<void>>(),
  pdf: vi.fn<(options: unknown) => Promise<void>>(),
  screenshot: vi.fn<(options: unknown) => Promise<void>>(),
  setViewport: vi.fn<(viewport: unknown) => Promise<void>>(),
}

const browser = { close: vi.fn<() => Promise<void>>(), newPage: vi.fn<() => typeof page>(() => page) }
const launch = vi.fn<(options: unknown) => typeof browser>(() => browser)
const executablePath = vi.fn<() => string>(() => execPath)

// oxlint-disable-next-line vitest/prefer-import-in-mock -- only a slice of puppeteer is mocked, the dynamic import form asks for the whole module
vi.mock('puppeteer', () => ({ default: { executablePath: () => executablePath(), launch: (options: unknown) => launch(options) } }))

/** the local theme, the only one guaranteed to be linked in this workspace */
const localTheme: Theme = { entry: 'jsonresume-theme-blue-buzz', name: 'blue-buzz' }

/** a minimal resume the local theme can render */
const resume = { basics: { name: 'Ada Lovelace' }, meta: { canonical: 'https://example.com/en.json' }, work: [{ name: 'Analytical Engine', position: 'Lead' }] }

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

/**
 * Write files in a fresh temporary folder
 * @param files the file name to content map, an object content is written as JSON
 * @returns the folder holding them
 */
async function makeFolder(files: Record<string, unknown>) {
  const directory = await mkdtemp(path.join(tmpdir(), 'folio-render-'))
  await Promise.all(
    Object.entries(files).map(async ([name, content]) => {
      const target = path.join(directory, name)
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, typeof content === 'string' ? content : JSON.stringify(content), 'utf8')
    }),
  )
  return directory
}

/** give every mock back its default behaviour, puppeteer knowing where its own chrome sits */
function resetMocks() {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  executablePath.mockReturnValue(execPath)
}

describe(createBrowser, () => {
  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('lets puppeteer pick its own chrome when it downloaded one', async () => {
    expect.hasAssertions()
    await createBrowser()
    expect(launch).toHaveBeenCalledWith({})
  })

  it('falls back to a system browser when puppeteer has no chrome of its own', async () => {
    expect.hasAssertions()
    executablePath.mockReturnValue('')
    await createBrowser()
    expect(launch).toHaveBeenCalledWith({ executablePath: expect.anything() })
  })

  it('falls back to a system browser when puppeteer cannot even tell where its chrome is', async () => {
    expect.hasAssertions()
    executablePath.mockImplementation(() => {
      throw new Error('no browser configured')
    })
    await createBrowser()
    expect(launch).toHaveBeenCalledWith({ executablePath: expect.anything() })
  })

  it('prints a page to pdf and always closes it', async () => {
    expect.hasAssertions()
    const driver = await createBrowser()
    await driver.print('/tmp/a.html', '/tmp/a.pdf')
    const url = pathToFileURL('/tmp/a.html').href
    expect(page.goto).toHaveBeenCalledWith(url, { waitUntil: 'networkidle0' })
    expect(page.addStyleTag).not.toHaveBeenCalled()
    expect(page.pdf).toHaveBeenCalledWith(expect.objectContaining({ format: 'A4', path: '/tmp/a.pdf' }))
    expect(page.close).toHaveBeenCalledWith()
  })

  it('shoots the top of a page and always closes it', async () => {
    expect.hasAssertions()
    const driver = await createBrowser()
    await driver.shoot('/tmp/a.html', '/tmp/a.png')
    expect(page.setViewport).toHaveBeenCalledWith(expect.objectContaining({ height: 1200, width: 900 }))
    expect(page.screenshot).toHaveBeenCalledWith(expect.objectContaining({ path: '/tmp/a.png', type: 'png' }))
    expect(page.close).toHaveBeenCalledWith()
  })

  it('closes the underlying browser', async () => {
    expect.hasAssertions()
    const driver = await createBrowser()
    await driver.close()
    expect(browser.close).toHaveBeenCalledWith()
  })
})

describe(start, () => {
  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('prints the usage and exits 0 on --help', async () => {
    expect.hasAssertions()
    const output = captureOutput()
    await expect(start(['--help'])).resolves.toBe(0)
    expect(output()).toContain('json-resume-render')
    expect(launch).not.toHaveBeenCalled()
  })

  it('exits 1 when no resume file matches', async () => {
    expect.hasAssertions()
    const missing = path.join(tmpdir(), 'folio-no-such-dir-xyz', '*.json')
    const output = captureOutput()
    await expect(start([missing])).resolves.toBe(1)
    expect(output()).toContain('no resume file found')
  })

  it('renders only the theme asked with --theme', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'good.json': resume })
    const other: Theme = { entry: 'unused', name: 'other' }
    const output = captureOutput()
    await expect(start(['--out', path.join(directory, 'out'), '--theme', localTheme.name, path.join(directory, 'good.json')], [localTheme, other])).resolves.toBe(0)
    expect(output()).toContain('1/1 renders')
  })

  it('exits 1 and lists the available themes when --theme matches none', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'good.json': resume })
    const output = captureOutput()
    await expect(start(['--out', path.join(directory, 'out'), '--theme', 'nope', path.join(directory, 'good.json')], [localTheme])).resolves.toBe(1)
    expect(output()).toContain('no theme named nope')
    expect(output()).toContain(localTheme.name)
    expect(launch).not.toHaveBeenCalled()
  })

  it('exits 1 when every matched file is unreadable', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'broken.json': 'not json at all' })
    const output = captureOutput()
    await expect(start(['--out', path.join(directory, 'out'), path.join(directory, 'broken.json')])).resolves.toBe(1)
    expect(output()).toContain('cannot read')
    expect(output()).toContain('no readable resume file')
  })

  it('skips an unreadable resume, here one failing with a non Error, and renders the others', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'a-broken.json': '{}', 'b-good.json': resume })
    vi.mocked(readFile).mockRejectedValueOnce('disk on fire')
    const output = captureOutput()
    await expect(start(['--out', path.join(directory, 'out'), path.join(directory, '*.json')], [localTheme])).resolves.toBe(0)
    expect(output()).toContain('disk on fire')
    // the summary counts the render attempts, an unreadable file is reported above but not counted as a failure
    expect(output()).toContain('2/2 renders')
  })

  it('copies a local photo next to the renders and warns about a missing one', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({
      'me.jpg': 'not really a jpeg',
      'with-photo.json': { ...resume, basics: { ...resume.basics, image: 'me.jpg' } },
      'without-photo.json': { ...resume, basics: { ...resume.basics, image: 'gone.jpg' }, meta: { canonical: 'https://example.com/fr.json' } },
    })
    const out = path.join(directory, 'out')
    const output = captureOutput()
    await expect(start(['--out', out, path.join(directory, '*.json')], [localTheme])).resolves.toBe(0)
    expect(output()).toContain('photo not found')
    const copied = await readFile(path.join(out, 'me.jpg'), 'utf8')
    expect(copied).toBe('not really a jpeg')
  })

  it('copies a company logo into its subfolder of the output', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({
      'icons/acme.svg': '<svg/>',
      'with-logo.json': { ...resume, work: [{ image: 'icons/acme.svg', name: 'Acme', position: 'Lead' }] },
    })
    const out = path.join(directory, 'out')
    await expect(start(['--out', out, path.join(directory, '*.json')], [localTheme])).resolves.toBe(0)
    await expect(readFile(path.join(out, 'icons', 'acme.svg'), 'utf8')).resolves.toBe('<svg/>')
  })

  it('counts a failing theme, keeps no card for it and exits 1', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'boom.js': "throw 'theme exploded'", 'good.json': resume })
    const out = path.join(directory, 'out')
    const broken: Theme = { entry: pathToFileURL(path.join(directory, 'boom.js')).href, name: 'broken' }
    const output = captureOutput()
    await expect(start(['--out', out, path.join(directory, 'good.json')], [broken])).resolves.toBe(1)
    expect(output()).toContain('theme exploded')
    expect(output()).toContain('0/1 renders')
    const index = await readFile(path.join(out, 'index.html'), 'utf8')
    expect(index).toContain('0 themes')
  })

  it('reports a theme that does not export a render function', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'good.json': resume, 'silent.js': 'export const hello = 1' })
    const silent: Theme = { entry: pathToFileURL(path.join(directory, 'silent.js')).href, name: 'silent' }
    const output = captureOutput()
    await expect(start(['--out', path.join(directory, 'out'), path.join(directory, 'good.json')], [silent])).resolves.toBe(1)
    expect(output()).toContain('does not export a render function')
  })

  it('renders every resume with every theme and writes the index page', async () => {
    expect.hasAssertions()
    const directory = await makeFolder({ 'good.json': resume })
    const out = path.join(directory, 'out')
    const output = captureOutput()
    await expect(start(['--out', out, path.join(directory, 'good.json')], [localTheme])).resolves.toBe(0)
    expect(output()).toContain('1/1 renders')
    const html = await readFile(path.join(out, 'good - blue-buzz.html'), 'utf8')
    expect(html).toContain('Ada Lovelace')
    const index = await readFile(path.join(out, 'index.html'), 'utf8')
    expect(index).toContain('blue-buzz.png')
    expect(browser.close).toHaveBeenCalledWith()
  })
})
