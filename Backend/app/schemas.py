from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BookBase(BaseModel):
    title: str
    author: str
    available_copies: int = Field(ge=0)

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    available_copies: Optional[int] = Field(default=None, ge=0)

class BookOut(BookBase):
    id: int
    is_deleted: bool
    deleted_at: Optional[datetime]
    class Config:
        from_attributes = True

class IssueCreate(BaseModel):
    book_id: int
    student_name: str
    days: int = Field(ge=1)

class IssueOut(BaseModel):
    id: int
    book_id: int
    student_name: str
    status: str
    issued_at: datetime
    returned_at: Optional[datetime]
    due_date: Optional[datetime]
    book_title: str
    book_author: str
