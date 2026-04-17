import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import BookFormPage from './pages/BookFormPage'
import BooksListPage from './pages/BooksListPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksListPage />} />
        <Route path="/books/new" element={<BookFormPage />} />
        <Route path="/books/:id/edit" element={<BookFormPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  )
}
