import { clone, slugify } from 'shuutils'
import rawCv from './CV-romain-racamier-lafon.json'
import type { Photo } from './types'

type JsonResume = typeof rawCv

type ResumeEducation = JsonResume['education'][0] & { id: string }

type ResumeWork = {
  company: string
  endDate: string
  highlights: string[]
  id: string
  keywords: string[]
  photos: Photo[]
  position: string
  sectors: string[]
  startDate: string
}

type Resume = {
  education: ResumeEducation[]
  work: ResumeWork[]
}

function cleanString (input: string) {
  return input
    .trim()
    .replace(/<[^>]*>?/gu, '')
    .replace(/\s+/gu, ' ')
}

function cleanArray (input: Record<string, unknown>[] | string[]) {
  return input.map((item) => {
    if (typeof item === 'string') return cleanString(item)
    if (typeof item === 'object') return cleanObject(item) // eslint-disable-line @typescript-eslint/no-use-before-define
    return item
  })
}

export function cleanObject (input: Record<string, unknown>) {
  const data = clone(input)
  for (const [key, item] of Object.entries(data)) {
    if (typeof item === 'string') data[key] = cleanString(item)
    if (typeof item === 'object' && item) data[key] = cleanObject(item as Record<string, unknown>) // eslint-disable-line @typescript-eslint/consistent-type-assertions
    if (Array.isArray(item)) data[key] = cleanArray(item)
  }
  return data
}

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
