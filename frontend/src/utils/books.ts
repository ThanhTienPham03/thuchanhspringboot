import type { BookRecord } from '../types/book'
import { ID_CANDIDATE_KEYS } from '../types/book'

const PREFERRED_COLUMNS = [
  'id',
  'title',
  'author',
  'price',
  'publishedDate',
  'publishedYear',
  'category',
  'publisher',
  'quantity',
]

export function normalizeBooksResponse(data: unknown): BookRecord[] {
  if (Array.isArray(data)) {
    return data.filter((item): item is BookRecord => isObject(item))
  }

  if (isObject(data)) {
    const maybeArrays = ['content', 'items', 'data']
    for (const key of maybeArrays) {
      const value = data[key]
      if (Array.isArray(value)) {
        return value.filter((item): item is BookRecord => isObject(item))
      }
    }
  }

  return []
}

export function inferIdKey(record: BookRecord): string | null {
  for (const key of ID_CANDIDATE_KEYS) {
    if (record[key] !== undefined && record[key] !== null) {
      return key
    }
  }
  return null
}

export function inferBookId(record: BookRecord): string | null {
  const idKey = inferIdKey(record)
  if (!idKey) return null
  return String(record[idKey])
}

export function getValueByCaseInsensitiveKey(record: BookRecord, key: string): unknown {
  if (record[key] !== undefined) {
    return record[key]
  }

  const foundKey = Object.keys(record).find(
    (candidate) => candidate.toLowerCase() === key.toLowerCase(),
  )

  return foundKey ? record[foundKey] : undefined
}

export function getDisplayColumns(records: BookRecord[]): string[] {
  const availableLowerCaseKeys = new Set(
    records.flatMap((record) => Object.keys(record).map((key) => key.toLowerCase())),
  )

  return PREFERRED_COLUMNS.filter((key) => availableLowerCaseKeys.has(key.toLowerCase()))
}

export function sortBooks(records: BookRecord[], key: string, direction: 'asc' | 'desc'): BookRecord[] {
  const sorted = [...records].sort((a, b) => {
    const valueA = getValueByCaseInsensitiveKey(a, key)
    const valueB = getValueByCaseInsensitiveKey(b, key)

    return compareValues(valueA, valueB)
  })

  return direction === 'asc' ? sorted : sorted.reverse()
}

export function filterBooks(records: BookRecord[], searchTerm: string): BookRecord[] {
  const normalizedTerm = searchTerm.trim().toLowerCase()
  if (!normalizedTerm) return records

  return records.filter((record) => {
    const title = getValueByCaseInsensitiveKey(record, 'title')
    const author = getValueByCaseInsensitiveKey(record, 'author')

    const titleText = title === undefined || title === null ? '' : String(title).toLowerCase()
    const authorText = author === undefined || author === null ? '' : String(author).toLowerCase()

    if (titleText.includes(normalizedTerm) || authorText.includes(normalizedTerm)) {
      return true
    }

    return JSON.stringify(record).toLowerCase().includes(normalizedTerm)
  })
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function compareValues(valueA: unknown, valueB: unknown): number {
  if (valueA === valueB) return 0

  const numberA = toNumber(valueA)
  const numberB = toNumber(valueB)

  if (numberA !== null && numberB !== null) {
    return numberA - numberB
  }

  const textA = valueA === undefined || valueA === null ? '' : String(valueA).toLowerCase()
  const textB = valueB === undefined || valueB === null ? '' : String(valueB).toLowerCase()

  return textA.localeCompare(textB)
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}
