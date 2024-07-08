import { clone, slugify } from 'shuutils'
import type { DeepReadonly } from 'vue'
import rawCv from './CV-romain-racamier-lafon.json'
import type { Photo } from './types'

type JsonResume = DeepReadonly<typeof rawCv>

type ResumeEducation = DeepReadonly<{ id: string } & JsonResume['education'][0]>

type ResumeWork = DeepReadonly<{
  company: string
  endDate: string
  highlights: string[]
  id: string
  keywords: string[]
  photos: Photo[]
  position: string
  sectors: string[]
  startDate: string
}>

type Resume = DeepReadonly<{
  education: ResumeEducation[]
  work: ResumeWork[]
}>

/**
 * Clean a string
 * @param input - String to clean
 * @returns Cleaned string
 */
function cleanString (input: string) {
  return input
    .trim()
    .replace(/<[^>]*>?/gu, '')
    .replace(/\s+/gu, ' ')
}

/**
 * Clean an array
 * @param input - Array to clean
 * @returns Cleaned array
 */
function cleanArray (input: Readonly<Readonly<Record<string, unknown>>[]> | Readonly<Readonly<string>[]>) {
  return input.map((item) => {
    if (typeof item === 'string') return cleanString(item)
    if (typeof item === 'object') return cleanObject(item) // eslint-disable-line @typescript-eslint/no-use-before-define
    return item
  })
}

/**
 * Clean an object
 * @param input - Object to clean
 * @returns Cleaned object
 */
export function cleanObject (input: Readonly<Record<string, unknown>>) {
  const data = clone(input)
  for (const [key, item] of Object.entries(data)) {
    if (typeof item === 'string') data[key] = cleanString(item)
    if (typeof item === 'object' && item) data[key] = cleanObject(item as Record<string, unknown>) // eslint-disable-line @typescript-eslint/consistent-type-assertions
    if (Array.isArray(item)) data[key] = cleanArray(item)
  }
  return data
}

/**
 * Set IDs
 * @param input - Input data
 * @returns Data with IDs
 */
export function setIds (input: JsonResume) {
  const data: Resume = {
    education: input.education.map((item) => ({
      ...item,
      id: slugify(item.institution),
    })),
    work: input.work.map((item) => ({
      company: item.company,
      endDate: item.endDate ?? '',
      highlights: item.highlights,
      id: slugify(item.company),
      keywords: item.keywords,
      photos: item.photos,
      position: item.position,
      sectors: item.sectors,
      startDate: item.startDate,
    })),
  }
  return data
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const cv = setIds(cleanObject(rawCv) as JsonResume)
