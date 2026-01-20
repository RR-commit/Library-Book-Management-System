from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import books, issues

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Book Management System")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(issues.router)
