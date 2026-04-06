# Synclearn: Server and Student Website Documentation

This document outlines the codebase, directory structure, and core features of the backend Server and the Student Website based on the current implementation. The mobile app (`App/student/app`) is excluded from this overview.

---

## 1. High-Level Architecture Overview

Synclearn is a gamified learning platform built on a classic client-server architecture with real-time capabilities. 

*   **Server**: Node.js + Express backend utilizing MongoDB (Mongoose) for the database. Real-time updates and multiplayer interactions (like quiz duels) are facilitated via WebSockets (`socket.io`). User authentication involves JSON Web Tokens (`jsonwebtoken`).
*   **Student Website**: A modern React-based frontend built with Vite. It incorporates `react-router-dom` for navigation, `tailwindcss` for styling, and relies on an internal `fetchClient.js` for API interactions, handling authentication, and state management.

---

## 2. Server Architecture & Structure

**Location**: `/Server/`

### Features
*   **Role-Based Access**: Specialized controllers, models, and routes exist for `Admins`, `Teachers`, and `Students`.
*   **Gamified Learning Resources**: 
    *   **Lessons & Quizzes**: Represent educational content; teachers can assign them as missions.
    *   **Quests & Badges**: Students can complete daily quests and earn gamified badges (handled via `DailyQuestController` and `BadgeController`).
    *   **Leaderboard**: Centralized ranking system tracking student progress and scores.
*   **Real-time Interactions**:
    *   **Announcements**: System-wide or class-wide broadcasts.
    *   **Tournaments & Duels**: A sophisticated WebSocket integration (`src/socket/quizSocket.js`) that lets students play live "Quiz Duels". 
*   **Centralized Error Handling**: Standardized error responses using custom middleware.

### Folder Structure
```text
Server/
├── src/
│   ├── Config/          # Configuration files (e.g., Database connections)
│   ├── Controllers/     # Logic handlers for endpoints
│   │   ├── AdminController.js
│   │   ├── LessonController.js
│   │   ├── QuizController.js
│   │   ├── StudentController.js
│   │   ├── TournamentController.js 
│   │   └── ...
│   ├── Middleware/      # Custom Express middlewares (like ErrorHandler, Auth validation)
│   ├── Models/          # Mongoose Schemas (Admin, Student, Lesson, Quiz, Tournament, etc.)
│   ├── Routes/          # Express route definitions pointing to valid Controllers
│   ├── Services/        # Abstraction layer for complex DB interactions and business logic (e.g., LessonService.js)
│   ├── Utils/           # Helpers and common utility functions
│   └── socket/          # WebSocket event handlers and connection management (quizSocket.js)
├── app.js               # Cross-Origin, base middlewares, and global app route registers
├── server.js            # Node HTTP server connection mapping app and socket.io
├── API_DOCS.txt         # Detailed breakdown of API Endpoints
└── package.json         # Server Dependencies (bcrypt, cors, express, mongoose, socket.io, jsonwebtoken)
```

---

## 3. Student Website Architecture & Structure

**Location**: `/studentwebsite/`

### Features
*   **Secure Routing**: The app leverages `PrivateRoute` and `PublicRoute` wrappers ensuring users only see pages pertinent to their login state, redirecting unauthorized accesses explicitly.
*   **Modern React Paradigms**: Fully utilizing Hooks (`useState`, `useEffect`) and Functional components throughout.
*   **API Client Abstraction**: Centralized API request handling using an internal `fetchClient.js` wrapper inside `src/api/`. This ensures standard application of `authTokens` and unified error interception (recently updated to Fetch API).
*   **Gamified UI/UX**: Interfaces rely on dynamic elements. The `canvas-confetti` library is used to reward students for achieving milestones.

### Folder Structure
```text
studentwebsite/
├── public/                 # Static assets natively served (e.g., index.html base)
├── src/
│   ├── api/                # Internal network layer
│   │   ├── authService.js      # Fetch client calls for logging in and fetching users
│   │   ├── fetchClient.js      # Configured API client module with base URLs, headers
│   │   └── missionService.js   # API wrappers for fetching assignments/lessons
│   ├── assets/             # Bundled static assets (images, icons)
│   ├── components/         # Reusable UI React Components
│   │   ├── PrivateRoute.jsx    # Verifies state for protected access
│   │   ├── PublicRoute.jsx     # Controls login/register visibility
│   │   └── QuizDuelView.jsx    # Specialized UI piece for Live Multiplayer Quiz Duels
│   ├── constants/          # Static app data or enums 
│   ├── pages/              # High-Level Route Components
│   │   ├── HomePage.jsx        # Landing dashboard for a logged-in student
│   │   ├── LoginPage.jsx       # Access portal
│   │   ├── MissionsPage.jsx    # Overview of pending and completed tasks
│   │   ├── ProfilePage.jsx     # Student stats, badges, and persona settings
│   │   └── TournamentPage.jsx  # Access to the leaderboard and duel system
│   ├── utils/              # Application-wide Helper scripts (formatting dates, strings, etc.)
│   ├── App.jsx             # React-Router setup, initializing Toaster for push-alerts
│   ├── index.css           # Global entry point for Tailwind Directives & custom app styling
│   └── main.jsx            # React 19 Root Render Hook
├── eslint.config.js        # Strict ESLint bindings aligned with modern React
├── vite.config.js          # Fast reload/bundles setup utilizing @vitejs/plugin-react and Tailwind
└── package.json            # React, React-Router-DOM, TailwindCSS, Socket.io-client, Hot-Toast
```

## 4. Key Relationships and Integrations
1. **Lessons/Missions**: The `missionService.js` on the Student site requests `LessonController.js` and `QuizController.js` from the server.
2. **Quiz Duels**: The `TournamentPage.jsx` renders `QuizDuelView.jsx`, which connects to `app.js` and dynamically binds via `socket.io-client` against the Server Server's `src/socket/quizSocket.js`. Real-time questions and point synchronization flow back and forth during a match.
3. **Authentication**: Handled primarily via `authService.js` on the frontend pinging `StudentController.js`. Tokens are sent back and securely maintained to authorize `PrivateRoute` viewability.
