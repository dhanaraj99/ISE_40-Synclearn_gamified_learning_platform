# SyncLearn — Student Portal (`client/`)

React + Vite app for students. Runs on **port 5173**.

---

## Setup

```bash
cd client
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

| Path | Page | Guard |
|---|---|---|
| `/login` | `LoginPage` | Public (redirects if logged in) |
| `/home` | `HomePage` | Private |
| `/missions` | `MissionsPage` | Private |

---

## Features

- **Login** — Student login with email/password; JWT stored in `localStorage`
- **Home** — Welcome dashboard showing admin broadcasts + total score + quick nav
- **Missions** — Browse active lessons with search filter; read lesson content in modal; take 5-question quiz; see score result (X/5 with progress bar)
- **Auto logout** — Axios interceptor clears `localStorage` and redirects to `/login` on any 401

---

## Key Files

```
src/
├── api/
│   ├── axiosClient.js      # Axios instance with Bearer token + global error handling
│   ├── authService.js      # loginStudent, logoutStudent
│   └── missionService.js   # getAllLessons, getQuizForLesson, submitQuiz, getAnnouncements
├── constants/
│   └── apiEndpoints.js     # All API route strings
├── utils/
│   └── toast.js            # showToast.success / .error / .alert
├── components/
│   ├── PublicRoute.jsx
│   └── PrivateRoute.jsx
└── pages/
    ├── LoginPage.jsx
    ├── HomePage.jsx        # Broadcasts + score card
    └── MissionsPage.jsx    # Lesson grid + quiz modal
```

---

## Auth Flow

1. Student logs in → server returns `{ data: { token, user } }`
2. `authService.js` stores `token` and `user` in `localStorage`
3. Axios request interceptor attaches `Authorization: Bearer <token>` automatically
4. On 401 → `localStorage.clear()` + redirect to `/login`
