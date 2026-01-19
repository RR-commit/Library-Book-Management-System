import { useState } from "react";
import { api } from "../api";
import { BookOut } from "../types";

export default function SectionIssueBook({ books, onChanged }: { books: BookOut[]; onChanged: () => void }) {
  const [bookId, setBookId] = useState<string>("");
  const [student, setStudent] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const availableBooks = books.filter(b=>b.available_copies>0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookId || !student.trim()) return;
    setBusy(true); setMsg("");
    try {
      await api.post("/api/issues/", { book_id: parseInt(bookId,10), student_name: student.trim() });
      setBookId(""); setStudent("");
      await onChanged();
      setMsg("Book issued");
    } catch (e:any) {
      setMsg(e?.response?.data?.detail || "Issue failed");
    }
    setBusy(false);
  }

  return (
    <div className="section">
      <h3>Issue Book</h3>
      <form onSubmit={submit} className="row">
        <select value={bookId} onChange={e=>setBookId(e.target.value)} required>
          <option value="">Select available book</option>
          {availableBooks.map(b=>(
            <option key={b.id} value={String(b.id)}>
              {b.title} — {b.author} ({b.available_copies})
            </option>
          ))}
        </select>
        <input placeholder="Student name" value={student} onChange={e=>setStudent(e.target.value)} required />
        <button disabled={busy || !bookId || !student.trim()} type="submit">{busy ? "Issuing..." : "Issue"}</button>
        {msg && <span className="badge">{msg}</span>}
      </form>
    </div>
  );
}
