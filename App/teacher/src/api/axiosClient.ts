import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const axiosClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const message = !error.response
            ? 'Cannot reach the server. Check your connection.'
            : error.response.data?.message || error.message || 'Something went wrong';

        if (status === 401) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            Alert.alert('Session Expired', 'Please log in again.');
            router.replace('/(auth)/login');
        } else {
            Alert.alert('Error', message);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
