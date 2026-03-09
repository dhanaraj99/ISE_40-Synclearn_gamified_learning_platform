import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Auth Service — Website App (Teachers & Admins)
 *
 * Server response shape: { success, message, data: { token, user } }
 * Axios gives us `response.data` = the full body above.
 * So the token lives at `response.data.data.token`, destructured below as `data.data`.
 */

export const loginTeacher = async (credentials) => {
    const response = await axiosClient.post(API_ROUTES.AUTH.TEACHER_LOGIN, credentials);
    const { token, user } = response.data.data;   // ← unwrap the nested `data`

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ ...user, role: 'teacher' }));

    return response.data;
};

export const loginAdmin = async (credentials) => {
    const response = await axiosClient.post(API_ROUTES.AUTH.ADMIN_LOGIN, credentials);
    const { token, user } = response.data.data;   // ← unwrap the nested `data`

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ ...user, role: 'admin' }));

    return response.data;
};

export const addTeacher = async (teacherData) => {
    const { data } = await axiosClient.post(API_ROUTES.ADMIN.ADD_TEACHER, teacherData);
    return data;
};

export const addStudent = async (studentData, role = 'teacher') => {
    const endpoint =
        role === 'admin' ? API_ROUTES.ADMIN.ADD_STUDENT : API_ROUTES.TEACHER.ADD_STUDENT;
    const { data } = await axiosClient.post(endpoint, studentData);
    return data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
