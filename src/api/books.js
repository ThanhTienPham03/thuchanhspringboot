import { http } from "./http";

const BASE = "/api/books";

export const BooksApi = {
    getAll: () => http.get(BASE).then((r) => r.data),
    getById: (id) => http.get(`${BASE}/${id}`).then((r) => r.data),
    search: (keyword) =>
        http.get(`${BASE}/search`, { params: { keyword } }).then((r) => r.data),
    create: (payload) => http.post(BASE, payload).then((r) => r.data),
    update: (id, payload) => http.put(`${BASE}/${id}`, payload).then((r) => r.data),
    remove: (id) => http.delete(`${BASE}/${id}`).then((r) => r.data),
};