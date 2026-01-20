
import { useEffect, useState } from "react";
import { api } from "../api";
import { BookOut } from "../types";
import SectionBookList from "./SectionBookList";

export default function SectionUpdateBook({
  books,
  onChanged,
  onNotice
}: {
  books: BookOut[];
  onChanged: () => void;
  onNotice: (m: string) => void;
}) {
  const [bookId, setBookId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!bookId) {
      setTitle("");
      setAuthor("");
      setCopies("");
      return;
    }
    const id = parseInt(bookId, 10);
    const b = books.find((x) => x.id === id);
    if (b) {
      setTitle(b.title);
      setAuthor(b.author);
      setCopies(String(b.available_copies));
    }
  }, [bookId, books]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookId) return;
    const id = parseInt(bookId, 10);
    const payload: any = {};
    if (title.trim()) payload.title = title.trim();
    if (author.trim()) payload.author = author.trim();
    if (copies.trim()) payload.available_copies = isNaN(parseInt(copies, 10)) ? 0 : parseInt(copies, 10);
    if (Object.keys(payload).length === 0) {
      setMsg("Nothing to update");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await api.put(`/api/books/${id}`, payload);
      await onChanged();
      setBookId("");
      setTitle("");
      setAuthor("");
      setCopies("");
      onNotice("Book updated successfully");
    } catch (err: any) {
      setMsg(err?.response?.data?.detail || "Update failed");
    }
    setBusy(false);
  }

  return (
    <div className="section">
      <h3>Update Book</h3>
      <form onSubmit={submit} className="row" style={{ justifyContent: "center" }}>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Choose a book</option>
          {books.map((b) => (
            <option key={b.id} value={String(b.id)}>
              #{b.id} — {b.title} — {b.author}
            </option>
          ))}
        </select>
        <input placeholder="New Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="New Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input
          type="number"
          min={0}
          placeholder="New Available Copies"
          value={copies}
          onChange={(e) => setCopies(e.target.value)}
        />
        <button disabled={busy} type="submit">
          {busy ? "Saving..." : "Update"}
        </button>
        {msg && <span className="badge">{msg}</span>}
      </form>
      <SectionBookList books={books} />
    </div>
  );
}
