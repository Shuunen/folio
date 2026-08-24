import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import theme, { buildKeywordsRegex, emphasize, parseKeywords, render } from '../themes/blue-buzz/index.js'

/**
 * Strip the inlined stylesheet so an assertion cannot match a css class name instead of the markup
 * @param html the rendered page
 * @returns the page without its style block
 */
function body(html: string) {
  return html.replace(/<style>[\s\S]*?<\/style>/u, '')
}

/** a resume exercising every section the theme knows how to render */
const fullResume = {
  awards: [{ awarder: 'ACM', date: '2019-05', title: 'Best Paper' }],
  basics: { birthDate: '1990-01-01', email: 'ada@example.com', image: 'me.jpg', label: 'Web Developer', name: 'Ada Lovelace', summary: 'Builds engines.' },
  certificates: [{ date: '2021-09', issuer: 'CNCF', name: 'CKA' }],
  education: [{ area: 'Computer Science', endDate: '2012-06', institution: 'University', startDate: '2009-09', studyType: 'Master' }],
  interests: [{ keywords: ['chess'], name: 'Games' }],
  languages: [{ fluency: 'Native', language: 'English' }],
  meta: { canonical: 'https://example.com/en.json', lastModified: '2026-02-01T10:00:00Z' },
  projects: [{ description: 'A thing', name: 'Folio', startDate: '2023-01' }],
  publications: [{ name: 'Notes on the Engine', publisher: 'Journal', releaseDate: '2018-03' }],
  references: [{ name: 'Charles Babbage', reference: 'Excellent engineer.' }],
  skills: [{ keywords: ['TypeScript', 'Node'], name: 'Web' }],
  volunteer: [{ organization: 'Red Cross', position: 'Helper', startDate: '2015-01' }],
  work: [{ endDate: '2024-12', highlights: ['Shipped the engine'], name: 'Analytical Engine Ltd', position: 'Lead', startDate: '2020-01', summary: 'Led the team.' }],
}

describe(render, () => {
  it('produces a full standalone html document', () => {
    expect.hasAssertions()
    const html = render(fullResume)
    expect(html.startsWith('<!doctype html>')).toBe(true)
    expect(html).toContain('</html>')
    expect(html).toContain('<meta charset="utf-8">')
  })

  it('inlines the stylesheet so the html stands alone', () => {
    expect.hasAssertions()
    const html = render(fullResume)
    expect(html).toContain('<style>')
    expect(html).toContain('.cv')
  })

  it('puts the name and label in the title', () => {
    expect.hasAssertions()
    expect(render(fullResume)).toContain('<title>Ada Lovelace - Web Developer</title>')
  })

  it('omits the label from the title when there is none', () => {
    expect.hasAssertions()
    const { label: _label, ...basics } = fullResume.basics
    expect(render({ ...fullResume, basics })).toContain('<title>Ada Lovelace</title>')
  })

  it('renders every section title given by the resume content', () => {
    expect.hasAssertions()
    const html = render(fullResume)
    for (const heading of ['Experiences', 'Volunteering', 'Projects', 'References', 'Skills', 'Languages', 'Interests', 'Education', 'Certificates', 'Awards', 'Publications']) expect(html).toContain(heading)
  })

  it('marks the projects widget as a grid so its entries sit on three columns', () => {
    expect.hasAssertions()
    const html = render(fullResume)
    expect(html).toContain('<section class="widget widget--grid-3"><h2 class="widget__title">Projects</h2>')
    expect(html).toContain('<section class="widget widget--grid-2"><h2 class="widget__title">References</h2>')
    expect(html).toContain('<section class="widget"><h2 class="widget__title">Experiences</h2>')
  })

  it('puts the volunteer, projects and references widgets under the columns so they span the full width', () => {
    expect.hasAssertions()
    const html = render(fullResume)
    const columnsEnd = html.indexOf('</aside></div>')
    expect(html.indexOf('>Volunteering</h2>')).toBeGreaterThan(columnsEnd)
    expect(html.indexOf('>Projects</h2>')).toBeGreaterThan(columnsEnd)
    expect(html.indexOf('>References</h2>')).toBeGreaterThan(columnsEnd)
    expect(html.indexOf('>Experiences</h2>')).toBeLessThan(columnsEnd)
    expect(html).toContain('<div class="full">')
  })

  it('closes the references with a note pointing at the linkedin profile', () => {
    expect.hasAssertions()
    const profiles = [
      { network: 'GitHub', url: 'https://github.com/ada' },
      { network: 'LinkedIn', url: 'https://www.linkedin.com/in/ada' },
    ]
    const html = render({ ...fullResume, basics: { ...fullResume.basics, profiles } })
    expect(html).toContain('<p class="widget__note">These references come from my LinkedIn profile: <a href="https://www.linkedin.com/in/ada">linkedin.com/in/ada</a></p>')
  })

  it('closes the projects with a note pointing at the github profile', () => {
    expect.hasAssertions()
    const profiles = [
      { network: 'GitHub', url: 'https://github.com/ada' },
      { network: 'LinkedIn', url: 'https://www.linkedin.com/in/ada' },
    ]
    const html = render({ ...fullResume, basics: { ...fullResume.basics, profiles } })
    expect(html).toContain('<p class="widget__note">These projects and many others live on my GitHub profile: <a href="https://github.com/ada">github.com/ada</a></p>')
  })

  it('drops both notes when the resume has no linkedin nor github profile', () => {
    expect.hasAssertions()
    const html = body(render(fullResume))
    expect(html).not.toContain('widget__note')
    expect(html).toContain('Charles Babbage')
    expect(html).toContain('Folio')
  })

  it('renders the actual entries, not just the headings', () => {
    expect.hasAssertions()
    const html = render(fullResume)
    expect(html).toContain('Analytical Engine Ltd')
    expect(html).toContain('Shipped the engine')
    expect(html).toContain('TypeScript')
    expect(html).toContain('Charles Babbage')
  })
})

