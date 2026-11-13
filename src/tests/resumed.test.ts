import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, vi } from 'vitest'
import { validateAll, validateFile } from '../bin/json-resume-resumed.cli.ts'

/**
 * Write empty json files in a fresh temporary folder
 * @param names the file names to create
 * @returns the folder holding them
 */
async function makeFolder(names: string[]) {
  const directory = await mkdtemp(path.join(tmpdir(), 'folio-resumed-'))
  await Promise.all(names.map(name => writeFile(path.join(directory, name), '{}', 'utf8')))
  return directory
}

/**
 * Build a glob matching files in a folder
 * @param directory the folder to look into
 * @param pattern the file pattern
 * @returns the glob, with forward slashes on every platform
 */
function globIn(directory: string, pattern: string) {
  return path.join(directory, pattern).split(path.sep).join('/')
}

describe(validateAll, () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('succeeds when every matching file is valid', async () => {
    expect.hasAssertions()
    vi.spyOn(process.stdout, 'write').mockReturnValue(true)
    const validate = vi.fn<(file: string) => boolean>(() => true)
    const directory = await makeFolder(['a.json', 'b.json'])
    expect(validateAll(globIn(directory, '*.json'), validate)).toBe(0)
    expect(validate).toHaveBeenCalledTimes(2)
  })

  it('stops at the first invalid file', async () => {
    expect.hasAssertions()
    vi.spyOn(process.stdout, 'write').mockReturnValue(true)
    const validate = vi.fn<(file: string) => boolean>(() => false)
    const directory = await makeFolder(['a.json', 'b.json'])
    expect(validateAll(globIn(directory, '*.json'), validate)).toBe(1)
    expect(validate).toHaveBeenCalledOnce()
  })

  it('fails when no file matches, so a wrong glob never passes silently', async () => {
    expect.hasAssertions()
    const write = vi.spyOn(process.stdout, 'write').mockReturnValue(true)
    const directory = await makeFolder([])
    expect(validateAll(globIn(directory, 'nope-*.json'), () => true)).toBe(1)
    expect(write).toHaveBeenCalledWith(expect.stringContaining('No file matches'))
  })
})

describe(validateFile, () => {
  it('rejects a file resumed cannot validate', async () => {
    expect.hasAssertions()
    const directory = await makeFolder([])
    await writeFile(path.join(directory, 'bad.json'), '{"basics":1}', 'utf8')
    expect(validateFile(path.join(directory, 'bad.json'))).toBe(false)
  })
})
