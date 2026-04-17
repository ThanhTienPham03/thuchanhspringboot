export type BookRecord = Record<string, unknown>

export const ID_CANDIDATE_KEYS = ['id', 'Id', 'bookId', 'bookID', 'ID']

export const COMMON_BOOK_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'author', label: 'Author', type: 'text' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'publishedDate', label: 'Published Date', type: 'date' },
  { key: 'publishedYear', label: 'Published Year', type: 'number' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'publisher', label: 'Publisher', type: 'text' },
  { key: 'quantity', label: 'Quantity', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'imageUrl', label: 'Image URL', type: 'text' },
] as const

export type CommonBookField = (typeof COMMON_BOOK_FIELDS)[number]
