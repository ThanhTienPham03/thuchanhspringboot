import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { booksApi } from '../lib/api'
import type { BookRecord } from '../types/book'
import { COMMON_BOOK_FIELDS } from '../types/book'
import { inferBookId } from '../utils/books'

function toInputString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function parsePayload(formValues: Record<string, string>): BookRecord {
  const payload: BookRecord = {}

  for (const [key, value] of Object.entries(formValues)) {
    const trimmed = value.trim()
    if (!trimmed) continue

    if (['price', 'publishedYear', 'quantity'].includes(key)) {
      const parsed = Number(trimmed)
      payload[key] = Number.isFinite(parsed) ? parsed : trimmed
      continue
    }

    payload[key] = trimmed
  }

  return payload
}

export default function BookFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const field of COMMON_BOOK_FIELDS) {
      initial[field.key] = ''
    }
    return initial
  })

  const title = useMemo(() => (isEditMode ? `Edit Book #${id}` : 'Create Book'), [id, isEditMode])

  useEffect(() => {
    if (!id) return
    const bookId = id

    async function loadBook() {
      setLoading(true)
      setError('')
      try {
        const book = await booksApi.getBookById(bookId)
        setFormValues((current) => {
          const next = { ...current }
          for (const field of COMMON_BOOK_FIELDS) {
            next[field.key] = toInputString(book[field.key])
          }
          return next
        })
      } catch (error) {
        setError(buildErrorMessage('Không thể tải dữ liệu sách để chỉnh sửa.', error))
      } finally {
        setLoading(false)
      }
    }

    void loadBook()
  }, [id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setError('')

    try {
      const payload = parsePayload(formValues)

      if (isEditMode && id) {
        await booksApi.updateBook(id, payload)
      } else {
        const created = await booksApi.createBook(payload)
        const createdId = inferBookId(created)
        if (createdId) {
          await navigate(`/books/${createdId}/edit`, { replace: true })
          return
        }
      }

      await navigate('/books')
    } catch (error) {
      setError(buildErrorMessage('Lưu thất bại. Vui lòng kiểm tra dữ liệu và thử lại.', error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">{title}</h1>
        <Link className="btn btn-outline-secondary" to="/books">
          Back to list
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p className="mb-0">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {COMMON_BOOK_FIELDS.map((field) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'col-12' : 'col-md-6'}>
                    <label className="form-label" htmlFor={field.key}>
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.key}
                        className="form-control"
                        rows={4}
                        value={formValues[field.key] ?? ''}
                        onChange={(event) =>
                          setFormValues((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <input
                        id={field.key}
                        type={field.type}
                        className="form-control"
                        value={formValues[field.key] ?? ''}
                        onChange={(event) =>
                          setFormValues((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/books">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : isEditMode ? 'Update Book' : 'Create Book'}
                </button>
              </div>
            </form>
          )}
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
