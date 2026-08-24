import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildCard, buildIndex, escapeHtml, findBrowser, isLocalImage, langOrder, localAssets, parseArgs, readResume, renderWith, selectThemes, type Theme } from '../bin/json-resume-render.cli.ts'

describe(parseArgs, () => {
  it('falls back to the default output folder and the default input glob', () => {
    expect.hasAssertions()
    const { files, out, wantsHelp } = parseArgs([])
    expect(out).toBe('dist/resumes')
    expect(wantsHelp).toBe(false)
    expect(files).toStrictEqual(expect.arrayContaining([expect.stringContaining('(JsonResume)')]))
  })

  it('reads the output folder from -o and --out', () => {
    expect.hasAssertions()
    expect(parseArgs(['-o', 'dist/cv']).out).toBe('dist/cv')
    expect(parseArgs(['--out', 'build']).out).toBe('build')
  })

  it('does not treat the value of --out as an input file', () => {
    expect.hasAssertions()
    expect(parseArgs(['--out', 'build']).files).not.toContain('build')
  })

  it('keeps the default output folder when --out has no value', () => {
    expect.hasAssertions()
    expect(parseArgs(['--out']).out).toBe('dist/resumes')
  })

  it.each([['-h'], ['--help']])('sets wantsHelp for %s', flag => {
    expect.hasAssertions()
    expect(parseArgs([flag]).wantsHelp).toBe(true)
  })

  it('keeps an existing file even when it contains no glob character', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-render-'))
    const file = path.join(directory, 'my resume.json')
    await writeFile(file, '{}', 'utf8')
    expect(parseArgs([file]).files).toStrictEqual([file])
  })

  it('deduplicates and sorts the inputs', async () => {
    expect.hasAssertions()
    const directory = await mkdtemp(path.join(tmpdir(), 'folio-render-'))
    await writeFile(path.join(directory, 'b.json'), '{}', 'utf8')
    await writeFile(path.join(directory, 'a.json'), '{}', 'utf8')
    const files: string[] = parseArgs([path.join(directory, '*.json'), path.join(directory, 'a.json')]).files
    const names = files.map(file => path.basename(file))
    expect(names).toStrictEqual(['a.json', 'b.json'])
  })

  it('drops a non existing path that matches nothing', () => {
    expect.hasAssertions()
    const missing = path.join(tmpdir(), 'folio-nope-xyz.json')
    expect(parseArgs([missing]).files).toStrictEqual([])
  })

  it('collects the theme names from -t and --theme', () => {
    expect.hasAssertions()
    expect(parseArgs(['-t', 'blue-buzz']).themeNames).toStrictEqual(['blue-buzz'])
    expect(parseArgs(['--theme', 'blue-buzz', '--theme', 'berlin-grid']).themeNames).toStrictEqual(['blue-buzz', 'berlin-grid'])
  })

  it('splits a comma separated theme list and ignores the empty parts', () => {
    expect.hasAssertions()
    expect(parseArgs(['--theme', 'blue-buzz,,berlin-grid']).themeNames).toStrictEqual(['blue-buzz', 'berlin-grid'])
  })

  it('does not treat the value of --theme as an input file', () => {
    expect.hasAssertions()
    expect(parseArgs(['--theme', 'blue-buzz']).files).not.toContain('blue-buzz')
  })

  it('asks for no theme in particular when --theme has no value', () => {
    expect.hasAssertions()
    expect(parseArgs(['--theme']).themeNames).toStrictEqual([])
  })
})

describe(selectThemes, () => {
  const themeList: Theme[] = [
    { entry: 'a', name: 'blue-buzz' },
    { entry: 'b', name: 'berlin-grid' },
  ]

  it('keeps every theme when no name is given', () => {
    expect.hasAssertions()
    expect(selectThemes(themeList, [])).toStrictEqual(themeList)
  })

  it('keeps only the named themes', () => {
    expect.hasAssertions()
    expect(selectThemes(themeList, ['berlin-grid']).map(theme => theme.name)).toStrictEqual(['berlin-grid'])
  })

  it('returns nothing when no theme matches the given names', () => {
    expect.hasAssertions()
    expect(selectThemes(themeList, ['nope'])).toStrictEqual([])
  })
})

describe(isLocalImage, () => {
  it.each([['photo.jpg'], ['./photo.jpg'], ['sub/photo.png'], ['Romain Racamier-Lafon.jpg']])('treats %s as a local file to copy', image => {
    expect.hasAssertions()
    expect(isLocalImage(image)).toBe(true)
  })

  it.each([['https://example.com/a.jpg'], ['http://example.com/a.jpg'], ['//example.com/a.jpg'], ['data:image/png;base64,AAA']])('treats %s as remote or inlined', image => {
    expect.hasAssertions()
    expect(isLocalImage(image)).toBe(false)
  })

  it('treats an empty image as nothing to copy', () => {
    expect.hasAssertions()
    expect(isLocalImage('')).toBe(false)
  })
})

