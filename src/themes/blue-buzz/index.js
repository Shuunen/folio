/**
 * blue-buzz : a JSON Resume theme mimicking the DoYouBuzz "minimal" design used on
 * https://www.doyoubuzz.com/romain-racamier : blue #50a3d9 accent, Open Sans, profile on top
 * then a 70/30 two columns body, experiences on the left, side widgets on the right.
 * Usage : resumed render resume.json --theme jsonresume-theme-blue-buzz
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { nbDaysInYear, nbMsInDay } from 'shuutils'

const styles = readFileSync(path.join(import.meta.dirname, 'style.css'), 'utf8')

/** the words to emphasize in the free texts, one per line, `#` starts a comment */
const keywordsFile = readFileSync(path.join(import.meta.dirname, '..', '..', '..', 'data', 'keyword.txt'), 'utf8')

/** the characters a keyword may contain that would otherwise be read as a regex operator */
const regexSpecialsRegex = /[$()*+.?[\\\]^{|}]/gu

/** a leap day is added to the calendar every four years */
const nbYearsBetweenLeapDays = 4

/** average length of a year, the extra fraction of a day accounts for the leap years */
const nbMsInAverageYear = (nbDaysInYear + 1 / nbYearsBetweenLeapDays) * nbMsInDay

/** length of an ISO date without the time part, like "2019-12-31" */
const isoDateLength = 10

