import axios from 'axios';
import { showToast } from '../utils/toast';

/**
 * Axios instance — single configured HTTP client for the website (management) app.
 * All requests go through this instance. Never import axios directly in UI components.
 */
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Automatically attach Bearer token from localStorage on every outgoing request.
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Global error handling:
//   401     → clear storage + redirect to login
//   Network → friendly "server unreachable" message
//   Others  → fire an error toast with the server message
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // No response at all = network/CORS/server-down issue
        const message = !error.response
            ? 'Cannot reach the server. Check your connection.'
            : error.response.data?.message || error.message || 'Something went wrong';

        if (status === 401) {
            localStorage.clear();
            // Avoid toast on login page itself to prevent double-message
            if (!window.location.pathname.includes('/login')) {
                showToast.alert('Session expired. Please log in again.');
            }
            window.location.replace('/login');
        } else {
            showToast.error(message);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
