import toast from 'react-hot-toast';

/**
 * Universal toast utility.
 * Import showToast anywhere in the app — never import toast directly.
 *
 * Usage:
 *   showToast.success('Login successful!');
 *   showToast.error('Invalid credentials');
 *   showToast.alert('Session expired, please log in again');
 */
const TOAST_STYLE = {
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.95)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '14px',
    backdropFilter: 'blur(12px)',
};

export const showToast = {
    success: (message) =>
        toast.success(message, {
            style: TOAST_STYLE,
            iconTheme: { primary: '#10b981', secondary: '#fff' },
            duration: 3500,
        }),

    error: (message) =>
        toast.error(message, {
            style: TOAST_STYLE,
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            duration: 4500,
        }),

    alert: (message) =>
        toast(message, {
            icon: '⚠️',
            style: { ...TOAST_STYLE, border: '1px solid rgba(245,158,11,0.3)' },
            duration: 4000,
        }),
};