describe('language detection', () => {
  it('uses english wordings and lang attribute by default', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('Experiences')
  })

  it('switches to french when the canonical url points at fr.json', () => {
    expect.hasAssertions()
    const html = render({ ...fullResume, meta: { canonical: 'https://example.com/fr.json' } })
    expect(html).toContain('<html lang="fr">')
    expect(html).toContain('Expériences')
    expect(html).toContain('Compétences')
  })

  it('does not leak french wordings into an english render', () => {
    expect.hasAssertions()
    expect(render(fullResume)).not.toContain('Expériences')
  })
})

describe('empty and partial resumes', () => {
  it('renders a document rather than throwing on a bare resume', () => {
    expect.hasAssertions()
    const html = render({})
    expect(html.startsWith('<!doctype html>')).toBe(true)
  })

  it('omits a section entirely when its array is empty', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, skills: [], work: [{ name: 'x', position: 'y' }] })
    expect(html).not.toContain('Skills')
  })

  it('omits the updated footer when meta has no lastModified', () => {
    expect.hasAssertions()
    const { meta: _meta, ...resume } = fullResume
    expect(render(resume)).not.toContain('Updated on')
  })

  it('shows the updated footer when meta has a lastModified', () => {
    expect.hasAssertions()
    expect(render(fullResume)).toContain('Updated on')
  })
})

describe('escaping', () => {
  it('escapes markup coming from the resume so a name cannot inject a script', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: '<script>alert(1)</script>' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('escapes an ampersand in a company name', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ name: 'Tom & Jerry', position: 'Lead' }] })
    expect(html).toContain('Tom &amp; Jerry')
  })
})

describe('dates', () => {
  it('shows an ongoing experience as Present in english', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y', startDate: '2020-01' }] })
    expect(html).toContain('Present')
  })

  it("shows an ongoing experience as Aujourd'hui in french", () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, meta: { canonical: 'https://example.com/fr.json' }, work: [{ name: 'x', position: 'y', startDate: '2020-01' }] })
    expect(html).toContain("Aujourd'hui")
  })

  it('keeps a lone year as is', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ endDate: '2024', name: 'x', position: 'y', startDate: '2020' }] })).toContain('2020')
  })

  it('renders a range with an arrow between both dates', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ endDate: '2024-12', name: 'x', position: 'y', startDate: '2020-01' }] })).toContain('→')
  })
})

