import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { booksApi } from '../lib/api'
import type { BookRecord } from '../types/book'
import {
  filterBooks,
  formatValue,
  getDisplayColumns,
  getValueByCaseInsensitiveKey,
  inferBookId,
  normalizeBooksResponse,
  sortBooks,
} from '../utils/books'

export default function BooksListPage() {
  const [books, setBooks] = useState<BookRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const columns = useMemo(() => getDisplayColumns(books), [books])
  const totalColumns = (columns.length > 0 ? columns.length : 1) + 2

  const visibleBooks = useMemo(() => {
    const filtered = filterBooks(books, searchTerm)
    return sortBooks(filtered, sortKey, sortDirection)
  }, [books, searchTerm, sortDirection, sortKey])

  async function loadBooks() {
    setLoading(true)
    setError('')
    try {
      const data = await booksApi.getBooks()
      setBooks(normalizeBooksResponse(data))
    } catch (error) {
      setError(buildErrorMessage('Không thể tải danh sách sách. Vui lòng kiểm tra backend.', error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadBooks()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  async function handleDelete(book: BookRecord) {
    const id = inferBookId(book)
    if (!id) {
      window.alert('Không xác định được id để xóa bản ghi này.')
      return
    }

    const confirmed = window.confirm(`Bạn có chắc muốn xóa book #${id}?`)
    if (!confirmed) return

    try {
      await booksApi.deleteBook(id)
      await loadBooks()
    } catch (error) {
      setError(buildErrorMessage('Xóa thất bại. Vui lòng thử lại.', error))
    }
  }

  function toggleSortDirection() {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <h1 className="h3 mb-0">Books</h1>
        <Link className="btn btn-primary" to="/books/new">
          + Create Book
        </Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by title/author"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            {[...new Set(['id', 'title', 'author', ...columns])].map((key) => (
              <option key={key} value={key}>
                Sort by {key}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100" onClick={toggleSortDirection}>
            Direction: {sortDirection.toUpperCase()}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                {columns.length > 0 ? (
                  columns.map((column) => <th key={column}>{column}</th>)
                ) : (
                  <th>Book Data</th>
                )}
                <th>Raw JSON</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={totalColumns} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && visibleBooks.length === 0 && (
                <tr>
                  <td colSpan={totalColumns} className="text-center py-4 text-muted">
                    No books found.
                  </td>
                </tr>
              )}

              {!loading &&
                visibleBooks.map((book, index) => {
                  const id = inferBookId(book)
                  return (
                    <tr key={id ?? `book-${index}`}>
                      {columns.length > 0 ? (
                        columns.map((column) => (
                          <td key={column}>{formatValue(getValueByCaseInsensitiveKey(book, column))}</td>
                        ))
                      ) : (
                        <td>
                          <pre className="mb-0 small">{JSON.stringify(book, null, 2)}</pre>
                        </td>
                      )}
                      <td>
                        {columns.length > 0 && (
                          <details>
                            <summary className="small">View</summary>
                            <pre className="mb-0 small">{JSON.stringify(book, null, 2)}</pre>
                          </details>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            className={`btn btn-sm btn-outline-primary${id ? '' : ' disabled'}`}
                            to={id ? `/books/${id}/edit` : '#'}
                            aria-disabled={!id}
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => void handleDelete(book)}
                            disabled={!id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function buildErrorMessage(baseMessage: string, error: unknown): string {
  if (error instanceof Error && error.message) {
    return `${baseMessage} (${error.message})`
  }

  return baseMessage
}
