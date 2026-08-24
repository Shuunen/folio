#!/usr/bin/env node

/**
 * Render JSON Resume files to standalone HTML & PDF using the JSON Resume themes listed in the README,
 * plus an index.html listing every render as a card with a preview screenshot.
 * Themes source : https://registry.jsonresume.org
 * Usage : node src/bin/json-resume-render.cli.ts [options] [files or globs...]
 */

import { existsSync, globSync } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { argv, cwd, env, exit, stdout } from 'node:process'
import { pathToFileURL } from 'node:url'

export type Theme = {
  /** package specifier to import, react based themes only expose their pre-built bundle */
  entry: string
  /** theme name as used on registry.jsonresume.org */
  name: string
}

type Renderer = {
  render?: (resume: unknown) => Promise<string> | string
}

type Resume = {
  basics?: { image?: string }
  meta?: { canonical?: string; language?: string }
  volunteer?: { image?: string }[]
  work?: { image?: string }[]
}

/** a local image referenced by a resume, `source` is where to read it, `target` where to write it, relative to the output folder */
export type Asset = {
  source: string
  target: string
}

export type Card = {
  /** the html & pdf links to show below the preview */
  files: { href: string; label: string }[]
  /** the theme name */
  name: string
  /** the preview image file name, undefined when every render failed */
  preview?: string
}

