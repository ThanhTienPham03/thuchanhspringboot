import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BooksPage from "./pages/BookPage";
import BookDetailPage from "./pages/BookDetailPage";
import BookFormPage from "./pages/BookFormPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/new" element={<BookFormPage mode="create" />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/books/:id/edit" element={<BookFormPage mode="edit" />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;