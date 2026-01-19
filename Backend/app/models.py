from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), nullable=False, index=True)
    available_copies = Column(Integer, nullable=False, default=0)
    issues = relationship("Issue", back_populates="book", cascade="all, delete-orphan")

class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False, index=True)
    student_name = Column(String(255), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="Issued")
    issued_at = Column(DateTime, default=datetime.utcnow)
    returned_at = Column(DateTime, nullable=True)
    book = relationship("Book", back_populates="issues")