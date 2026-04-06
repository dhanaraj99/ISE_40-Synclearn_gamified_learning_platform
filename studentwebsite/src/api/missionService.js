import fetchClient from './fetchClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Mission Service — Student App
 * Handles all lesson, quiz, and announcement API calls.
 * No axios imports in UI components — always use this service.
 */

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const getAllLessons = async () => {
    const { data } = await fetchClient.get(API_ROUTES.LESSONS.BASE);
    return data;
};

export const getLessonById = async (id) => {
    const { data } = await fetchClient.get(API_ROUTES.LESSONS.BY_ID(id));
    return data;
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────

/** Fetch quiz for a lesson — correctAns stripped by server for students */
export const getQuizForLesson = async (lessonId) => {
    const { data } = await fetchClient.get(API_ROUTES.QUIZ.BY_LESSON(lessonId));
    return data;
};

/** Submit answers array [0-indexed options] for a quiz */
export const submitQuiz = async (quizId, answers) => {
    const { data } = await fetchClient.post(API_ROUTES.QUIZ.SUBMIT(quizId), { answers });
    return data;
};

// ─── Announcements ────────────────────────────────────────────────────────────

export const getAnnouncements = async () => {
    const { data } = await fetchClient.get(API_ROUTES.ANNOUNCEMENTS.BASE);
    return data;
};

// ─── Badges ───────────────────────────────────────────────────────────────────

export const getAllBadges = async () => {
    const { data } = await fetchClient.get('/badge');
    return data;
};

export const getStudentBadges = async (studentId) => {
    const { data } = await fetchClient.get(`/badge/student/${studentId}`);
    return data;
};

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export const getLeaderboard = async (limit = 10, classFilter = null) => {
    const params = { limit };
    if (classFilter) params.class = classFilter;
    const { data } = await fetchClient.get('/leaderboard', { params });
    return data;
};

export const getMyRank = async () => {
    const { data } = await fetchClient.get('/leaderboard/rank');
    return data;
};

// ─── Daily Quests ─────────────────────────────────────────────────────────────

export const getDailyQuests = async () => {
    const { data } = await fetchClient.get('/daily-quests');
    return data;
};

export const completeDailyQuest = async (questId) => {
    const { data } = await fetchClient.post(`/daily-quests/${questId}/complete`);
    return data;
};

// ─── Tournaments ───────────────────────────────────────────────────────────────

export const getTournaments = async () => {
    const { data } = await fetchClient.get('/tournament');
    return data;
};

export const joinTournament = async (tournamentId) => {
    const { data } = await fetchClient.post(`/tournament/${tournamentId}/join`);
    return data;
};

export const getTournamentMatches = async (tournamentId) => {
    const { data } = await fetchClient.get(`/tournament/${tournamentId}/matches`);
    return data;
};

// ─── Avatars ───────────────────────────────────────────────────────────────────
export const updateAvatar = async (avatar) => {
    const { data } = await fetchClient.put('/student/avatar', { avatar });
    return data;
};

