import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BooksApi } from "../api/books";

export default function BooksPage() {
    const [items, setItems] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState("");

    async function loadAll() {
        setError("");
        const data = await BooksApi.getAll();
        setItems(data);
    }

    useEffect(() => {
        loadAll().catch((e) => setError(e?.message || "Load failed"));
    }, []);

    async function onSearch(e) {
        e.preventDefault();
        setError("");
        try {
            if (!keyword.trim()) return await loadAll();
            const data = await BooksApi.search(keyword.trim());
            setItems(data);
        } catch (e) {
            setError(e?.message || "Search failed");
        }
    }

    async function onDelete(id) {
        if (!window.confirm("Xóa sách này?")) return;
        setError("");
        try {
            await BooksApi.remove(id);
            await loadAll();
        } catch (e) {
            setError(e?.message || "Delete failed");
        }
    }

    return (
        <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
            <h2>Books</h2>

            <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo title/author/category..."
                    style={{ flex: 1, padding: 8 }}
                />
                <button type="submit">Search</button>
                <button type="button" onClick={() => { setKeyword(""); loadAll(); }}>
                    Reset
                </button>
                <Link to="/books/new"><button type="button">+ Add</button></Link>
            </form>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <table width="100%" cellPadding="8" style={{ marginTop: 12, borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th>ID</th>
                    <th>Img</th><th>Title</th><th>Author</th><th>Category</th><th>Qty</th><th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                        <td>{b.id}</td>
                        <img
                            src={b.imageUrl}
                            alt={b.title}
                            style={{ width: 60, height: 80, objectFit: "cover", borderRadius: 6 }}
                            onError={(e) => {
                                e.currentTarget.src = "/no-image.png"; // ảnh fallback đặt trong public/
                            }}
                        />
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.category}</td>
                        <td>{b.quantity}</td>
                        <td style={{ display: "flex", gap: 10 }}>
                            <Link to={`/books/${b.id}`}>View</Link>
                            <Link to={`/books/${b.id}/edit`}>Edit</Link>
                            <button onClick={() => onDelete(b.id)}>Delete</button>
                        </td>

                    </tr>
                ))}
                {items.length === 0 && (
                    <tr><td colSpan="6">No data</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}