describe(localAssets, () => {
  const inputPath = path.join(path.sep, 'home', 'ada', 'data', 'cv.json')

  it('collects the profile photo and the work & volunteer logos', () => {
    expect.hasAssertions()
    const content = { basics: { image: 'me.jpg' }, volunteer: [{ image: 'icons/ngo.svg' }], work: [{ image: 'icons/acme.png' }] }
    expect(localAssets(content, inputPath).map(asset => asset.target)).toStrictEqual(['me.jpg', 'icons/acme.png'.replaceAll('/', path.sep), 'icons/ngo.svg'.replaceAll('/', path.sep)])
  })

  it('resolves each target next to the resume file', () => {
    expect.hasAssertions()
    const content = { work: [{ image: 'icons/acme.png' }] }
    expect(localAssets(content, inputPath)[0]?.source).toBe(path.join(path.sep, 'home', 'ada', 'data', 'icons', 'acme.png'))
  })

  it('keeps a logo shared by two entries only once', () => {
    expect.hasAssertions()
    const content = { work: [{ image: 'icons/acme.png' }, { image: 'icons/acme.png' }] }
    expect(localAssets(content, inputPath)).toHaveLength(1)
  })

  it('skips remote logos and entries without an image', () => {
    expect.hasAssertions()
    const content = { work: [{ image: 'https://example.com/acme.png' }, {}] }
    expect(localAssets(content, inputPath)).toStrictEqual([])
  })
})

describe(langOrder, () => {
  it('sorts en before fr and both before anything else', () => {
    expect.hasAssertions()
    expect(langOrder('en')).toBeLessThan(langOrder('fr'))
    expect(langOrder('fr')).toBeLessThan(langOrder('de'))
  })

  it('gives every unknown language the same last rank', () => {
    expect.hasAssertions()
    expect(langOrder('de')).toBe(langOrder('xx'))
  })
})

describe(escapeHtml, () => {
  it('escapes the four characters that would break the index markup', () => {
    expect.hasAssertions()
    expect(escapeHtml('<a href="x">Tom & Jerry</a>')).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;')
  })

  it('escapes the ampersand first so entities are not double broken', () => {
    expect.hasAssertions()
    expect(escapeHtml('&lt;')).toBe('&amp;lt;')
  })

  it('leaves plain text untouched', () => {
    expect.hasAssertions()
    expect(escapeHtml('Romain Racamier-Lafon')).toBe('Romain Racamier-Lafon')
  })
})

/**
 * Write a resume file in a fresh temporary folder
 * @param name the file name
 * @param content the resume content
 * @returns the written file path
 */
async function writeResume(name: string, content: unknown) {
  const directory = await mkdtemp(path.join(tmpdir(), 'folio-render-'))
  const file = path.join(directory, name)
  await writeFile(file, JSON.stringify(content), 'utf8')
  return file
}

describe(readResume, () => {
  it('reads the language from the meta language field', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { name: 'Ada' }, meta: { language: 'fr' } })
    const resume = await readResume(file)
    expect(resume.lang).toBe('fr')
  })

  it('prefers the meta language field over the canonical url', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { name: 'Ada' }, meta: { canonical: 'https://example.com/en.json', language: 'fr' } })
    const resume = await readResume(file)
    expect(resume.lang).toBe('fr')
  })

  it('falls back to the meta canonical url when no language field is given', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { name: 'Ada' }, meta: { canonical: 'https://example.com/fr.json' } })
    const resume = await readResume(file)
    expect(resume.lang).toBe('fr')
  })

  it('falls back to xx when no canonical url is given', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { name: 'Ada' } })
    const resume = await readResume(file)
    expect(resume.lang).toBe('xx')
  })

  it('strips the (JsonResume) marker and the extension from the slug', async () => {
    expect.hasAssertions()
    const file = await writeResume('Romain Racamier-Lafon - CV (JsonResume).json', { basics: { name: 'Ada' } })
    const resume = await readResume(file)
    expect(resume.slug).toBe('Romain Racamier-Lafon - CV')
  })

  it('resolves a local photo next to the resume file', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { image: 'me.jpg', name: 'Ada' } })
    const resume = await readResume(file)
    expect(resume.assets).toStrictEqual([{ source: path.join(path.resolve(file, '..'), 'me.jpg'), target: 'me.jpg' }])
  })

  it('does not try to copy a remote photo', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { image: 'https://example.com/me.jpg', name: 'Ada' } })
    const resume = await readResume(file)
    expect(resume.assets).toStrictEqual([])
  })

  it('returns no asset when basics has no image', async () => {
    expect.hasAssertions()
    const file = await writeResume('cv (JsonResume).json', { basics: { name: 'Ada' } })
    const resume = await readResume(file)
    expect(resume.assets).toStrictEqual([])
  })
})

