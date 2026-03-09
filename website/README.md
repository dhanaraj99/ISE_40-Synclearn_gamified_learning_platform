# SyncLearn — Teacher & Admin Portal (`website/`)

React + Vite app for Teachers and Admins. Runs on **port 5174**.

---

## Setup

```bash
cd website
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1/
```

Start:

```bash
npm run dev
```

---

## Routes

| Path | Page | Access |
|---|---|---|
| `/login` | `LoginPage` | Public |
| `/home` | `HomePage` | All roles |
| `/missions` | `MissionControlPage` | All roles |
| `/announcements` | `AnnouncementsPage` | Admin only |
| `/teachers` | `ManageTeachersPage` | Admin only |
| `/students` | `ManageStudentsPage` | All roles (table: Admin only) |

---

## Features

### Admin
- Add & list teachers (name, email, subject, classes)
- Add & list students (name, email, class, roll number, total score)
- Broadcast announcements to all users
- Create lessons + attach 5-question quizzes

### Teacher
- Create lessons with title, content, and category
- Build 5-question MCQ quizzes (pick correct answer per question)
- Enroll students into the system

---

## Key Files

```
src/
├── api/
│   ├── axiosClient.js       # Axios instance with Bearer token + global 401 handling
│   ├── authService.js       # loginTeacher, loginAdmin, logoutUser
│   ├── missionService.js    # Lesson, Quiz, Announcement CRUD
│   └── userService.js       # addTeacher, listTeachers, addStudent, listStudents
├── constants/
│   └── apiEndpoints.js      # All API route strings
├── utils/
│   └── toast.js             # showToast.success / .error / .alert
├── components/
│   ├── Layout.jsx           # Collapsible sidebar with role-aware nav
│   ├── PublicRoute.jsx
│   └── PrivateRoute.jsx
└── pages/
    ├── LoginPage.jsx              # Toggle Teacher / Admin login
    ├── HomePage.jsx               # Role-specific quick-launch cards
    ├── MissionControlPage.jsx     # Create lessons + inline QuizBuilder
    ├── AnnouncementsPage.jsx      # Broadcast management
    ├── ManageTeachersPage.jsx     # Add teacher form + teacher table
    └── ManageStudentsPage.jsx     # Enroll student form + student table
```

---

## Sidebar Navigation (role-aware)

| Link | Admin | Teacher |
|---|---|---|
| Dashboard | ✅ | ✅ |
| Missions | ✅ | ✅ |
| Students | ✅ | ✅ |
| Teachers | ✅ | ❌ |
| Broadcasts | ✅ | ❌ |
