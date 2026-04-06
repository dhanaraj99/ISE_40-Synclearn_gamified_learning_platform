/**
 * API_ROUTES — Single source of truth for all API endpoint paths.
 * These are relative paths that compose with VITE_API_URL in axiosClient.
 *
 * NOTE: No leading slash — VITE_API_URL already ends with '/'.
 * NOTE: Route names are SINGULAR to match Express mount points on the server:
 *       app.use(`${baseUrl}student`, ...) → /api/v1/student/login
 */
export const API_ROUTES = Object.freeze({
    AUTH: Object.freeze({
        LOGIN: 'student/login',
    }),

    STUDENTS: Object.freeze({
        PROFILE: 'student/profile',
        ALL: 'student',
    }),

    LESSONS: Object.freeze({
        BASE: 'lesson',
        BY_ID: (id) => `lesson/${id}`,
    }),

    QUIZ: Object.freeze({
        BY_LESSON: (lessonId) => `quiz/lesson/${lessonId}`,
        BASE: 'quiz',
        SUBMIT: (quizId) => `quiz/${quizId}/submit`,
    }),

    ANNOUNCEMENTS: Object.freeze({
        BASE: 'announcement',
    }),
});