describe('module shape', () => {
  it('exposes render on the default export, as resumed expects', () => {
    expect.hasAssertions()
    // oxlint-disable-next-line import/no-named-as-default-member
    const exposed = theme.render
    expect(exposed).toBeTypeOf('function')
    expect(exposed).toBe(render)
  })
})

describe('the real resumes in data/', () => {
  it.each([
    ['data/Romain Racamier-Lafon - CV - Développeur Web Lead Tech (2026) (JsonResume).json', 'fr'],
    ['data/Romain Racamier-Lafon - Resume - Web Developer Tech Lead (2026) (JsonResume).json', 'en'],
  ])('renders %s without throwing', async (file, lang) => {
    expect.hasAssertions()
    const resume = JSON.parse(await readFile(file, 'utf8')) as Record<string, unknown>
    const html = render(resume)
    expect(html.startsWith('<!doctype html>')).toBe(true)
    expect(html).toContain(`<html lang="${lang}">`)
    expect(html).toContain('Romain Racamier-Lafon')
    expect(html.length).toBeGreaterThan(5000)
  })
})

describe('header', () => {
  it('renders the avatar when basics has an image', () => {
    expect.hasAssertions()
    expect(render({ basics: { image: 'me.jpg', name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })).toContain('class="header__avatar"')
  })

  it('omits the avatar when basics has no image', () => {
    expect.hasAssertions()
    expect(body(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y' }] }))).not.toContain('header__avatar')
  })

  it('joins the city and the country code with a comma, ignoring the region', () => {
    expect.hasAssertions()
    const html = render({ basics: { location: { city: 'Lyon', countryCode: 'FR', region: 'Rhone' }, name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('Lyon, FR')
    expect(html).not.toContain('Rhone')
  })

  it('skips the missing parts of a partial location', () => {
    expect.hasAssertions()
    const html = render({ basics: { location: { city: 'Lyon' }, name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('Lyon')
    expect(html).not.toContain('Lyon,')
  })

  it('turns a url into a link and strips the scheme from its text', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada', url: 'https://www.example.com/ada' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('href="https://www.example.com/ada"')
    expect(html).toContain('>example.com/ada</a>')
  })

  it('leaves a plain contact info unlinked', () => {
    expect.hasAssertions()
    const html = render({ basics: { email: 'ada@example.com', name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('ada@example.com')
    expect(html).not.toContain('href="ada@example.com"')
  })

  it('lists the profile urls from basics.profiles', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada', profiles: [{ network: 'GitHub', url: 'https://github.com/ada' }] }, work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('href="https://github.com/ada"')
  })
})

describe('age', () => {
  it('shows the age in years next to the contact infos', () => {
    expect.hasAssertions()
    const birthDate = `${new Date().getUTCFullYear() - 30}-01-01`
    expect(render({ basics: { birthDate, name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })).toContain('30 years old')
  })

  it('uses the french wording for the age', () => {
    expect.hasAssertions()
    const birthDate = `${new Date().getUTCFullYear() - 30}-01-01`
    expect(render({ basics: { birthDate, name: 'Ada' }, meta: { canonical: 'https://example.com/fr.json' }, work: [{ name: 'x', position: 'y' }] })).toContain('30 ans')
  })

  it('shows no age when there is no birth date', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })).not.toContain('years old')
  })

  it('shows no age when the birth date is unparsable', () => {
    expect.hasAssertions()
    expect(render({ basics: { birthDate: 'not a date', name: 'Ada' }, work: [{ name: 'x', position: 'y' }] })).not.toContain('years old')
  })
})

describe('company logos', () => {
  it('renders the logo of a work entry, labelled with the company name', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ image: 'icons/acme.png', name: 'Acme', position: 'Lead' }] })
    expect(html).toContain('<img alt="Acme" class="element__logo" src="icons/acme.png">')
  })

  it('renders the logo of a volunteer entry, labelled with the organization name', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, volunteer: [{ image: 'icons/ngo.svg', organization: 'Ngo', position: 'Mentor' }] })
    expect(html).toContain('<img alt="Ngo" class="element__logo" src="icons/ngo.svg">')
  })

  it('renders no logo when the entry has no image', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ name: 'Acme', position: 'Lead' }] })).not.toContain('<img alt="Acme"')
  })

  it('escapes a logo path containing quotes', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ image: 'icons/a"b.png', name: 'Acme', position: 'Lead' }] })
    expect(html).toContain('src="icons/a&quot;b.png"')
  })

  it('leaves the logo label empty when the entry has no company name', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ image: 'icons/acme.png', position: 'Lead' }] })).toContain('<img alt="" class="element__logo"')
  })
})

