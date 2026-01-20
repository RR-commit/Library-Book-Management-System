
import { useState } from "react";
import { api } from "../api";
import { BookOut } from "../types";
import SectionBookList from "./SectionBookList";

export default function SectionAddBook({
  books,
  allBooks,
  onChanged,
  onNotice
}: {
  books: BookOut[];
  allBooks: BookOut[];
  onChanged: () => void;
  onNotice: (m: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim().toLowerCase();
    const a = author.trim().toLowerCase();
    const dup = allBooks.some(
      (b) => b.title.trim().toLowerCase() === t && b.author.trim().toLowerCase() === a
    );
    if (dup) {
      setMsg("Book already exists");
      return;
    }
    setBusy(true);
    setMsg("");
    const n = copies.trim() ? parseInt(copies, 10) : 0;
    try {
      await api.post("/api/books/", {
        title: title.trim(),
        author: author.trim(),
        available_copies: isNaN(n) ? 0 : n,
      });
      setTitle("");
      setAuthor("");
      setCopies("");
      await onChanged();
      onNotice("Book added successfully");
    } catch (err: any) {
      setMsg(err?.response?.data?.detail || "Add failed");
    }
    setBusy(false);
  }

  return (
    <div className="section">
      <h3>Add Book</h3>
      <form onSubmit={submit} className="row" style={{ justifyContent: "center" }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <input
          type="number"
          min={0}
          placeholder="Available copies"
          value={copies}
          onChange={(e) => setCopies(e.target.value)}
        />
        <button disabled={busy} type="submit">
          {busy ? "Adding..." : "Add"}
        </button>
        {msg && <span className="badge">{msg}</span>}
      </form>
      <SectionBookList books={books} />
    </div>
  );
}
