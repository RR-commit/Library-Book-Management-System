import { useState } from "react";
import { api } from "../api";
import { BookOut } from "../types";
import SectionBookList from "./SectionBookList";

export default function SectionDeleteBook({ books, onChanged }: { books: BookOut[]; onChanged: () => void }) {
  const [bookId, setBookId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookId) return;
    setBusy(true); setMsg("");
    await api.delete(`/api/books/${parseInt(bookId,10)}`);
    await onChanged();
    setBookId("");
    setBusy(false); setMsg("Book deleted");
  }

  return (
    <div className="section">
      <h3>Delete Book</h3>
      <form onSubmit={submit} className="row">
        <select value={bookId} onChange={e=>setBookId(e.target.value)} required>
          <option value="">Choose a book to delete</option>
          {books.map(b=>(
            <option key={b.id} value={String(b.id)}>
              #{b.id} — {b.title} — {b.author}
            </option>
          ))}
        </select>
        <button disabled={busy} type="submit">{busy ? "Deleting..." : "Delete"}</button>
        {msg && <span className="badge">{msg}</span>}
      </form>
      <SectionBookList books={books} />
    </div>
  );
}
