import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginTeacher = async (credentials: any) => {
    const response = await axiosClient.post(API_ROUTES.AUTH.TEACHER_LOGIN, credentials);
    const { token, user } = response.data.data;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify({ ...user, role: 'teacher' }));

    return response.data;
};

export const loginAdmin = async (credentials: any) => {
    const response = await axiosClient.post(API_ROUTES.AUTH.ADMIN_LOGIN, credentials);
    const { token, user } = response.data.data;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify({ ...user, role: 'admin' }));

    return response.data;
};

export const logoutUser = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
};
