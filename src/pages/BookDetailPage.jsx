import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BooksApi } from "../api/books";

export default function BookDetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await BooksApi.getById(id);
                setItem(data);
            } catch (e) {
                setError(e?.message || "Load failed");
            }
        })();
    }, [id]);

    return (
        <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
            <h2>Book Detail</h2>
            <Link to="/books">← Back</Link>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {!item && !error && <p>Loading...</p>}

            {item && (
                <div style={{ marginTop: 12 }}>
                    <p><b>Title:</b> {item.title}</p>
                    <p><b>Author:</b> {item.author}</p>
                    <p><b>Category:</b> {item.category}</p>
                    <p><b>Publisher:</b> {item.publisher}</p>
                    <p><b>PublishedYear:</b> {item.publishedYear}</p>
                    <p><b>Quantity:</b> {item.quantity}</p>
                    <p><b>Description:</b> {item.description}</p>
                    <p><b>ImageUrl:</b> {item.imageUrl}</p>
                </div>
            )}
        </div>
    );
}