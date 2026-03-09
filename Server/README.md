# SyncLearn — Server

Express + MongoDB REST API for the SyncLearn platform.  
Serves both the **Student Portal** (`client/`) and the **Teacher/Admin Portal** (`website/`).

---

## Setup

```bash
cd Server
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/synclearn
JWT_SECRET=your_super_secret_key_here
BASE_URL=/api/v1/
```

Start with hot-reload:

```bash
npx nodemon server.js
```

API will be available at `http://localhost:5000/api/v1/`

---

## Architecture

Every feature follows a strict pipeline:

```
Request → Route → Middleware → Controller → Service → Model → MongoDB
```

| Layer | Responsibility |
|---|---|
| **Route** | Define URL, attach middleware, call controller |
| **Middleware** | `authenticate` (JWT) + `authorizeRoles` (role guard) |
| **Controller** | Extract `req` data, call service, send HTTP response |
| **Service** | All business logic + DB queries; returns `serviceOk` / `serviceFail` |
| **Model** | Mongoose schema |

### Response Shape

All endpoints return:
```json
{ "success": true, "message": "...", "data": { ... } }
```

> ⚠️ Frontend must access payload as `response.data.data` (not `response.data`)

---

## Models

| Model | Key Fields |
|---|---|
| `Admin` | name, email, password (hidden) |
| `Teacher` | name, email, password (hidden), subject, classes[] |
| `Student` | name, email, password (hidden), class, rollNumber, totalScore |
| `Lesson` | title, content, category, teacherId→Teacher, isActive |
| `Quiz` | lessonId→Lesson (unique), questions[5] |
| `QuizAttempt` | quizId, studentId, answers[], score |
| `Announcement` | title, message, adminId→Admin |

---

## API Reference

### Auth (Public)

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/v1/admin/register` | `{ name, email, password }` |
| POST | `/api/v1/admin/login` | `{ email, password }` |
| POST | `/api/v1/teacher/login` | `{ email, password }` |
| POST | `/api/v1/student/login` | `{ email, password }` |

### User Management

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/v1/admin/add-teacher` | Admin | `{ name, email, password, subject, classes[] }` |
| POST | `/api/v1/admin/add-student` | Admin | `{ name, email, password, class, rollNumber }` |
| POST | `/api/v1/teacher/add-student` | Teacher | `{ name, email, password, class, rollNumber }` |
| GET | `/api/v1/admin/teachers` | Admin | — |
| GET | `/api/v1/admin/students` | Admin | — |

### Lessons

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/v1/lesson` | All |
| GET | `/api/v1/lesson/:id` | All |
| POST | `/api/v1/lesson` | Teacher, Admin |
| PUT | `/api/v1/lesson/:id` | Teacher (own), Admin |
| DELETE | `/api/v1/lesson/:id` | Teacher (own), Admin |

### Quizzes

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/quiz/lesson/:lessonId` | All | `correctAns` stripped for students |
| POST | `/api/v1/quiz` | Teacher, Admin | `{ lessonId, questions[5] }` |
| POST | `/api/v1/quiz/:id/submit` | Student | `{ answers: [0,2,1,3,0] }` |
| DELETE | `/api/v1/quiz/:id` | Teacher (own), Admin | — |

### Announcements

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/v1/announcement` | All |
| POST | `/api/v1/announcement` | Admin |
| DELETE | `/api/v1/announcement/:id` | Admin |

---

## Folder Structure

```
Server/
├── server.js              # Entry — connects DB, starts HTTP server
└── src/
    ├── app.js             # Express app setup, route mounting
    ├── Config/
    │   └── db.js          # Mongoose connection
    ├── Models/            # 7 Mongoose schemas
    ├── Services/          # Business logic layer
    ├── Controllers/       # HTTP handler layer
    ├── Routes/            # Express routers
    ├── Middleware/
    │   ├── authMiddleware.js   # authenticate + authorizeRoles
    │   └── errorHandler.js    # Global error middleware
    └── Utils/
        ├── JwtUtils.js        # generateToken / verifyToken
        ├── passwordUtils.js   # hashPassword / comparePassword
        ├── ResponseUtils.js   # serviceOk / serviceFail / successResponse / errorResponse
        └── catchAsync.js      # Async error wrapper
```