/** a http(s) url inside a free text, it stops at the first whitespace or html unsafe character */
const urlRegex = /https?:\/\/[^\s"<>]+/gu

/** a highlight starting like this is not a bullet but the comma separated tech stack of the mission */
const environmentRegex = /^(?:Environnement|Environment)\s*:\s*(?<keywords>.+)$/u

/** a highlight starting like this states the outcome of the mission, it gets the accent color */
const impactRegex = /^Impact\s*:/u

/** section titles & wordings, the language is guessed from the resume itself */
const wordings = {
  en: {
    awards: 'Awards',
    certificates: 'Certificates',
    education: 'Education',
    experiences: 'Experiences',
    interests: 'Interests',
    languages: 'Languages',
    now: 'Present',
    projects: 'Projects',
    projectsNote: 'These projects and many others live on my GitHub profile:',
    publications: 'Publications',
    references: 'References',
    referencesEmptyNote: 'My recommendations are on my LinkedIn profile:',
    referencesNote: 'These references come from my LinkedIn profile:',
    skills: 'Skills',
    updatedOn: 'Updated on',
    volunteer: 'Volunteering',
    yearsOld: 'years old',
  },
  fr: {
    awards: 'Distinctions',
    certificates: 'Certifications',
    education: 'Formations',
    experiences: 'Expériences',
    interests: "Centres d'intérêt",
    languages: 'Langues',
    now: "Aujourd'hui",
    projects: 'Projets',
    projectsNote: 'Ces projets et bien d’autres sont sur mon profil GitHub :',
    publications: 'Publications',
    references: 'Recommandations',
    referencesEmptyNote: 'Mes recommandations sont sur mon profil LinkedIn :',
    referencesNote: 'Ces recommandations proviennent de mon profil LinkedIn :',
    skills: 'Compétences',
    updatedOn: 'Mis à jour en',
    volunteer: 'Bénévolat',
    yearsOld: 'ans',
  },
}

/**
 * Escape the text coming from the resume so it cannot break the produced html
 * @param {unknown} value the value to escape, non string ones are dropped
 * @returns {string} the escaped text
 */
function esc(value) {
  if (typeof value !== 'string') return ''
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

/**
 * Read the keywords file, one keyword per line, blank lines & `#` comments are skipped
 * @param {string} content the raw file content
 * @returns {string[]} the keywords, longest first so "Amundi WeSave" wins over "Amundi"
 */
export function parseKeywords(content) {
  const keywords = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '' && !line.startsWith('#'))
  return [...new Set(keywords)].toSorted((one, two) => two.length - one.length)
}

/**
 * Build the regex matching any of the keywords, they are compared against already escaped html
 * @param {string[]} keywords the keywords to look for
 * @returns {RegExp | undefined} the regex, undefined when there is no keyword to look for
 */
export function buildKeywordsRegex(keywords) {
  if (keywords.length === 0) return undefined
  const alternatives = keywords.map(keyword => esc(keyword).replace(regexSpecialsRegex, String.raw`\$&`))
  // the lookarounds keep "Niji" from matching inside a longer word like "Nijitech"
  return new RegExp(String.raw`(?<![\w-])(?:${alternatives.join('|')})(?![\w-])`, 'giu')
}

/** the keywords regex used by the free texts, built once from the keywords file */
const keywordsRegex = buildKeywordsRegex(parseKeywords(keywordsFile))

/** skills & education courses are bare tech lists, bolding a word in them would fight with the widget own hierarchy */
const noEmphasis = undefined

/**
 * Wrap the known keywords in a bold span, the input & the keywords are both html escaped
 * @param {string} html the already escaped text
 * @param {RegExp | undefined} regex the keywords regex, undefined when there is no keyword to look for
 * @returns {string} the text with its keywords emphasized
 */
export function emphasize(html, regex) {
  if (regex === undefined) return html
  return html.replace(regex, match => `<strong class="keyword">${match}</strong>`)
}

/**
 * Shorten a url for display, the protocol and the leading www are noise on a printed resume
 * @param {string} url the url to shorten
 * @returns {string} the display label
 */
function shortUrl(url) {
  return url.replace(/^https?:\/\/(?:www\.)?/u, '')
}

/**
 * Reduce a url to its bare domain, a full path is unreadable in the middle of a sentence
 * @param {string} url the url to reduce
 * @returns {string} the domain, without the protocol nor the leading www
 */
function domainOf(url) {
  return shortUrl(url).replace(/[/?#].*$/su, '')
}

/**
 * Escape a free text and turn the urls it contains into links, like "see https://acme.com for more"
 * @param {string} value the text to escape
 * @param {RegExp | undefined} regex the keywords to emphasize, undefined to leave the text as it is
 * @returns {string} the escaped html, urls wrapped in anchors
 */
function escLinks(value, regex) {
  let html = ''
  let cursor = 0
  for (const match of value.matchAll(urlRegex)) {
    // a url ending a sentence swallows its punctuation, "see https://acme.com." must not link the final dot
    const url = match[0].replace(/[.,;:!?]+$/u, '')
    html += `${emphasize(esc(value.slice(cursor, match.index)), regex)}<a href="${esc(url)}">${esc(domainOf(url))}</a>`
    cursor = match.index + url.length
  }
  return html + emphasize(esc(value.slice(cursor)), regex)
}

/**
 * Tell if the given value is a non empty array
 * @param {unknown} value the value to check
 * @returns {boolean} true when there is something to render
 */
function isFilled(value) {
  return Array.isArray(value) && value.length > 0
}

/**
 * Guess the resume language, `meta.canonical` points to en.json or fr.json on this folio
 * @param {Record<string, any>} resume the parsed JSON Resume object
 * @returns {'en' | 'fr'} the language to use for the section titles
 */
function detectLang(resume) {
  // only trust the explicit language markers : a bare "fr" anywhere used to match a .fr
  // domain or a label like "Senior Dev, FR" and silently flip an english resume to french
  const canonical = typeof resume.meta?.canonical === 'string' ? resume.meta.canonical : ''
  const fromCanonical = /\/(?<lang>[a-z]{2})\.json(?:$|[?#])/u.exec(canonical)?.groups?.lang
  if (fromCanonical !== undefined) return fromCanonical === 'fr' ? 'fr' : 'en'
  const language = typeof resume.meta?.language === 'string' ? resume.meta.language : ''
  return /^fr\b|^français/iu.test(language.trim()) ? 'fr' : 'en'
}

/**
 * Format a JSON Resume date, they are ISO like "2025-03-01" but can also be a lone year
 * @param {unknown} date the raw date
 * @param {string} lang the resume language
 * @returns {string} the human readable month & year, empty when unparsable
 */
function formatDate(date, lang) {
  if (typeof date !== 'string' || date === '') return ''
  if (/^\d{4}$/u.test(date)) return date
  const parsed = new Date(/^\d{4}-\d{2}$/u.test(date) ? `${date}-01` : date)
  if (Number.isNaN(parsed.getTime())) return esc(date)
  return new Intl.DateTimeFormat(lang, { month: 'short', timeZone: 'UTC', year: 'numeric' }).format(parsed)
}

/**
 * Format the "from → to" range shown under each experience or diploma
 * @param {unknown} start the start date
 * @param {unknown} end the end date, missing means the entry is still ongoing
 * @param {string} lang the resume language
 * @returns {string} the formatted range, empty when there is no start date
 */
function formatRange(start, end, lang) {
  const from = formatDate(start, lang)
  if (from === '') return formatDate(end, lang)
  const to = end === undefined || end === '' ? wordings[lang].now : formatDate(end, lang)
  return `${from} → ${to}`
}

/**
 * Compute the age shown in the header, DoYouBuzz displays it next to the contact infos
 * @param {unknown} birthDate the `basics.birthDate` value
 * @param {string} lang the resume language
 * @returns {string} the age line, empty when there is no birth date
 */
function formatAge(birthDate, lang) {
  if (typeof birthDate !== 'string' || birthDate === '') return ''
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return ''
  const age = Math.floor((Date.now() - birth.getTime()) / nbMsInAverageYear)
  return `${age} ${wordings[lang].yearsOld}`
}

/**
 * Join the parts of a subtitle line, they are dot separated by the css
 * @param {unknown[]} parts the subtitle parts, empty ones are dropped
 * @returns {string} the subtitle html, empty when no part survived
 */
function subtitle(parts) {
  const items = parts.filter(part => typeof part === 'string' && part !== '').map(part => `<span>${esc(String(part))}</span>`)
  return items.length === 0 ? '' : `<p class="element__subtitle">${items.join('')}</p>`
}

/**
 * Render a bullet list, used for highlights, courses & mission details
 * @param {unknown} items the list entries
 * @param {RegExp | undefined} regex the keywords to emphasize, undefined to leave the entries as they are
 * @returns {string} the list html, empty when there is nothing to list
 */
function list(items, regex) {
  if (!isFilled(items)) return ''
  const entries = items.map(item => {
    const line = String(item)
    const className = impactRegex.test(line) ? 'element__item element__item--impact' : 'element__item'
    return `<li class="${className}">${escLinks(line, regex)}</li>`
  })
  return `<ul class="element__list">${entries.join('')}</ul>`
}

/**
 * Split the highlights between the regular bullets and the "Environment: a, b, c" lines
 * @param {unknown} items the `highlights` array
 * @returns {{ bullets: unknown[]; environments: string[][] }} the bullets to list and the environment keywords to show as tags
 */
function splitHighlights(items) {
  /** @type {unknown[]} */
  const bullets = []
  /** @type {string[][]} */
  const environments = []
  for (const item of isFilled(items) ? /** @type {unknown[]} */ (items) : []) {
    const found = typeof item === 'string' ? (environmentRegex.exec(item) ?? undefined) : undefined
    const keywords = (found?.groups?.keywords ?? '')
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword !== '')
    // the "Environment:" label itself is dropped, the row of tags speaks for itself
    // a line without any usable keyword stays a plain bullet, dropping it would lose its text
    if (found === undefined || keywords.length === 0) bullets.push(item)
    else environments.push(keywords)
  }
  return { bullets, environments }
}

/**
 * Render keywords as the blue rounded tags DoYouBuzz uses
 * @param {unknown} keywords the keywords to show
 * @returns {string} the tags html, empty when there is no keyword
 */
function tags(keywords) {
  if (!isFilled(keywords)) return ''
  return `<div class="tags">${keywords.map(keyword => `<span class="tags__item">${esc(String(keyword))}</span>`).join('')}</div>`
}

/**
 * Render the highlights of a mission, the bullets first then the environments as tag rows
 * @param {unknown} items the `highlights` array
 * @returns {string} the highlights html, empty when there is nothing to show
 */
function highlights(items) {
  const { bullets, environments } = splitHighlights(items)
  const rows = environments.map(keywords => `<div class="environment">${tags(keywords)}</div>`).join('')
  return `${list(bullets, keywordsRegex)}${rows}`
}

/**
 * Render a free text paragraph
 * @param {unknown} content the text to show
 * @param {string} className the class to put on the paragraph
 * @returns {string} the paragraph html, empty when there is no text
 */
function text(content, className = 'element__text') {
  return typeof content === 'string' && content !== '' ? `<p class="${className}">${escLinks(content, keywordsRegex)}</p>` : ''
}

/**
 * Render a title, linked to its url when the entry has one
 * @param {unknown} titleLabel the entry title
 * @param {unknown} url the optional url to link to
 * @param {unknown} [company] the optional company name, shown in black before the title
 * @returns {string} the title html, empty when there is no title
 */
function title(titleLabel, url, company) {
  if (typeof titleLabel !== 'string' || titleLabel === '') return ''
  const label = esc(titleLabel)
  const inner = typeof url === 'string' && url !== '' ? `<a href="${esc(url)}">${label}</a>` : label
  const prefix = typeof company === 'string' && company !== '' ? `<span class="element__company">${esc(company)}</span>` : ''
  return `<h3 class="element__title">${prefix}${inner}</h3>`
}

/**
 * Wrap a list of already rendered entries into a titled widget
 * @param {string} name the widget title
 * @param {string[]} entries the rendered entries
 * @param {string} [modifier] an optional bem modifier suffix, like `grid` for the three columns layout
 * @returns {string} the widget html, empty when every entry was empty
 */
function widget(name, entries, modifier) {
  const inner = entries.filter(entry => entry !== '').join('')
  const classes = modifier === undefined ? 'widget' : `widget widget--${modifier}`
  return inner === '' ? '' : `<section class="${classes}"><h2 class="widget__title">${esc(name)}</h2>${inner}</section>`
}

/**
 * Render the company logo DoYouBuzz shows on the right of each experience header
 * @param {unknown} image the entry `image` value, a url or a path relative to the rendered html
 * @param {unknown} name the company name, used as the alternative text
 * @returns {string} the logo html, empty when the entry has no image
 */
function logo(image, name) {
  if (typeof image !== 'string' || image === '') return ''
  return `<img alt="${esc(typeof name === 'string' ? name : '')}" class="element__logo" src="${esc(image)}">`
}

/**
 * Render the work & volunteer entries, both share the same shape
 * @param {unknown} entries the `work` or `volunteer` array
 * @param {string} lang the resume language
 * @returns {string[]} the rendered entries
 */
function jobs(entries, lang) {
  if (!isFilled(entries)) return []
  return entries.map(job => {
    const company = job.name ?? job.organization
    const head = `<div class="element__head">${title(job.position, job.url, company)}${subtitle([job.location, job.description, formatRange(job.startDate, job.endDate, lang)])}</div>`
    return `<article class="element"><div class="element__header">${head}${logo(job.image, company)}</div>${text(job.summary)}${highlights(job.highlights)}</article>`
  })
}

/**
 * Render the education entries
 * @param {unknown} entries the `education` array
 * @param {string} lang the resume language
 * @returns {string[]} the rendered entries
 */
function educations(entries, lang) {
  if (!isFilled(entries)) return []
  return entries.map(
    edu =>
      `<article class="element">${title([edu.studyType, edu.area].filter(Boolean).join(' - '), edu.url)}${subtitle([edu.institution, edu.score, formatRange(edu.startDate, edu.endDate, lang)])}${list(edu.courses, noEmphasis)}</article>`,
  )
}

/**
 * Render the skills, each group lists its keywords, like the leveled bullet list DoYouBuzz shows
 * @param {unknown} entries the `skills` array
 * @returns {string[]} the rendered entries
 */
function skills(entries) {
  if (!isFilled(entries)) return []
  return entries.map(skill => `<article class="element">${title(skill.name)}${subtitle([skill.level])}${list(skill.keywords, noEmphasis)}</article>`)
}

/**
 * Render the spoken languages
 * @param {unknown} entries the `languages` array
 * @returns {string[]} the rendered entries
 */
function languages(entries) {
  if (!isFilled(entries)) return []
  return entries.map(language => `<article class="element">${title(language.language)}${subtitle([language.fluency])}</article>`)
}

/**
 * Render the interests, their keywords land in a bullet list like the skills ones
 * @param {unknown} entries the `interests` array
 * @returns {string[]} the rendered entries
 */
function interests(entries) {
  if (!isFilled(entries)) return []
  return entries.map(interest => `<article class="element">${title(interest.name)}${list(interest.keywords, keywordsRegex)}</article>`)
}

/**
 * Render the certificates
 * @param {unknown} entries the `certificates` array
 * @param {string} lang the resume language
 * @returns {string[]} the rendered entries
 */
function certificates(entries, lang) {
  if (!isFilled(entries)) return []
  return entries.map(certificate => `<article class="element">${title(certificate.name, certificate.url)}${subtitle([certificate.issuer, formatDate(certificate.date, lang)])}</article>`)
}

/**
 * Render the awards
 * @param {unknown} entries the `awards` array
 * @param {string} lang the resume language
 * @returns {string[]} the rendered entries
 */
function awards(entries, lang) {
  if (!isFilled(entries)) return []
  return entries.map(award => `<article class="element">${title(award.title, award.url)}${subtitle([award.awarder, formatDate(award.date, lang)])}${text(award.summary)}</article>`)
}

/**
 * Render the publications
 * @param {unknown} entries the `publications` array
 * @param {string} lang the resume language
 * @returns {string[]} the rendered entries
 */
function publications(entries, lang) {
  if (!isFilled(entries)) return []
  return entries.map(publication => `<article class="element">${title(publication.name, publication.url)}${subtitle([publication.publisher, formatDate(publication.releaseDate, lang)])}${text(publication.summary)}</article>`)
}

/**
 * Render the projects, they are shown as cards followed by an optional note
 * @param {unknown} entries the `projects` array
 * @param {string} lang the resume language
 * @param {string} note the already rendered projects note, empty string when there is none
 * @returns {string[]} the rendered entries
 */
function projects(entries, lang, note) {
  if (!isFilled(entries)) return []
  const cards = entries.map(
    project =>
      `<article class="element">${title(project.name, project.url)}${subtitle([project.entity, project.type, formatRange(project.startDate, project.endDate, lang)])}${text(project.description)}${list(project.highlights, keywordsRegex)}${tags(project.keywords)}</article>`,
  )
  return note === '' ? cards : [...cards, note]
}

/**
 * Render the note closing a widget, pointing at the profile where the entries all live
 * @param {unknown} profiles the `basics.profiles` array
 * @param {string} network the network to link to, like "LinkedIn" or "GitHub"
 * @param {string} sentence the wording introducing the link
 * @returns {string} the rendered note, empty string when the resume has no profile on that network
 */
function profileNote(profiles, network, sentence) {
  const profile = (Array.isArray(profiles) ? profiles : []).find(entry => entry?.network === network && typeof entry?.url === 'string' && entry.url !== '')
  if (profile === undefined) return ''
  return `<p class="widget__note">${esc(sentence)} <a href="${esc(profile.url)}">${esc(shortUrl(String(profile.url)))}</a></p>`
}

/**
 * Render the references, they are shown as quotes followed by an optional note
 * the note alone is kept when there is no quote, so the reader still knows where to find them
 * @param {unknown} entries the `references` array
 * @param {string} note the already rendered references note, empty string when there is none
 * @returns {string[]} the rendered entries
 */
function references(entries, note) {
  if (!isFilled(entries)) return note === '' ? [] : [note]
  const quotes = entries.map(
    reference =>
      `<article class="element">${title(reference.name)}${subtitle([reference.position, reference.company])}<blockquote class="reference__quote">${escLinks(String(reference.reference ?? ''), keywordsRegex)}</blockquote></article>`,
  )
  return note === '' ? quotes : [...quotes, note]
}

/**
 * Render one line of header infos, dot separated, plain text or link depending on the value
 * @param {unknown[]} infos the values to render, empty ones are skipped
 * @returns {string} the rendered list, empty string when no info is left
 */
function headerInfos(infos) {
  const items = infos.filter(info => typeof info === 'string' && info !== '').map(info => `<li class="header__info">${/^https?:\/\//u.test(String(info)) ? `<a href="${esc(info)}">${esc(shortUrl(String(info)))}</a>` : esc(info)}</li>`)
  if (items.length === 0) return ''
  return `<ul class="header__infos">${items.join('')}</ul>`
}

/**
 * Render the header : avatar, name, job title and contact infos
 * @param {Record<string, any>} basics the `basics` object
 * @param {string} lang the resume language
 * @returns {string} the header html
 */
function header(basics, lang) {
  const location = [basics.location?.city, basics.location?.countryCode].filter(Boolean).join(', ')
  const contacts = [basics.email, basics.phone, location, formatAge(basics.birthDate, lang)]
  const links = [basics.url, ...(basics.profiles ?? []).map(profile => profile.url)]
  const avatar = typeof basics.image === 'string' && basics.image !== '' ? `<img alt="${esc(basics.name)}" class="header__avatar" src="${esc(basics.image)}">` : ''
  const lists = [contacts, links].map(infos => headerInfos(infos)).join('')
  return `<header class="header">${avatar}<div class="header__identity"><h1 class="header__name">${esc(basics.name)}</h1><p class="header__title">${esc(basics.label)}</p>${lists}</div></header>`
}

/**
 * Render a JSON Resume object to a standalone html page
 * @param {Record<string, any>} resume the parsed JSON Resume object
 * @returns {string} the produced html
 */
export function render(resume) {
  const lang = detectLang(resume)
  const words = wordings[lang]
  const basics = resume.basics ?? {}
  const main = widget(words.experiences, jobs(resume.work, lang))
  const aside = [
    widget(words.skills, skills(resume.skills)),
    widget(words.languages, languages(resume.languages)),
    widget(words.interests, interests(resume.interests)),
    widget(words.education, educations(resume.education, lang)),
    widget(words.certificates, certificates(resume.certificates, lang)),
    widget(words.awards, awards(resume.awards, lang)),
    widget(words.publications, publications(resume.publications, lang)),
  ].join('')
  // volunteer, projects & references go under the two columns, full width, because the aside rarely reaches the bottom of the page
  const referencesNote = profileNote(basics.profiles, 'LinkedIn', isFilled(resume.references) ? words.referencesNote : words.referencesEmptyNote)
  const fullWidgets = [
    widget(words.volunteer, jobs(resume.volunteer, lang)),
    widget(words.projects, projects(resume.projects, lang, profileNote(basics.profiles, 'GitHub', words.projectsNote)), 'grid-3'),
    widget(words.references, references(resume.references, referencesNote), 'grid-2'),
  ].join('')
  const full = fullWidgets === '' ? '' : `<div class="full">${fullWidgets}</div>`
  const updated = typeof resume.meta?.lastModified === 'string' ? `<footer class="footer">${esc(words.updatedOn)} ${formatDate(resume.meta.lastModified.slice(0, isoDateLength), lang)}</footer>` : ''
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(basics.name)}${basics.label === undefined ? '' : ` - ${esc(basics.label)}`}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap">
<style>${styles}</style>
</head>
<body>
<main class="cv">
${header(basics, lang)}
${text(basics.summary, 'summary')}
<div class="columns"><div class="columns__main">${main}</div><aside class="columns__aside">${aside}</aside></div>
${full}
${updated}
</main>
</body>
</html>`
}

export default { render }
