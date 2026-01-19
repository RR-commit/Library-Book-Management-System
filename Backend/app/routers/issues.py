from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/issues", tags=["Issues"])

@router.get("/", response_model=List[schemas.IssueOut])
def list_issues(db: Session = Depends(get_db), status_q: Optional[str] = None):
    q = db.query(models.Issue).join(models.Book).order_by(models.Issue.issued_at.desc())
    if status_q in ("Issued", "Returned"):
        q = q.filter(models.Issue.status == status_q)
    rows = q.all()
    out: List[schemas.IssueOut] = []
    for r in rows:
        out.append(
            schemas.IssueOut(
                id=r.id,
                book_id=r.book_id,
                student_name=r.student_name,
                status=r.status,
                issued_at=r.issued_at,
                returned_at=r.returned_at,
                book_title=r.book.title,
                book_author=r.book.author,
            )
        )
    return out

@router.get("/students", response_model=List[str])
def list_open_students(db: Session = Depends(get_db)):
    rows = db.query(models.Issue.student_name).filter(models.Issue.status == "Issued").distinct().all()
    names = [r[0] for r in rows]
    names.sort(key=lambda x: x.lower())
    return names

@router.get("/open_by_student", response_model=List[schemas.IssueOut])
def open_by_student(student_name: str, db: Session = Depends(get_db)):
    q = db.query(models.Issue).join(models.Book).filter(
        models.Issue.student_name == student_name,
        models.Issue.status == "Issued",
    ).order_by(models.Issue.issued_at.desc())
    rows = q.all()
    out: List[schemas.IssueOut] = []
    for r in rows:
        out.append(
            schemas.IssueOut(
                id=r.id,
                book_id=r.book_id,
                student_name=r.student_name,
                status=r.status,
                issued_at=r.issued_at,
                returned_at=r.returned_at,
                book_title=r.book.title,
                book_author=r.book.author,
            )
        )
    return out

@router.post("/", response_model=schemas.IssueOut, status_code=201)
def issue_book(issue_in: schemas.IssueCreate, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == issue_in.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies available")
    book.available_copies -= 1
    issue = models.Issue(
        book_id=issue_in.book_id,
        student_name=issue_in.student_name,
        status="Issued",
        issued_at=datetime.utcnow(),
        returned_at=None,
    )
    db.add(issue)
    db.add(book)
    db.commit()
    db.refresh(issue)
    return schemas.IssueOut(
        id=issue.id,
        book_id=issue.book_id,
        student_name=issue.student_name,
        status=issue.status,
        issued_at=issue.issued_at,
        returned_at=issue.returned_at,
        book_title=book.title,
        book_author=book.author,
    )

@router.post("/{issue_id}/return", response_model=schemas.IssueOut)
def return_book(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if issue.status == "Returned":
        raise HTTPException(status_code=400, detail="Already returned")
    book = db.query(models.Book).filter(models.Book.id == issue.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found for this issue")
    issue.status = "Returned"
    issue.returned_at = datetime.utcnow()
    book.available_copies += 1
    db.add(issue)
    db.add(book)
    db.commit()
    db.refresh(issue)
    return schemas.IssueOut(
        id=issue.id,
        book_id=issue.book_id,
        student_name=issue.student_name,
        status=issue.status,
        issued_at=issue.issued_at,
        returned_at=issue.returned_at,
        book_title=book.title,
        book_author=book.author,
    )
