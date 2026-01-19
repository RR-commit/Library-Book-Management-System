import "./styles.css";
import { useEffect, useState } from "react";
import { api } from "./api";
import { BookOut } from "./types";
import SectionBookList from "./components/SectionBookList";
import SectionAddBook from "./components/SectionAddBook";
import SectionUpdateBook from "./components/SectionUpdateBook";
import SectionDeleteBook from "./components/SectionDeleteBook";
import SectionIssueBook from "./components/SectionIssueBook";
import SectionReturnBook from "./components/SectionReturnBook";
import SectionIssuedList from "./components/SectionIssuedList";
import SectionReturnedList from "./components/SectionReturnedList";

type Section =
  | "none"
  | "book_list"
  | "add_book"
  | "update_book"
  | "delete_book"
  | "issue_book"
  | "return_book"
  | "issued_list"
  | "returned_list";

export default function App() {
  const [section, setSection] = useState<Section>("book_list");
  const [books, setBooks] = useState<BookOut[]>([]);
  const [busyRefresh, setBusyRefresh] = useState(false);

  async function loadBooks() {
    const { data } = await api.get<BookOut[]>("/api/books/");
    setBooks(data);
  }

  useEffect(() => { loadBooks(); }, []);

  async function refreshAll() {
    await loadBooks();
  }

  return (
    <div className="container">
      <h1>Library Book Management System</h1>
      <div className="btnbar">
        <button onClick={()=>setSection("book_list")}>Book List</button>
        <button onClick={()=>setSection("add_book")}>Add Book</button>
        <button onClick={()=>setSection("update_book")}>Update Book</button>
        <button onClick={()=>setSection("delete_book")}>Delete Book</button>
        <button onClick={()=>setSection("issue_book")}>Issue Book</button>
        <button onClick={()=>setSection("return_book")}>Return Book</button>
        <button onClick={()=>setSection("issued_list")}>Issued List</button>
        <button onClick={()=>setSection("returned_list")}>Returned List</button>
      </div>

      {section === "book_list" && <SectionBookList books={books} />}
      {section === "add_book" && <SectionAddBook books={books} onChanged={refreshAll} />}
      {section === "update_book" && <SectionUpdateBook books={books} onChanged={refreshAll} />}
      {section === "delete_book" && <SectionDeleteBook books={books} onChanged={refreshAll} />}
      {section === "issue_book" && <SectionIssueBook books={books} onChanged={refreshAll} />}
      {section === "return_book" && <SectionReturnBook onChanged={refreshAll} />}
      {section === "issued_list" && <SectionIssuedList />}
      {section === "returned_list" && <SectionReturnedList />}
    </div>
  );
}
