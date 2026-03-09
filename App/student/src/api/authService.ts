import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginStudent = async (credentials: any) => {
    const response = await axiosClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    const { token, user } = response.data.data;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    return response.data;
};

export const logoutStudent = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
};
