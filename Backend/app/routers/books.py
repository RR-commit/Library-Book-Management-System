from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("/", response_model=List[schemas.BookOut])
def list_books(db: Session = Depends(get_db)):
    return db.query(models.Book).filter(models.Book.is_deleted == False).order_by(models.Book.id.asc()).all()

@router.get("/soft_deleted", response_model=List[schemas.BookOut])
def list_soft_deleted(db: Session = Depends(get_db)):
    return db.query(models.Book).filter(models.Book.is_deleted == True).order_by(models.Book.id.asc()).all()

@router.get("/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/", response_model=schemas.BookOut, status_code=201)
def create_book(book_in: schemas.BookCreate, db: Session = Depends(get_db)):
    book = models.Book(**book_in.model_dump())
    db.add(book)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Book with same title and author already exists")
    db.refresh(book)
    return book

@router.put("/{book_id}", response_model=schemas.BookOut)
def update_book(book_id: int, book_in: schemas.BookUpdate, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    data = book_in.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(book, k, v)
    db.add(book)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Book with same title and author already exists")
    db.refresh(book)
    return book

@router.patch("/{book_id}/soft_delete", response_model=schemas.BookOut)
def soft_delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.is_deleted:
        return book
    book.is_deleted = True
    book.deleted_at = datetime.utcnow()
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@router.patch("/{book_id}/restore", response_model=schemas.BookOut)
def restore_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.is_deleted:
        return book
    book.is_deleted = False
    book.deleted_at = None
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
