import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * User Service — Website App
 * Handles Teacher and Student management for Admin and Teacher roles.
 * No axios imports in components — always use this service.
 */

// ─── Teachers (Admin only) ────────────────────────────────────────────────────

/**
 * Add a new teacher.
 * @param {{ name, email, password, subject, classes: string[] }} payload
 */
export const addTeacher = async (payload) => {
    const { data } = await axiosClient.post(API_ROUTES.ADMIN.ADD_TEACHER, payload);
    return data;
};

/** Get all teachers list (admin only) */
export const listTeachers = async () => {
    const { data } = await axiosClient.get(API_ROUTES.ADMIN.LIST_TEACHERS);
    return data;
};

// ─── Students (Admin + Teacher) ───────────────────────────────────────────────

/**
 * Add a new student.
 * @param {{ name, email, password, class, rollNumber }} payload
 * @param {'admin'|'teacher'} role — determines which endpoint to use
 */
export const addStudent = async (payload, role = 'teacher') => {
    const endpoint = role === 'admin'
        ? API_ROUTES.ADMIN.ADD_STUDENT
        : API_ROUTES.TEACHER.ADD_STUDENT;
    const { data } = await axiosClient.post(endpoint, payload);
    return data;
};

/** Get all students list (admin only via admin/students endpoint) */
export const listStudents = async () => {
    const { data } = await axiosClient.get(API_ROUTES.ADMIN.LIST_STUDENTS);
    return data;
};
