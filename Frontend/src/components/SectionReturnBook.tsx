
import { useEffect, useState } from "react";
import { api } from "../api";
import { IssueOut } from "../types";

export default function SectionReturnBook({
  onChanged,
  onNotice
}: {
  onChanged: () => void;
  onNotice: (m: string) => void;
}) {
  const [students, setStudents] = useState<string[]>([]);
  const [student, setStudent] = useState("");
  const [openIssues, setOpenIssues] = useState<IssueOut[]>([]);
  const [busyId, setBusyId] = useState<string>("");

  async function loadStudents() {
    const { data } = await api.get<string[]>("/api/issues/students");
    setStudents(data);
  }

  async function loadOpenFor(name: string) {
    if (!name) {
      setOpenIssues([]);
      return;
    }
    const { data } = await api.get<IssueOut[]>("/api/issues/open_by_student", { params: { student_name: name } });
    setOpenIssues(data);
  }

  useEffect(() => {
    loadStudents();
  }, []);
  useEffect(() => {
    loadOpenFor(student);
  }, [student]);

  async function doReturn(id: number) {
    setBusyId(String(id));
    try {
      await api.post(`/api/issues/${id}/return`, {});
      await onChanged();
      await loadOpenFor(student);
      onNotice("Book returned successfully");
    } finally {
      setBusyId("");
    }
  }

  function fmt(s?: string | null) {
    if (!s) return "-";
    return new Date(s).toLocaleString();
  }

  return (
    <div className="section">
      <h3>Return Book</h3>
      <div className="row" style={{ justifyContent: "center" }}>
        <select value={student} onChange={(e) => setStudent(e.target.value)}>
          <option value="">Select student</option>
          {students.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      {student && (
        <table>
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Book</th>
              <th>Author</th>
              <th>Issued At</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {openIssues.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.book_title}</td>
                <td>{i.book_author}</td>
                <td>{fmt(i.issued_at)}</td>
                <td>{fmt(i.due_date ?? null)}</td>
                <td>
                  <button disabled={busyId === String(i.id)} onClick={() => doReturn(i.id)}>
                    {busyId === String(i.id) ? "Returning..." : "Return"}
                  </button>
                </td>
              </tr>
            ))}
            {openIssues.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: "#777" }}>
                  No open issues
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
