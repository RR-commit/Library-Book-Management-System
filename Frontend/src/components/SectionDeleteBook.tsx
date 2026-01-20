
import { useMemo, useState } from "react";
import { api } from "../api";
import { BookOut } from "../types";
import SectionBookList from "./SectionBookList";

export default function SectionDeleteBook({
  books,
  softBooks,
  onChanged,
  onNotice
}: {
  books: BookOut[];
  softBooks: BookOut[];
  onChanged: () => void;
  onNotice: (m: string) => void;
}) {
  const [bookId, setBookId] = useState<string>("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookId) return;
    const id = parseInt(bookId, 10);
    setMsg("");
    try {
      await api.patch(`/api/books/${id}/soft_delete`, {});
      setBookId("");
      await onChanged();
      onNotice("Book soft-deleted successfully");
    } catch (err: any) {
      setMsg(err?.response?.data?.detail || "Delete failed");
    }
  }

  const softRows = useMemo(() => {
    return softBooks.slice().sort((a, b) => a.id - b.id);
  }, [softBooks]);

  async function restore(id: number) {
    try {
      await api.patch(`/api/books/${id}/restore`, {});
      await onChanged();
      onNotice("Book restored successfully");
    } catch (err) {}
  }

  return (
    <div className="section">
      <h3>Delete Book (Soft Delete)</h3>
      <form onSubmit={submit} className="row" style={{ justifyContent: "center" }}>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Choose a book to soft-delete</option>
          {books.map((b) => (
            <option key={b.id} value={String(b.id)}>
              #{b.id} — {b.title} — {b.author}
            </option>
          ))}
        </select>
        <button type="submit">Soft Delete</button>
        {msg && <span className="badge">{msg}</span>}
      </form>

      <div className="section">
        <h3>Soft Deleted Books</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Author</th><th>Deleted At</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {softRows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.author}</td>
                <td>{r.deleted_at ? new Date(r.deleted_at).toLocaleString() : "-"}</td>
                <td><button onClick={() => restore(r.id)}>Restore</button></td>
              </tr>
            ))}
            {softRows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: "#777" }}>
                  None
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SectionBookList books={books} />
    </div>
  );
}
