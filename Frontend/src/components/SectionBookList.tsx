import { useMemo, useState } from "react";
import { BookOut } from "../types";

export default function SectionBookList({ books }: { books: BookOut[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(t) ||
        b.author.toLowerCase().includes(t) ||
        String(b.id).includes(t)
    );
  }, [q, books]);

  return (
    <div className="section">
      <h3>Book List</h3>
      <div className="row" style={{ justifyContent: "flex-start" }}>
        <input
          style={{ minWidth: 300 }}
          placeholder="Search by id/title/author"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="badge">{filtered.length}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Author</th><th>Available</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.available_copies}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "#777" }}>
                No books
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
