import axios from 'axios'
import type { BookRecord } from '../types/book'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const booksPath = import.meta.env.VITE_BOOKS_PATH ?? '/api/books'
const booksUrl = import.meta.env.VITE_BOOKS_URL as string | undefined

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function buildBooksEndpoint(id?: string): string {
  const segment = id ? `/${encodeURIComponent(id)}` : ''

  if (booksUrl && booksUrl.trim()) {
    return `${trimTrailingSlash(booksUrl.trim())}${segment}`
  }

  const normalizedPath = booksPath.startsWith('/') ? booksPath : `/${booksPath}`
  return `${normalizedPath}${segment}`
}

export const booksApi = {
  async getBooks(): Promise<unknown> {
    const response = await apiClient.get(buildBooksEndpoint())
    return response.data
  },

  async getBookById(id: string): Promise<BookRecord> {
    const response = await apiClient.get(buildBooksEndpoint(id))
    return response.data
  },

  async createBook(payload: BookRecord): Promise<BookRecord> {
    const response = await apiClient.post(buildBooksEndpoint(), payload)
    return response.data
  },

  async updateBook(id: string, payload: BookRecord): Promise<BookRecord> {
    const response = await apiClient.put(buildBooksEndpoint(id), payload)
    return response.data
  },

  async deleteBook(id: string): Promise<void> {
    await apiClient.delete(buildBooksEndpoint(id))
  },
}
