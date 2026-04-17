# Frontend - Books Admin Dashboard

React + Vite + TypeScript frontend for CRUD quản lý `books` của backend Spring Boot.

## 1) Cài đặt và chạy

```bash
cd frontend
npm i
npm run dev
```

Mặc định app chạy tại `http://localhost:5173`.

## 2) Cấu hình biến môi trường

Copy file mẫu và chỉnh nếu cần:

```bash
cp .env.example .env
```

Biến hỗ trợ:

- `VITE_API_BASE_URL` (default: `http://localhost:8080`)
- `VITE_BOOKS_PATH` (default: `/api/books`)
- `VITE_BOOKS_URL` (optional, URL đầy đủ, ví dụ `http://localhost:8080/api/books`)

> Nếu dùng `VITE_BOOKS_URL`, frontend sẽ gọi trực tiếp URL này.

## 3) Route frontend

- `/` -> redirect `/books`
- `/books` -> danh sách books + search/filter/sort
- `/books/new` -> tạo mới
- `/books/:id/edit` -> chỉnh sửa theo id

## 4) Endpoint backend kỳ vọng

Base backend theo yêu cầu:

- `GET /api/books`
- `GET /api/books/{id}`
- `POST /api/books`
- `PUT /api/books/{id}`
- `DELETE /api/books/{id}`

Frontend có cấu hình Vite proxy để `/api` chuyển tiếp về `http://localhost:8080` khi chạy dev.

## 5) Build và lint

```bash
npm run lint
npm run build
```
