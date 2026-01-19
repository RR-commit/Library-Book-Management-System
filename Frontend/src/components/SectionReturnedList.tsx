import { useEffect, useState } from "react";
import { api } from "../api";
import { IssueOut } from "../types";

export default function SectionReturnedList() {
  const [rows, setRows] = useState<IssueOut[]>([]);
  useEffect(() => { api.get<IssueOut[]>("/api/issues", { params: { status_q: "Returned" }}).then(r=>setRows(r.data)); }, []);
  function fmt(s?: string|null) { if (!s) return "-"; return new Date(s).toLocaleString(); }
  return (
    <div className="section">
      <h3>Returned List <span className="badge">{rows.length}</span></h3>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Book</th><th>Author</th><th>Issued At</th><th>Returned At</th></tr>
        </thead>
        <tbody>
          {rows.map(i=>(
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.student_name}</td>
              <td>{i.book_title}</td>
              <td>{i.book_author}</td>
              <td>{fmt(i.issued_at)}</td>
              <td>{fmt(i.returned_at)}</td>
            </tr>
          ))}
          {rows.length===0 && <tr><td colSpan={6} style={{color:"#777"}}>No rows</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
