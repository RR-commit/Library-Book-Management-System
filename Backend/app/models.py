from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Book(Base):
    __tablename__ = "books"
    __table_args__ = (UniqueConstraint("title", "author", name="uix_title_author"),)

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    available_copies = Column(Integer, nullable=False, default=0)
    is_deleted = Column(Boolean, nullable=False, default=False)
    deleted_at = Column(DateTime, nullable=True)

    issues = relationship("Issue", back_populates="book")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    student_name = Column(String, nullable=False)
    status = Column(String, default="Issued")
    issued_at = Column(DateTime, default=datetime.utcnow)
    returned_at = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    book = relationship("Book", back_populates="issues")
