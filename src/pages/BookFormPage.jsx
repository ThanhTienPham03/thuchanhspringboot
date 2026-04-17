import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BooksApi } from "../api/books";

const empty = {
    title: "",
    author: "",
    category: "",
    publisher: "",
    publishedYear: 2024,
    quantity: 1,
    description: "",
    imageUrl: "",
};

export default function BookFormPage({ mode }) {
    const isEdit = mode === "edit";
    const { id } = useParams();
    const nav = useNavigate();

    const [form, setForm] = useState(empty);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            try {
                const b = await BooksApi.getById(id);
                setForm({
                    title: b.title ?? "",
                    author: b.author ?? "",
                    category: b.category ?? "",
                    publisher: b.publisher ?? "",
                    publishedYear: b.publishedYear ?? 2024,
                    quantity: b.quantity ?? 1,
                    description: b.description ?? "",
                    imageUrl: b.imageUrl ?? "",
                });
            } catch (e) {
                setError(e?.message || "Load failed");
            }
        })();
    }, [id, isEdit]);

    function setField(name, value) {
        setForm((p) => ({ ...p, [name]: value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const payload = {
                ...form,
                publishedYear: Number(form.publishedYear),
                quantity: Number(form.quantity),
            };
            if (isEdit) await BooksApi.update(id, payload);
            else await BooksApi.create(payload);
            nav("/books");
        } catch (e) {
            setError(e?.message || "Save failed");
        }
    }

    return (
        <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
            <h2>{isEdit ? "Edit Book" : "Add Book"}</h2>
            <Link to="/books">← Back</Link>
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <form onSubmit={onSubmit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Title" required />
                <input value={form.author} onChange={(e) => setField("author", e.target.value)} placeholder="Author" required />
                <input value={form.category} onChange={(e) => setField("category", e.target.value)} placeholder="Category" />
                <input value={form.publisher} onChange={(e) => setField("publisher", e.target.value)} placeholder="Publisher" />
                <input type="number" value={form.publishedYear} onChange={(e) => setField("publishedYear", e.target.value)} placeholder="Published Year" />
                <input type="number" value={form.quantity} onChange={(e) => setField("quantity", e.target.value)} placeholder="Quantity" />
                <input value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} placeholder="Image URL" />
                <textarea rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Description" />

                <button type="submit">Save</button>
            </form>
        </div>
    );
}