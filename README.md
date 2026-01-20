# **📚 Library Book Management System**

A full‑stack web application to manage **books**, **soft‑deleted books**, and **issue/return records**.

***

# **🚀 Tech Stack**

### **Backend**

*   FastAPI
*   SQLAlchemy
*   SQLite

### **Frontend**

*   React
*   TypeScript
*   Vite

### **Database**

*   SQLite
*   Auto‑generated tables using SQLAlchemy Base Models

***

# **✨ Features**

### ✅ Book Management

*   Add new books
*   Update existing books
*   Soft delete books (stored in DB)
*   Restore soft‑deleted books
*   View all available books
*   Instant search (title/author/id)

### ✅ Issue / Return Workflow

*   Issue a book to a student
*   Book copy count decreases
*   Return a book
*   Copy count increases
*   Track issued items
*   Track returned history

### ✅ UI Features

*   Clean sections for each operation
*   Success messages visible at top
*   Auto‑refresh after every action
*   Works on any browser

***

# **📁 Project Structure**

    library-system/
    ├─ backend/
    │  ├─ app/
    │  │  ├─ database.py
    │  │  ├─ models.py
    │  │  ├─ schemas.py
    │  │  ├─ main.py
    │  │  └─ routers/
    │  │     ├─ books.py
    │  │     └─ issues.py
    │  └─ requirements.txt
    └─ frontend/
       ├─ index.html
       ├─ package.json
       ├─ tsconfig.json
       ├─ vite.config.ts
       └─ src/
          ├─ main.tsx
          ├─ App.tsx
          ├─ api.ts
          ├─ types.ts
          ├─ styles.css
          └─ components/
             ├─ SectionBookList.tsx
             ├─ SectionAddBook.tsx
             ├─ SectionUpdateBook.tsx
             ├─ SectionDeleteBook.tsx
             ├─ SectionIssueBook.tsx
             ├─ SectionReturnBook.tsx
             ├─ SectionIssuedList.tsx
             └─ SectionReturnedList.tsx
             └─ Notice.tsx

***

# **🧩 Prerequisites**

Make sure you have installed:

*   **Python 3.10+**
*   **Node.js (18 or 20+)**
*   **npm**
*   **Git**
*   **VS Code**

***

# **⚙️ Backend Setup**

### 1. Open terminal

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv .venv
```

### 3. Activate

**Windows**

```bash
.\.venv\Scripts\activate
```

**macOS/Linux**

```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start backend

```bash
uvicorn app.main:app --reload --port 8080
```

Backend available at:  
👉 **<http://localhost:8080/docs>**

***

# **🖥️ Frontend Setup**

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend available at:  
👉 **<http://localhost:5173>**

***

# **📘 How to Use the Application**

## **➕ Add a Book**

1.  Go to **Add Book**
2.  Enter title, author, copies
3.  Click **Add**
4.  You see a success message at top

***

## **✏️ Update a Book**

1.  Go to **Update Book**
2.  Select an existing book
3.  Edit fields
4.  Click **Update**

***

## **🗑️ Soft Delete a Book**

1.  Go to **Delete Book**
2.  Choose a book
3.  Click **Soft Delete**
4.  It moves to **Soft Deleted Books**

### Restore:

Click **Restore**

***

## **📖 Issue a Book**

1.  Go to **Issue Book**
2.  Select an available book
3.  Enter student name
4.  Enter days
5.  Click **Issue**

### After issuing:

A message appears like:  
**Issued for 7 days. Return before: 1/27/2026, 10:51:07 AM**

***

## **📦 Return a Book**

1.  Go to **Return Book**
2.  Choose a student
3.  List of their issued books appears
4.  Click **Return**

Success message appears.

***

## **📋 Book List**

*   Shows all books
*   Search instantly by typing

## **📥 Issued List**

*   Shows all currently issued books
*   Updates after every issue/return

## **📤 Returned List**

*   History of all returns

***

# **📡 API Summary**

## **Books**

    GET    /api/books/                   → list all active books
    GET    /api/books/soft_deleted       → list soft-deleted books
    GET    /api/books/{id}               → get a single book
    POST   /api/books/                   → add a book
    PUT    /api/books/{id}               → update book
    PATCH  /api/books/{id}/soft_delete   → soft delete
    PATCH  /api/books/{id}/restore       → restore book
    DELETE /api/books/{id}               → permanent delete

***

## **Issues**

    POST   /api/issues/                        → issue a book
    POST   /api/issues/{id}/return             → return a book
    GET    /api/issues                         → list issues
            ?status_q=Issued
            ?status_q=Returned
    GET    /api/issues/students                → list students with issued books
    GET    /api/issues/open_by_student?name    → issued items for student




