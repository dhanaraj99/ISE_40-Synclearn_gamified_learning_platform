import { showToast } from '../utils/toast';

const baseURL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT = 15000;

/**
 * Custom Fetch API wrapper mimicking Axios interceptors and structure.
 */
class FetchError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
        // Allows mapping syntax like error.response?.status mapping 
        this.response = { status, data, message }; 
    }
}

const fetchClient = async (endpoint, options = {}) => {
    const { timeout = DEFAULT_TIMEOUT, headers = {}, ...rest } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
    }

    // Support params mapping like Axios config.params
    let url = `${baseURL}${endpoint}`;
    if (options.params) {
        const qs = new URLSearchParams(options.params).toString();
        if (qs) {
            url += `?${qs}`;
        }
    }

    try {
        const response = await fetch(url, {
            ...rest,
            headers: defaultHeaders,
            signal: controller.signal,
        });
        
        clearTimeout(id);

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
            try {
                data = JSON.parse(data);
            } catch (e) {
                // Return text if it fails to parse as JSON
            }
        }

        if (!response.ok) {
            throw new FetchError(
                data?.message || `HTTP error! status: ${response.status}`,
                response.status,
                data
            );
        }

        // Mimic axios response payload structure
        return { data, status: response.status, headers: response.headers };

    } catch (error) {
        clearTimeout(id);
        
        const status = error.status;
        
        // Error handling as before in the Axios interceptors
        let message = 'Cannot reach the server. Check your connection.';
        if (error.name === 'AbortError') {
             message = 'Request timed out. Please try again.';
        } else if (error instanceof FetchError) {
             message = error.data?.message || error.message || 'Something went wrong';
        }

        if (status === 401) {
            localStorage.clear();
            if (!window.location.pathname.includes('/login')) {
                showToast.alert('Session expired. Please log in again.');
            }
            window.location.replace('/login');
        } else {
            showToast.error(message);
        }

        return Promise.reject(error);
    }
};

export default {
    get: (url, config = {}) => fetchClient(url, { ...config, method: 'GET' }),
    post: (url, data, config = {}) => fetchClient(url, { ...config, method: 'POST', body: JSON.stringify(data) }),
    put: (url, data, config = {}) => fetchClient(url, { ...config, method: 'PUT', body: JSON.stringify(data) }),
    delete: (url, config = {}) => fetchClient(url, { ...config, method: 'DELETE' })
};
