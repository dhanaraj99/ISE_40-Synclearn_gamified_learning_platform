# SyncLearn

A full-stack MERN educational platform with role-based access for **Admins**, **Teachers**, and **Students**.

---

## Monorepo Structure

```
synclearn_mono_repo/
├── Server/    → Express + MongoDB REST API (port 5000)
├── client/    → React + Vite — Student Portal   (port 5173)
└── website/   → React + Vite — Teacher & Admin  (port 5174)
```

Each sub-folder has its own `README.md` with setup instructions.

---

## Quick Start

> Run all three concurrently in separate terminals.

```bash
# 1. Backend
cd Server && npm install && npx nodemon server.js

# 2. Student Portal
cd client && npm install && npm run dev

# 3. Teacher/Admin Portal
cd website && npm install && npm run dev
```

### Environment Files

**`Server/.env`**
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/synclearn
JWT_SECRET=your_super_secret_key
BASE_URL=/api/v1/
```

**`client/.env`** and **`website/.env`**
```env
VITE_API_URL=http://localhost:5000/api/v1/
```

---

## Features

| Feature | Description |
|---|---|
| **Role-Based Auth** | Separate JWT login for Student, Teacher, Admin |
| **Lessons** | Teachers create lessons by title, content, category |
| **Quizzes** | 5-question MCQ per lesson; `correctAns` never sent to students |
| **Auto Scoring** | Quiz submission auto-calculates score + increments `Student.totalScore` |
| **Broadcasts** | Admin creates announcements visible to all users |
| **User Management** | Admin adds teachers + students; teachers can add students |
| **Private Routes** | Token-gated routing in both frontends |
| **Global 401 Handling** | Axios interceptor auto-clears session + redirects to login |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + BcryptJS |
| Frontend | React 18, Vite, React Router v6 |
| HTTP | Axios (with request/response interceptors) |
| Notifications | react-hot-toast |

---

## API Base URL

```
http://localhost:5000/api/v1/
```

Full API reference → see [`Server/README.md`](./Server/README.md)

---

## Security Notes

- JWT tokens expire in **1 hour**
- `password` field uses `select: false` — never returned in any query
- `correctAns` stripped server-side before sending quiz to students
- Teacher ownership enforced at the **service layer**
- `localStorage.clear()` + redirect on any 401 response

---

## Default Test Accounts

After running the seed script (`node Server/seed.js`) — or enrolling via the admin panel:

| Role | Portal | Email | Password |
|---|---|---|---|
| Admin | `localhost:5174` | `admin@test.com` | `password123` |
| Teacher | `localhost:5174` | `teacher@test.com` | `password123` |
| Student | `localhost:5173` | `student@test.com` | `password123` |

> Seed script: `node Server/seed.js`"# ISE_40-Synclearn_gamified_learning_platform" 