describe('company names', () => {
  it('puts the company name first in the work title, before the position', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, work: [{ location: 'Lyon', name: 'Acme', position: 'Lead' }] }))
    expect(html).toContain('<h3 class="element__title"><span class="element__company">Acme</span>Lead</h3>')
  })

  it('puts the organization name in the volunteer title', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, volunteer: [{ organization: 'Ngo', position: 'Mentor' }] }))
    expect(html).toContain('<h3 class="element__title"><span class="element__company">Ngo</span>Mentor</h3>')
  })

  it('keeps the company name out of the subtitle', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, work: [{ location: 'Lyon', name: 'Acme', position: 'Lead' }] }))
    expect(html).toContain('<p class="element__subtitle"><span>Lyon</span></p>')
  })

  it('renders the title alone when the entry has no company name', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, work: [{ position: 'Lead' }] }))
    expect(html).toContain('<h3 class="element__title">Lead</h3>')
  })

  it('adds no company to an entry title outside of work and volunteer', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, education: [{ area: 'Computer Science', institution: 'University', studyType: 'Master' }] }))
    expect(html).toContain('<h3 class="element__title">Master - Computer Science</h3>')
  })
})

describe('entry titles and links', () => {
  it('links a work entry title when the entry has a url', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ name: 'Acme', position: 'Lead', url: 'https://acme.test' }] })).toContain('href="https://acme.test"')
  })

  it('renders the work entry title unlinked when it has no url', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ name: 'Acme', position: 'Lead' }] })
    expect(html).toContain('Acme')
    expect(html).not.toContain('href="https://acme.test"')
  })

  it('renders skill keywords as tags', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, skills: [{ keywords: ['Node', 'Vitest'], name: 'Web' }], work: [{ name: 'x', position: 'y' }] })
    expect(html).toContain('tags__item')
    expect(html).toContain('Vitest')
  })

  it('renders a skill with no keyword without an empty tag block', () => {
    expect.hasAssertions()
    expect(body(render({ basics: { name: 'Ada' }, skills: [{ name: 'Web' }], work: [{ name: 'x', position: 'y' }] }))).not.toContain('tags__item')
  })

  it('renders interest keywords as a bullet list, like the skills ones', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, interests: [{ keywords: ['chess', 'hiking'], name: 'Games' }], work: [{ name: 'x', position: 'y' }] }))
    expect(html).toContain('<ul class="element__list"><li class="element__item">chess</li><li class="element__item">hiking</li></ul>')
    expect(html).not.toContain('tags__item')
  })

  it('renders highlights as a bullet list', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ highlights: ['Shipped it', 'Twice'], name: 'x', position: 'y' }] })
    expect(html).toContain('element__item')
    expect(html).toContain('Twice')
  })
})

