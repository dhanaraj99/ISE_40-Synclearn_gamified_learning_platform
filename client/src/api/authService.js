import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Auth Service — Student App
 *
 * Server response shape: { success, message, data: { token, user } }
 * Axios gives us `response.data` = the full body above.
 * So the token lives at `response.data.data.token`, destructured below.
 */

export const loginStudent = async (credentials) => {
    const response = await axiosClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    const { token, user } = response.data.data;   // ← unwrap the nested `data`

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
};

export const getStudentProfile = async () => {
    const { data } = await axiosClient.get(API_ROUTES.STUDENTS.PROFILE);
    return data;
};

export const logoutStudent = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
