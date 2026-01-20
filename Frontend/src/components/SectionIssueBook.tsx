
import { useState } from "react";
import { api } from "../api";
import { BookOut, IssueOut } from "../types";

export default function SectionIssueBook({
  books,
  onChanged,
  onNotice
}: {
  books: BookOut[];
  onChanged: () => void;
  onNotice: (m: string) => void;
}) {
  const [bookId, setBookId] = useState<string>("");
  const [student, setStudent] = useState("");
  const [days, setDays] = useState<string>("7");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const availableBooks = books.filter((b) => b.available_copies > 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookId || !student.trim() || !days.trim()) return;
    const d = parseInt(days, 10);
    if (isNaN(d) || d < 1) {
      setMsg("Invalid number of days");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await api.post<IssueOut>("/api/issues/", {
        book_id: parseInt(bookId, 10),
        student_name: student.trim(),
        days: d,
      });
      const due = res.data.due_date ? new Date(res.data.due_date).toLocaleString() : "";
      setBookId("");
      setStudent("");
      setDays("7");
      await onChanged();
      onNotice(`Issued for ${d} days. Return before: ${due}`);
    } catch (err: any) {
      setMsg(err?.response?.data?.detail || "Issue failed");
    }
    setBusy(false);
  }

  return (
    <div className="section">
      <h3>Issue Book</h3>
      <form onSubmit={submit} className="row" style={{ justifyContent: "center" }}>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Select available book</option>
          {availableBooks.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.title} — {b.author} ({b.available_copies})
            </option>
          ))}
        </select>
        <input placeholder="Student name" value={student} onChange={(e) => setStudent(e.target.value)} required />
        <input type="number" min={1} value={days} placeholder="Days" onChange={(e) => setDays(e.target.value)} />
        <button type="submit" disabled={busy || !bookId || !student.trim()}>
          {busy ? "Issuing..." : "Issue"}
        </button>
        {msg && <span className="badge">{msg}</span>}
      </form>
    </div>
  );
}