describe(buildCard, () => {
  it('renders the preview image and every file link', () => {
    expect.hasAssertions()
    const html = buildCard({
      files: [
        { href: 'cv - blue-buzz.html', label: 'en.html' },
        { href: 'cv - blue-buzz.pdf', label: 'en.pdf' },
      ],
      name: 'blue-buzz',
      preview: 'blue-buzz.png',
    })
    expect(html).toContain('src="blue-buzz.png"')
    expect(html).toContain('>en.html</a>')
    expect(html).toContain('>en.pdf</a>')
    expect(html).toContain('<h2>blue-buzz</h2>')
  })

  it('shows a placeholder when every render failed and there is no preview', () => {
    expect.hasAssertions()
    const html = buildCard({ files: [], name: 'broken-theme' })
    expect(html).toContain('no preview')
    expect(html).not.toContain('<img')
  })

  it('encodes the spaces in a file name so the link resolves', () => {
    expect.hasAssertions()
    const html = buildCard({ files: [{ href: 'my cv.html', label: 'en.html' }], name: 'berlin-grid', preview: 'berlin-grid.png' })
    expect(html).toContain('my%20cv.html')
  })

  it('escapes a theme name that would otherwise inject markup', () => {
    expect.hasAssertions()
    const html = buildCard({ files: [], name: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe(buildIndex, () => {
  it('produces a full html document with one article per card', () => {
    expect.hasAssertions()
    const html = buildIndex([
      { files: [{ href: 'a.html', label: 'en.html' }], name: 'blue-buzz', preview: 'blue-buzz.png' },
      { files: [{ href: 'b.html', label: 'fr.html' }], name: 'berlin-grid', preview: 'berlin-grid.png' },
    ])
    expect(html.startsWith('<!doctype html>')).toBe(true)
    expect(html).toContain('<title>Resumes</title>')
    expect(html.match(/<article class="card">/gu)).toHaveLength(2)
    expect(html).toContain('2 themes, click a preview to open it')
  })

  it('still produces a valid page when no theme rendered', () => {
    expect.hasAssertions()
    const html = buildIndex([])
    expect(html).toContain('0 themes')
    expect(html).not.toContain('<article')
  })
})

describe(findBrowser, () => {
  const original = process.env.PUPPETEER_EXECUTABLE_PATH

  beforeEach(() => {
    delete process.env.PUPPETEER_EXECUTABLE_PATH
  })

  afterEach(() => {
    if (original === undefined) delete process.env.PUPPETEER_EXECUTABLE_PATH
    else process.env.PUPPETEER_EXECUTABLE_PATH = original
  })

  it('prefers the browser given through the environment', () => {
    expect.hasAssertions()
    process.env.PUPPETEER_EXECUTABLE_PATH = '/custom/chrome'
    expect(findBrowser()).toBe('/custom/chrome')
  })

  it('ignores an empty environment value and falls back to a system browser', () => {
    expect.hasAssertions()
    process.env.PUPPETEER_EXECUTABLE_PATH = ''
    const found = findBrowser()
    expect(found).not.toBe('')
    if (found !== undefined) expect(found).toMatch(/chrom/iu)
  })

  it('returns a system browser path or undefined, never an arbitrary string', () => {
    expect.hasAssertions()
    const found = findBrowser()
    if (found !== undefined) expect(found).toMatch(/chrom/iu)
  })
})

describe(renderWith, () => {
  it('renders through a theme that exports render as a named export', async () => {
    expect.hasAssertions()
    const html = await renderWith({ entry: 'jsonresume-theme-blue-buzz', name: 'blue-buzz' }, { basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('Ada')
    expect(html.startsWith('<!doctype html>')).toBe(true)
  })

  it('names the offending theme when it exports no render function', async () => {
    expect.hasAssertions()
    await expect(renderWith({ entry: 'node:path', name: 'not-a-theme' }, {})).rejects.toThrow('theme "not-a-theme" does not export a render function')
  })

  it('propagates the import failure when the theme package is missing', async () => {
    expect.hasAssertions()
    await expect(renderWith({ entry: 'jsonresume-theme-does-not-exist', name: 'ghost' }, {})).rejects.toThrow(/jsonresume-theme-does-not-exist/u)
  })
})
