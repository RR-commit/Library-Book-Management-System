from pydantic import BaseModel, Field
from typing import Optional, Literal
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
    class Config:
        from_attributes = True

IssueStatus = Literal["Issued", "Returned"]

class IssueCreate(BaseModel):
    book_id: int
    student_name: str

class IssueOut(BaseModel):
    id: int
    book_id: int
    student_name: str
    status: IssueStatus
    issued_at: datetime
    returned_at: Optional[datetime] = None
    book_title: str
    book_author: str