describe('unparsable dates', () => {
  it('falls back to showing the raw value rather than an empty range', () => {
    expect.hasAssertions()
    expect(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y', startDate: 'someday' }] })).toContain('someday')
  })

  it('shows only the end date when there is no start date', () => {
    expect.hasAssertions()
    const html = render({ basics: { name: 'Ada' }, work: [{ endDate: '2024', name: 'x', position: 'y' }] })
    expect(html).toContain('2024')
    expect(html).not.toContain('→')
  })
})

describe('formatDate seven character guard', () => {
  it('does not turn a seven character non date into a real looking date', () => {
    expect.hasAssertions()
    // "someday" is exactly seven characters, the length of a "2024-06" month, so a naive
    // length check used to append "-01" and let Date parse "someday-01" as Dec 2000
    const html = body(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y', startDate: 'someday' }] }))
    expect(html).toContain('someday')
    expect(html).not.toContain('2000')
  })

  it.each([['januarx'], ['unknown'], ['xxxxxxx']])('keeps the seven character value %s as written', value => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y', startDate: value }] }))
    expect(html).toContain(value)
  })

  it('still formats a genuine year month into a readable month', () => {
    expect.hasAssertions()
    expect(body(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y', startDate: '2024-06' }] }))).toContain('Jun 2024')
  })

  it('still formats a full iso date', () => {
    expect.hasAssertions()
    expect(body(render({ basics: { name: 'Ada' }, work: [{ name: 'x', position: 'y', startDate: '2024-06-29' }] }))).toContain('Jun 2024')
  })
})

/**
 * Read the lang attribute of the html a resume renders to
 * @param resume the resume to render
 * @returns the lang attribute value, undefined when the html has none
 */
const langOf = (resume: object) => (/<html lang="(?<lang>\w+)">/u.exec(render(resume)) ?? []).at(1)

describe('language detection only trusts explicit markers', () => {
  const work = [{ name: 'x', position: 'y' }]

  it('does not read a .fr domain as a french resume', () => {
    expect.hasAssertions()
    expect(langOf({ basics: { name: 'Ada' }, meta: { canonical: 'https://example.fr/en.json' }, work })).toBe('en')
  })

  it('does not read a label containing FR as a french resume', () => {
    expect.hasAssertions()
    expect(langOf({ basics: { label: 'Senior Dev, FR', name: 'Ada' }, meta: { canonical: 'https://example.com/en.json' }, work })).toBe('en')
  })

  it.each([
    ['https://rrl-folio.netlify.app/fr.json', 'fr'],
    ['https://rrl-folio.netlify.app/en.json', 'en'],
    ['https://example.com/fr.json?v=2', 'fr'],
    ['https://example.com/de.json', 'en'],
  ])('reads the language from the canonical file name %s', (canonical, expected) => {
    expect.hasAssertions()
    expect(langOf({ basics: { name: 'Ada' }, meta: { canonical }, work })).toBe(expected)
  })

  it('falls back to meta.language when there is no canonical url', () => {
    expect.hasAssertions()
    expect(langOf({ basics: { name: 'Ada' }, meta: { language: 'fr-FR' }, work })).toBe('fr')
  })

  it('defaults to english when the resume gives no language hint at all', () => {
    expect.hasAssertions()
    expect(langOf({ basics: { name: 'Ada' }, work })).toBe('en')
  })
})

describe('empty entries', () => {
  it('drops the references widget when the resume has no reference at all', () => {
    expect.hasAssertions()
    const { references, ...withoutReferences } = fullResume
    expect(references).toHaveLength(1)
    expect(body(render(withoutReferences))).not.toContain('reference__quote')
  })

  it('keeps the linkedin note alone when the resume has no reference but a linkedin profile', () => {
    expect.hasAssertions()
    const { references, ...withoutReferences } = fullResume
    expect(references).toHaveLength(1)
    const profiles = [{ network: 'LinkedIn', url: 'https://www.linkedin.com/in/ada' }]
    const html = body(render({ ...withoutReferences, basics: { ...fullResume.basics, profiles } }))
    expect(html).toContain('<p class="widget__note">My recommendations are on my LinkedIn profile: <a href="https://www.linkedin.com/in/ada">linkedin.com/in/ada</a></p>')
  })

  it('keeps the french linkedin note alone when the resume has no reference', () => {
    expect.hasAssertions()
    const { references, ...withoutReferences } = fullResume
    expect(references).toHaveLength(1)
    const profiles = [{ network: 'LinkedIn', url: 'https://www.linkedin.com/in/ada' }]
    const html = body(render({ ...withoutReferences, basics: { ...fullResume.basics, profiles }, meta: { language: 'fr' } }))
    expect(html).toContain('<p class="widget__note">Mes recommandations sont sur mon profil LinkedIn\u00A0: <a href="https://www.linkedin.com/in/ada">linkedin.com/in/ada</a></p>')
  })

  it('renders an empty quote for a reference that has no text', () => {
    expect.hasAssertions()
    const html = body(render({ ...fullResume, references: [{ name: 'Charles Babbage' }] }))
    expect(html).toContain('<blockquote class="reference__quote"></blockquote>')
  })

  it('renders an entry without a title, here a skill group that only has keywords', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace' }, skills: [{ keywords: ['TypeScript'] }] }))
    expect(html).not.toContain('element__title')
    expect(html).toContain('TypeScript')
  })
})

describe('environment highlights', () => {
  /**
   * Render a single work entry with the given highlights
   * @param highlights the `work[0].highlights` array
   * @returns the rendered body, without its stylesheet
   */
  function renderHighlights(highlights: string[]) {
    return body(render({ basics: { name: 'Ada Lovelace' }, work: [{ highlights, name: 'Analytical Engine Ltd', position: 'Lead' }] }))
  }

  it('turns an english environment highlight into a row of tags', () => {
    expect.hasAssertions()
    const html = renderHighlights(['Environment: TypeScript, Vite, Git'])
    expect(html).toContain('<div class="environment"><div class="tags"><span class="tags__item">TypeScript</span><span class="tags__item">Vite</span><span class="tags__item">Git</span></div></div>')
    expect(html).not.toContain('Environment')
  })

  it('turns a french environment highlight into a row of tags, dropping its label', () => {
    expect.hasAssertions()
    const html = renderHighlights(['Environnement : TypeScript, Vite'])
    expect(html).toContain('<div class="environment"><div class="tags"><span class="tags__item">TypeScript</span><span class="tags__item">Vite</span></div></div>')
    expect(html).not.toContain('Environnement')
  })

  it('keeps the environment tags out of the bullet list', () => {
    expect.hasAssertions()
    const html = renderHighlights(['Shipped the engine', 'Environment: TypeScript'])
    expect(html).toContain('<li class="element__item">Shipped the engine</li>')
    expect(html).not.toContain('<li class="element__item">Environment: TypeScript</li>')
  })

  it('leaves a regular highlight as a bullet', () => {
    expect.hasAssertions()
    const html = renderHighlights(['Shipped the engine'])
    expect(html).toContain('<li class="element__item">Shipped the engine</li>')
    expect(html).not.toContain('environment')
  })

  it.each([
    ['an english impact line', 'Impact: two applications delivered'],
    ['a french impact line', 'Impact : deux applications livrées'],
  ])('marks %s so it gets the accent color', (_case, highlight) => {
    expect.hasAssertions()
    expect(renderHighlights([highlight])).toContain(`<li class="element__item element__item--impact">${highlight}</li>`)
  })

  it('leaves a bullet that only mentions impact later in the line unmarked', () => {
    expect.hasAssertions()
    expect(renderHighlights(['Measured the impact: big'])).toContain('<li class="element__item">Measured the impact: big</li>')
  })

  it('escapes the keywords so a tag cannot inject markup', () => {
    expect.hasAssertions()
    expect(renderHighlights(['Environment: <script>alert(1)</script>'])).toContain('<span class="tags__item">&lt;script&gt;alert(1)&lt;/script&gt;</span>')
  })

  it.each([
    ['a highlight that only mentions the word', 'The environment was hostile'],
    ['a colon line with only separators after it', 'Environment: , ,'],
    ['a line where environment is not the first word', 'Great environment: Fortran'],
  ])('keeps %s as a plain bullet', (_case, highlight) => {
    expect.hasAssertions()
    const html = renderHighlights([highlight])
    expect(html).toContain(`<li class="element__item">${highlight}</li>`)
    expect(html).not.toContain('tags__item')
  })

  it('ignores a non string highlight rather than treating it as an environment', () => {
    expect.hasAssertions()
    // @ts-expect-error the resume is user data, a number can slip into the highlights
    const html = renderHighlights([42])
    expect(html).toContain('<li class="element__item">42</li>')
  })

  it.each([
    ['data/Romain Racamier-Lafon - CV - Développeur Web Lead Tech (2026) (JsonResume).json', 'Environnement :'],
    ['data/Romain Racamier-Lafon - Resume - Web Developer Tech Lead (2026) (JsonResume).json', 'Environment:'],
  ])('renders the environment of every work entry of %s as tags', async (file, label) => {
    expect.hasAssertions()
    const resume = JSON.parse(await readFile(file, 'utf8')) as { work: { highlights: string[] }[] }
    const html = body(render(resume))
    expect(html).not.toContain(`<li class="element__item">${label}`)
    expect(html.match(/class="environment"/gu)).toHaveLength(resume.work.length)
  })
})

describe('urls in free texts', () => {
  /**
   * Render a single work entry with the given highlight
   * @param highlight the `work[0].highlights[0]` value
   * @returns the rendered body, without its stylesheet
   */
  function renderHighlight(highlight: string) {
    return body(render({ basics: { name: 'Ada Lovelace' }, work: [{ highlights: [highlight], name: 'Analytical Engine Ltd', position: 'Lead' }] }))
  }

  it('turns a url inside a highlight into a link labelled with its domain only', () => {
    expect.hasAssertions()
    expect(renderHighlight('Shipped the engine: https://www.acme.com/engine')).toContain('<li class="element__item">Shipped the engine: <a href="https://www.acme.com/engine">acme.com</a></li>')
  })

  it.each([
    ['a path', 'https://acme.com/deep/page.html'],
    ['a query string', 'https://acme.com?id=42'],
    ['a hash', 'https://acme.com#top'],
  ])('drops %s from the link label but keeps it in the href', (_case, url) => {
    expect.hasAssertions()
    expect(renderHighlight(`Shipped ${url}`)).toContain(`<a href="${url}">acme.com</a>`)
  })

  it('keeps the text surrounding a url', () => {
    expect.hasAssertions()
    expect(renderHighlight('See http://acme.com for the details')).toContain('<li class="element__item">See <a href="http://acme.com">acme.com</a> for the details</li>')
  })

  it('links several urls of the same highlight', () => {
    expect.hasAssertions()
    const html = renderHighlight('https://acme.com and https://acme.org')
    expect(html).toContain('<a href="https://acme.com">acme.com</a>')
    expect(html).toContain('<a href="https://acme.org">acme.org</a>')
  })

  it.each([
    ['a final dot', 'Shipped it on https://acme.com.', '<a href="https://acme.com">acme.com</a>.'],
    ['a final comma', 'https://acme.com, then more', '<a href="https://acme.com">acme.com</a>,'],
  ])('leaves %s out of the linked url', (_case, highlight, expected) => {
    expect.hasAssertions()
    expect(renderHighlight(highlight)).toContain(expected)
  })

  it('leaves a highlight without any url untouched', () => {
    expect.hasAssertions()
    expect(renderHighlight('Shipped the engine')).toContain('<li class="element__item">Shipped the engine</li>')
  })

  it('escapes the text around a url so a highlight cannot inject markup', () => {
    expect.hasAssertions()
    const html = renderHighlight('<script>alert(1)</script> https://acme.com')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; <a href="https://acme.com">acme.com</a>')
  })

  it('links a url found in a summary paragraph', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace', summary: 'Engines, see https://acme.com' } }))
    expect(html).toContain('<p class="summary">Engines, see <a href="https://acme.com">acme.com</a></p>')
  })

  it('links a url found in a reference quote', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace' }, references: [{ name: 'Charles Babbage', reference: 'Her work is on https://acme.com' }] }))
    expect(html).toContain('<blockquote class="reference__quote">Her work is on <a href="https://acme.com">acme.com</a></blockquote>')
  })

  it('ignores a non string reference rather than linking it', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace' }, references: [{ name: 'Charles Babbage' }] }))
    expect(html).toContain('<blockquote class="reference__quote"></blockquote>')
  })
})

