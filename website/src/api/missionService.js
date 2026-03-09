import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Mission Service — Website App (Teachers & Admins)
 * Lesson CRUD, Quiz CRUD, Announcement management.
 * No axios imports in UI components — always use this service.
 */

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const getAllLessons = async () => {
    const { data } = await axiosClient.get(API_ROUTES.LESSONS.BASE);
    return data;
};

export const getLessonById = async (id) => {
    const { data } = await axiosClient.get(API_ROUTES.LESSONS.BY_ID(id));
    return data;
};

export const createLesson = async (payload) => {
    const { data } = await axiosClient.post(API_ROUTES.LESSONS.BASE, payload);
    return data;
};

export const updateLesson = async (id, payload) => {
    const { data } = await axiosClient.put(API_ROUTES.LESSONS.BY_ID(id), payload);
    return data;
};

export const deleteLesson = async (id) => {
    const { data } = await axiosClient.delete(API_ROUTES.LESSONS.BY_ID(id));
    return data;
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────

export const getQuizForLesson = async (lessonId) => {
    const { data } = await axiosClient.get(API_ROUTES.QUIZ.BY_LESSON(lessonId));
    return data;
};

export const createQuiz = async (payload) => {
    const { data } = await axiosClient.post(API_ROUTES.QUIZ.BASE, payload);
    return data;
};

export const deleteQuiz = async (id) => {
    const { data } = await axiosClient.delete(API_ROUTES.QUIZ.BY_ID(id));
    return data;
};

// ─── Announcements ────────────────────────────────────────────────────────────

export const getAnnouncements = async () => {
    const { data } = await axiosClient.get(API_ROUTES.ANNOUNCEMENTS.BASE);
    return data;
};

export const createAnnouncement = async (payload) => {
    const { data } = await axiosClient.post(API_ROUTES.ANNOUNCEMENTS.BASE, payload);
    return data;
};

export const deleteAnnouncement = async (id) => {
    const { data } = await axiosClient.delete(API_ROUTES.ANNOUNCEMENTS.BY_ID(id));
    return data;
};