const colors = {
  bold: '\u001B[1m',
  dim: '\u001B[2m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  reset: '\u001B[0m',
}

const themes: Theme[] = [
  { entry: 'jsonresume-theme-blue-buzz', name: 'blue-buzz' },
  { entry: 'jsonresume-theme-berlin-grid/dist', name: 'berlin-grid' },
  { entry: '@jsonresume/jsonresume-theme-tokyo-modernist/dist', name: 'tokyo-modernist' },
  { entry: 'jsonresume-theme-modern-classic/dist', name: 'modern-classic' },
]

/** the number of leading argv entries to skip, the node binary & the script path */
const cliArgvOffset = 2

/** system browsers to fall back on when puppeteer has no downloaded chrome, see `pnpm exec puppeteer browsers install chrome` */
const systemBrowsers = ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']

/** languages shown first on each card, any other one is appended after */
const langPriority = ['en', 'fr']

/** preview screenshot size, taller than wide so the cards look like a page, shot at full device scale for a crisp image */
const previewWidth = 900
const previewHeight = 1200
const previewScale = 1

/** the parenthesis are wrapped in brackets so glob does not read them as an extglob group */
const defaultInput = 'data/*[(]JsonResume[)].json'
const defaultOutput = 'dist/resumes'

const usage = `${colors.bold}json-resume-render${colors.reset} : render JSON Resume files to html & pdf with every theme listed in the README

${colors.bold}Usage${colors.reset}
  node src/bin/json-resume-render.cli.ts [options] [files or globs...]

${colors.bold}Options${colors.reset}
  -h, --help          show this help
  -o, --out <folder>  output folder, defaults to ${defaultOutput}
  -t, --theme <name>  only render with these themes, repeatable or comma separated, defaults to all of them

${colors.bold}Environment${colors.reset}
  PUPPETEER_EXECUTABLE_PATH  browser to use for the pdf export, defaults to puppeteer's chrome then to a system one

${colors.bold}Examples${colors.reset}
  node src/bin/json-resume-render.cli.ts
  node src/bin/json-resume-render.cli.ts --out dist/cv "data/my resume.json"
  node src/bin/json-resume-render.cli.ts --theme blue-buzz "data/my resume.json"
`

/**
 * Parse the command line arguments
 * @param args the raw arguments, without the node & script entries
 * @returns the input files, the output folder and the help flag
 */
export function parseArgs(args: string[]) {
  const inputs: string[] = []
  const themeNames: string[] = []
  let out = defaultOutput
  let wantsHelp = false
  // the argument right after -o / --out or -t / --theme is that option value, not an input file
  let pending: 'out' | 'theme' | undefined = undefined
  for (const arg of args)
    if (pending === 'out') {
      out = arg
      pending = undefined
    } else if (pending === 'theme') {
      themeNames.push(...arg.split(',').filter(name => name.length > 0))
      pending = undefined
    } else if (arg === '-h' || arg === '--help') wantsHelp = true
    else if (arg === '-o' || arg === '--out') pending = 'out'
    else if (arg === '-t' || arg === '--theme') pending = 'theme'
    else inputs.push(arg)
  const files = (inputs.length === 0 ? [defaultInput] : inputs).flatMap(input => (existsSync(input) ? [input] : globSync(input)))
  return { files: [...new Set(files)].toSorted(), out, themeNames, wantsHelp }
}

/**
 * Pick the themes to render with, keeping the order of the available list
 * @param themeList the available themes
 * @param names the theme names asked on the command line, empty means every theme
 * @returns the themes to render with
 */
export function selectThemes(themeList: Theme[], names: string[]) {
  if (names.length === 0) return themeList
  return themeList.filter(theme => names.includes(theme.name))
}

/**
 * Load a theme and render the given resume with it
 * @param theme the theme to use
 * @param resume the parsed JSON Resume object
 * @returns the produced html
 */
export async function renderWith(theme: Theme, resume: unknown) {
  const themeModule = (await import(theme.entry)) as Renderer & { default?: Renderer }
  const render = themeModule.render ?? themeModule.default?.render
  if (typeof render !== 'function') throw new Error(`theme "${theme.name}" does not export a render function`)
  return render(resume)
}

/**
 * Find a browser puppeteer can drive : the one it downloaded itself, or a system one
 * @returns the browser path, or undefined to let puppeteer pick its own
 */
export function findBrowser() {
  if (env.PUPPETEER_EXECUTABLE_PATH !== undefined && env.PUPPETEER_EXECUTABLE_PATH !== '') return env.PUPPETEER_EXECUTABLE_PATH
  return systemBrowsers.find(browserPath => existsSync(browserPath))
}

/**
 * Tell if puppeteer downloaded a chrome of its own and it is still on disk
 * @param puppeteer the imported puppeteer module
 * @returns true when puppeteer can be left to pick its own browser
 */
function hasDownloadedBrowser(puppeteer: { executablePath: (...args: never[]) => unknown }) {
  try {
    const ownPath = puppeteer.executablePath()
    return typeof ownPath === 'string' && ownPath !== '' && existsSync(ownPath)
  } catch {
    return false
  }
}

/**
 * Open a browser to print & shoot the rendered html files, themes rely on web fonts so we wait for the network to settle
 * @returns a browser object exposing print, shoot & close methods
 */
export async function createBrowser() {
  const puppeteerModule = await import('puppeteer')
  const puppeteer = puppeteerModule.default
  const executablePath = findBrowser()
  const browser = await puppeteer.launch(hasDownloadedBrowser(puppeteer) ? {} : { executablePath })
  /**
   * Open a rendered html file and wait for its web fonts
   * @param htmlPath the html file to open
   * @returns the ready to use page
   */
  async function open(htmlPath: string) {
    const page = await browser.newPage()
    await page.setViewport({ deviceScaleFactor: previewScale, height: previewHeight, width: previewWidth })
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
    return page
  }
  return {
    close: () => browser.close(),
    /**
     * Print an html file to pdf
     * @param htmlPath the source html file
     * @param pdfPath the pdf file to write
     */
    print: async (htmlPath: string, pdfPath: string) => {
      const page = await open(htmlPath)
      try {
        // no page margin here on purpose, the themes pad their own content so their background bleeds to the paper edges
        await page.pdf({ format: 'A4', path: pdfPath, printBackground: true })
      } finally {
        await page.close()
      }
    },
    /**
     * Screenshot the top of an html file to use as a card preview
     * @param htmlPath the source html file
     * @param imagePath the png file to write
     */
    shoot: async (htmlPath: string, imagePath: string) => {
      const page = await open(htmlPath)
      try {
        // oxlint-disable-next-line id-length
        await page.screenshot({ clip: { height: previewHeight, width: previewWidth, x: 0, y: 0 }, path: imagePath, type: 'png' })
      } finally {
        await page.close()
      }
    },
  }
}

/**
 * Tell if an `image` value is a local file sitting next to the resume, and not a remote or inlined one
 * @param image the raw `image` value, from `basics` or from a work / volunteer entry
 * @returns true when the image should be copied to the output folder
 */
export function isLocalImage(image: string) {
  return image !== '' && !/^(?:[a-z][a-z\d+\-.]*:|\/\/)/iu.test(image)
}

/**
 * Collect the local images a resume points at : the profile photo and the company logos of the work & volunteer entries
 * @param content the parsed resume
 * @param inputPath the absolute path of the resume file, the images are resolved next to it
 * @returns the assets to copy, deduplicated, in the order they appear
 */
export function localAssets(content: Resume, inputPath: string) {
  const images = [content.basics?.image, ...(content.work ?? []).map(entry => entry.image), ...(content.volunteer ?? []).map(entry => entry.image)]
  const targets = images.flatMap(image => (image !== undefined && isLocalImage(image) ? [path.normalize(image)] : []))
  return [...new Set(targets)].map(target => ({ source: path.resolve(path.dirname(inputPath), target), target }))
}

/**
 * Read a resume file and figure out its language, from `meta.language` or, failing that, the `en.json` / `fr.json` ending of `meta.canonical`
 * @param file the resume file to read
 * @returns the resume content, its language, its output slug and its local images if any
 */
export async function readResume(file: string) {
  const inputPath = path.resolve(cwd(), file)
  const content = JSON.parse(await readFile(inputPath, 'utf8')) as Resume
  const assets = localAssets(content, inputPath)
  const canonical = content.meta?.canonical ?? ''
  const lang = content.meta?.language ?? /\/(?<lang>[a-z]{2})\.json$/u.exec(canonical)?.groups?.lang ?? 'xx'
  const slug = path
    .basename(inputPath)
    .replace(/\.json$/u, '')
    .replace(/\s*\(JsonResume\)\s*/u, '')
    .trim()
  return { assets, content, lang, slug }
}

/**
 * Rank a language so en comes before fr, and both before anything else
 * @param lang the two letters language code
 * @returns the sort rank
 */
export function langOrder(lang: string) {
  const index = langPriority.indexOf(lang)
  return index === -1 ? langPriority.length : index
}

/**
 * Escape a string so it can be dropped in the index html
 * @param value the raw string
 * @returns the escaped string
 */
export function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

/**
 * Build one card, a preview image on top of the html & pdf links
 * @param card the rendered theme
 * @returns the card html
 */
export function buildCard(card: Card) {
  const links = card.files.map(file => `<a href="${escapeHtml(encodeURI(file.href))}">${escapeHtml(file.label)}</a>`).join('')
  const preview = card.preview === undefined ? '<div class="shot shot-empty">no preview</div>' : `<img alt="${escapeHtml(card.name)} preview" class="shot" loading="lazy" src="${escapeHtml(encodeURI(card.preview))}">`
  return `      <article class="card">
        <a class="frame" href="${escapeHtml(encodeURI(card.files[0]?.href ?? ''))}">${preview}</a>
        <h2>${escapeHtml(card.name)}</h2>
        <nav class="links">${links}</nav>
      </article>`
}

/**
 * Build the index page listing every rendered theme as a card
 * @param cards the rendered themes
 * @returns the index html
 */
export function buildIndex(cards: Card[]) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumes</title>
  <style>
    :root { color-scheme: light dark; --bg: #f4f4f5; --card: #fff; --text: #18181b; --muted: #71717a; --line: #e4e4e7; --link: #2563eb; }
    @media (prefers-color-scheme: dark) { :root { --bg: #18181b; --card: #27272a; --text: #fafafa; --muted: #a1a1aa; --line: #3f3f46; --link: #60a5fa; } }
    * { box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; margin: 0; padding: 2rem 1.5rem 4rem; }
    header { margin: 0 auto 2rem; max-width: 2400px; }
    h1 { font-size: 1.5rem; margin: 0 0 .25rem; }
    header p { color: var(--muted); margin: 0; }
    main { display: grid; gap: 3rem; grid-template-columns: repeat(auto-fill, minmax(520px, 1fr)); margin: 0 auto; max-width: 2400px; }
    .card { background: var(--card); border: 1px solid var(--line); border-radius: .75rem; overflow: hidden; }
    .frame { background: #fff; display: block; line-height: 0; }
    .shot { aspect-ratio: ${previewWidth} / ${previewHeight}; display: block; object-fit: cover; object-position: top; width: 100%; }
    .shot-empty { align-items: center; color: var(--muted); display: flex; font-size: .875rem; justify-content: center; line-height: 1; }
    h2 { font-size: 1rem; margin: .875rem 1rem .75rem; }
    .links { border-top: 1px solid var(--line); display: flex; flex-wrap: nowrap; gap: 1rem; padding: .75rem 1rem; }
    .links a { color: var(--link); font-size: .875rem; text-decoration: none; white-space: nowrap; }
    .links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>Resumes</h1>
    <p>${cards.length} themes, click a preview to open it</p>
  </header>
  <main>
${cards.map(card => buildCard(card)).join('\n')}
  </main>
</body>
</html>
`
}

type Resumes = Awaited<ReturnType<typeof readResume>>[]

/**
 * Read every given resume file, reporting the unreadable ones instead of failing on them
 * @param files the resume file paths
 * @returns the resumes that could be read
 */
async function readResumes(files: string[]) {
  const results = await Promise.all(
    files.map(async file => {
      try {
        return await readResume(file)
      } catch (error) {
        stdout.write(`${colors.red}✗${colors.reset} cannot read ${file} ${colors.dim}${error instanceof Error ? error.message : String(error)}${colors.reset}\n`)
        return undefined
      }
    }),
  )
  return results.filter(resume => resume !== undefined)
}

/**
 * Copy the local photos & company logos next to the rendered html, themes point at the `image` values as-is
 * @param resumes the resumes to take the images from
 * @param outPath the output folder
 */
async function copyAssets(resumes: Resumes, outPath: string) {
  const assets = [...new Map(resumes.flatMap(resume => resume.assets).map(asset => [asset.target, asset])).values()]
  const found = assets.filter(asset => {
    if (existsSync(asset.source)) return true
    stdout.write(`${colors.red}✗${colors.reset} photo not found ${colors.dim}${asset.source}${colors.reset}\n`)
    return false
  })
  await Promise.all(
    found.map(async asset => {
      const destination = path.join(outPath, asset.target)
      await mkdir(path.dirname(destination), { recursive: true })
      await copyFile(asset.source, destination)
    }),
  )
}

/**
 * Render every resume with a single theme, into its html, pdf and preview screenshot
 * @param context the browser, output folder, resumes and theme to use
 * @returns the theme card and how many renders failed
 */
async function renderTheme(context: { browser: Awaited<ReturnType<typeof createBrowser>>; outPath: string; resumes: Resumes; theme: Theme }) {
  const { browser, outPath, resumes, theme } = context
  stdout.write(`\n${colors.bold}${theme.name}${colors.reset}\n`)
  const card: Card = { files: [], name: theme.name }
  let failures = 0
  // oxlint-disable-next-line no-await-in-loop
  for (const resume of resumes) failures += await renderOne({ browser, card, outPath, resume, theme })
  return { card, failures }
}

/**
 * Render one resume with one theme, adding its links to the theme card
 * @param context the browser, card being built, output folder, resume and theme to use
 * @returns 1 when the render failed, 0 otherwise
 */
async function renderOne(context: { browser: Awaited<ReturnType<typeof createBrowser>>; card: Card; outPath: string; resume: Resumes[number]; theme: Theme }) {
  const { browser, card, outPath, resume, theme } = context
  const htmlName = `${resume.slug} - ${theme.name}.html`
  const target = path.join(outPath, htmlName)
  try {
    await writeFile(target, await renderWith(theme, resume.content), 'utf8')
    await browser.print(target, target.replace(/\.html$/u, '.pdf'))
    card.files.push({ href: htmlName, label: `${resume.lang}.html` }, { href: htmlName.replace(/\.html$/u, '.pdf'), label: `${resume.lang}.pdf` })
    if (card.preview === undefined) {
      const previewName = `${theme.name}.png`
      await browser.shoot(target, path.join(outPath, previewName))
      card.preview = previewName
    }
    stdout.write(`${colors.green}✓${colors.reset} ${resume.lang} ${colors.dim}html + pdf${colors.reset}\n`)
    return 0
  } catch (error) {
    stdout.write(`${colors.red}✗${colors.reset} ${resume.lang} ${colors.dim}${error instanceof Error ? error.message : String(error)}${colors.reset}\n`)
    return 1
  }
}

/**
 * Tell the user that no theme matches what was asked on the command line
 * @param themeList the available themes
 * @param names the theme names asked on the command line
 * @returns the process exit code, always a failure
 */
function reportNoTheme(themeList: Theme[], names: string[]) {
  stdout.write(`${colors.red}✗${colors.reset} no theme named ${names.join(', ')}, available themes : ${themeList.map(theme => theme.name).join(', ')}\n`)
  return 1
}

/**
 * Sort the resumes, copy their photos, render each of them with every theme then write the index page listing them
 * @param context the output folder, the resumes and the themes to render with
 * @returns how many renders failed
 */
async function renderAll(context: { outPath: string; resumes: Resumes; themeList: Theme[] }) {
  const { outPath, resumes, themeList } = context
  resumes.sort((one, two) => langOrder(one.lang) - langOrder(two.lang))
  await copyAssets(resumes, outPath)
  const browser = await createBrowser()
  const cards: Card[] = []
  let failures = 0
  for (const theme of themeList) {
    // oxlint-disable-next-line no-await-in-loop
    const result = await renderTheme({ browser, outPath, resumes, theme })
    failures += result.failures
    if (result.card.files.length > 0) cards.push(result.card)
  }
  await browser.close()
  await writeFile(path.join(outPath, 'index.html'), buildIndex(cards), 'utf8')
  return failures
}

/**
 * Render every resume with every theme, then write the index page
 * @param args the raw arguments, without the node & script entries
 * @param themeList the themes to render with, injectable so tests can use a fake one
 * @returns the process exit code
 */
export async function start(args: string[], themeList: Theme[] = themes) {
  const { files, out, themeNames, wantsHelp } = parseArgs(args)
  if (wantsHelp) {
    stdout.write(usage)
    return 0
  }
  if (files.length === 0) {
    stdout.write(`${colors.red}✗${colors.reset} no resume file found\n`)
    return 1
  }
  const selected = selectThemes(themeList, themeNames)
  if (selected.length === 0) return reportNoTheme(themeList, themeNames)
  const outPath = path.resolve(cwd(), out)
  await mkdir(outPath, { recursive: true })
  const resumes = await readResumes(files)
  if (resumes.length === 0) {
    stdout.write(`${colors.red}✗${colors.reset} no readable resume file\n`)
    return 1
  }
  const failures = await renderAll({ outPath, resumes, themeList: selected })
  const total = files.length * selected.length
  stdout.write(`\n${total - failures}/${total} renders in ${out}, open ${out}/index.html\n`)
  return failures === 0 ? 0 : 1
}

/** only run when invoked as a CLI, so tests can import the helpers above */
/* v8 ignore next -- the entrypoint itself only runs in a subprocess, see src/tests/cli-e2e.test.ts */
if (argv[1] !== undefined && path.resolve(argv[1]) === import.meta.filename) exit(await start(argv.slice(cliArgvOffset)))
