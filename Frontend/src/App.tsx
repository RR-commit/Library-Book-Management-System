
import "./styles.css";
import { useEffect, useMemo, useState } from "react";
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
import Notice from "./components/Notice";

type Section =
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
  const [softBooks, setSoftBooks] = useState<BookOut[]>([]);
  const [notice, setNotice] = useState("");
  const [tick, setTick] = useState(0);

  function show(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  }

  async function loadBooks() {
    const [a, b] = await Promise.all([
      api.get<BookOut[]>("/api/books/"),
      api.get<BookOut[]>("/api/books/soft_deleted"),
    ]);
    setBooks(a.data);
    setSoftBooks(b.data);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function refreshAll() {
    await loadBooks();
    setTick((t) => t + 1);
  }

  const filteredBooks = useMemo(() => books, [books]);

  return (
    <div className="container">
      <Notice message={notice} onClose={() => setNotice("")} />
      <h1>Library Book Management</h1>

      <div className="btnbar">
        <button onClick={() => setSection("book_list")}>Book List</button>
        <button onClick={() => setSection("add_book")}>Add Book</button>
        <button onClick={() => setSection("update_book")}>Update Book</button>
        <button onClick={() => setSection("delete_book")}>Delete Book</button>
        <button onClick={() => setSection("issue_book")}>Issue Book</button>
        <button onClick={() => setSection("return_book")}>Return Book</button>
        <button onClick={() => setSection("issued_list")}>Issued List</button>
        <button onClick={() => setSection("returned_list")}>Returned List</button>
      </div>

      {section === "book_list" && <SectionBookList books={filteredBooks} />}
      {section === "add_book" && (
        <SectionAddBook
          books={filteredBooks}
          allBooks={[...books, ...softBooks]}
          onChanged={refreshAll}
          onNotice={show}
        />
      )}
      {section === "update_book" && (
        <SectionUpdateBook books={filteredBooks} onChanged={refreshAll} onNotice={show} />
      )}
      {section === "delete_book" && (
        <SectionDeleteBook
          books={filteredBooks}
          softBooks={softBooks}
          onChanged={refreshAll}
          onNotice={show}
        />
      )}
      {section === "issue_book" && (
        <SectionIssueBook books={filteredBooks} onChanged={refreshAll} onNotice={show} />
      )}
      {section === "return_book" && (
        <SectionReturnBook onChanged={refreshAll} onNotice={show} />
      )}
      {section === "issued_list" && <SectionIssuedList refresh={tick} />}
      {section === "returned_list" && <SectionReturnedList refresh={tick} />}
    </div>
  );
}
