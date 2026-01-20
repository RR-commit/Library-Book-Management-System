export interface BookOut {
  id: number;
  title: string;
  author: string;
  available_copies: number;
  is_deleted: boolean;
  deleted_at?: string | null;
}

export interface IssueOut {
  id: number;
  book_id: number;
  student_name: string;
  status: "Issued" | "Returned";
  issued_at: string;
  returned_at?: string | null;
  due_date?: string | null;
  book_title: string;
  book_author: string;
}