describe('keywords', () => {
  /**
   * Render a single work entry with the given highlight
   * @param highlight the `work[0].highlights[0]` value
   * @returns the rendered body, without its stylesheet
   */
  function renderKeywordHighlight(highlight: string) {
    return body(render({ basics: { name: 'Ada Lovelace' }, work: [{ highlights: [highlight], position: 'Lead' }] }))
  }

  it('keeps a keyword per line, drops the blanks and the comments', () => {
    expect.hasAssertions()
    expect(parseKeywords('# companies\nHumaCode\n\n  Niji  \n')).toStrictEqual(['HumaCode', 'Niji'])
  })

  it('lists the longest keywords first so a longer name wins over the shorter one it contains', () => {
    expect.hasAssertions()
    expect(parseKeywords('Amundi\nAmundi WeSave')).toStrictEqual(['Amundi WeSave', 'Amundi'])
  })

  it('keeps a keyword listed twice only once', () => {
    expect.hasAssertions()
    expect(parseKeywords('Niji\nNiji')).toStrictEqual(['Niji'])
  })

  it('leaves the text untouched when no keyword is listed', () => {
    expect.hasAssertions()
    expect(emphasize('Worked at Niji', buildKeywordsRegex([]))).toBe('Worked at Niji')
  })

  it('bolds a listed keyword whatever its case', () => {
    expect.hasAssertions()
    expect(emphasize('worked at humacode', buildKeywordsRegex(['HumaCode']))).toBe('worked at <strong class="keyword">humacode</strong>')
  })

  it('bolds the longest keyword rather than the shorter name it starts with', () => {
    expect.hasAssertions()
    const regex = buildKeywordsRegex(parseKeywords('Amundi\nAmundi WeSave'))
    expect(emphasize('joined Amundi WeSave', regex)).toBe('joined <strong class="keyword">Amundi WeSave</strong>')
  })

  it('leaves a keyword alone when it is only part of a longer word', () => {
    expect.hasAssertions()
    expect(emphasize('Nijitech and Niji-Lab', buildKeywordsRegex(['Niji']))).toBe('Nijitech and Niji-Lab')
  })

  it('matches a keyword holding regex operators literally', () => {
    expect.hasAssertions()
    expect(emphasize('see Dema1nXorg and Dema1n.org', buildKeywordsRegex(['Dema1n.org']))).toBe('see Dema1nXorg and <strong class="keyword">Dema1n.org</strong>')
  })

  it('matches a keyword holding an html unsafe character once the text is escaped', () => {
    expect.hasAssertions()
    expect(emphasize('Hired by Ben &amp; Jerry today', buildKeywordsRegex(['Ben & Jerry']))).toBe('Hired by <strong class="keyword">Ben &amp; Jerry</strong> today')
  })

  it('bolds a keyword found in the summary', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace', summary: 'Freelancing through HumaCode' } }))
    expect(html).toContain('<p class="summary">Freelancing through <strong class="keyword">HumaCode</strong></p>')
  })

  it('bolds a keyword found in a highlight next to a url', () => {
    expect.hasAssertions()
    const html = renderKeywordHighlight('Niji then https://acme.com then Amdocs')
    expect(html).toContain('<strong class="keyword">Niji</strong> then <a href="https://acme.com">acme.com</a> then <strong class="keyword">Amdocs</strong>')
  })

  it('leaves a skill keyword alone, a skills list is a tech list not a free text', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace' }, skills: [{ keywords: ['Niji', 'Vue'], name: 'Front' }] }))
    expect(html).toContain('<li class="element__item">Niji</li>')
  })

  it('leaves an education course alone, a course list is a tech list like the skills one', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace' }, education: [{ courses: ['Niji'], institution: 'University' }] }))
    expect(html).toContain('<li class="element__item">Niji</li>')
  })

  it('bolds a keyword in an interest, unlike a skill', () => {
    expect.hasAssertions()
    const html = body(render({ basics: { name: 'Ada Lovelace' }, interests: [{ keywords: ['Niji'], name: 'Meetups' }] }))
    expect(html).toContain('<li class="element__item"><strong class="keyword">Niji</strong></li>')
  })

  it('leaves the anchor label alone when the linked domain is a keyword', () => {
    expect.hasAssertions()
    const html = renderKeywordHighlight('see https://dema1n.org')
    expect(html).toContain('<a href="https://dema1n.org">dema1n.org</a>')
  })
})
