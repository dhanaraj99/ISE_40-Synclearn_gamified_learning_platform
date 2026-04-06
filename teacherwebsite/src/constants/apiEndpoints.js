/**
 * API_ROUTES — Single source of truth for all API endpoint paths.
 * These are relative paths that compose with VITE_API_URL in axiosClient.
 *
 * NOTE: No leading slash — VITE_API_URL already ends with '/'.
 * NOTE: Route names are SINGULAR to match Express mount points on the server:
 *       app.use(`${baseUrl}teacher`, ...) → /api/v1/teacher/login
 */
export const API_ROUTES = Object.freeze({
    AUTH: Object.freeze({
        TEACHER_LOGIN: 'teacher/login',
        ADMIN_LOGIN: 'admin/login',
        ADMIN_REGISTER: 'admin/register',
    }),

    ADMIN: Object.freeze({
        ADD_TEACHER: 'admin/add-teacher',
        ADD_STUDENT: 'admin/add-student',
        LIST_TEACHERS: 'admin/teachers',
        LIST_STUDENTS: 'admin/students',
    }),

    TEACHER: Object.freeze({
        ADD_STUDENT: 'teacher/add-student',
    }),

    LESSONS: Object.freeze({
        BASE: 'lesson',
        BY_ID: (id) => `lesson/${id}`,
    }),

    QUIZ: Object.freeze({
        BY_LESSON: (lessonId) => `quiz/lesson/${lessonId}`,
        BASE: 'quiz',
        BY_ID: (id) => `quiz/${id}`,
    }),

    ANNOUNCEMENTS: Object.freeze({
        BASE: 'announcement',
        BY_ID: (id) => `announcement/${id}`,
    }),
});
