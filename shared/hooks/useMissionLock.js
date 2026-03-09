import { useCallback } from 'react';

/**
 * useMissionLock - A shared hook for web and mobile clients
 * Provides helper functions to determine if a lesson is accessible based on the 'isLocked' flag
 * provided by the backend, or by its category/bounty status.
 */
export const useMissionLock = () => {

    /**
     * @param {Object} lesson - The lesson object from the API
     * @param {boolean} [isAdminOrTeacher=false] - Whether the current user is an admin or teacher
     * @returns {boolean} - True if the lesson is locked and inaccessible
     */
    const isLocked = useCallback((lesson, isAdminOrTeacher = false) => {
        // Admins and teachers can access everything
        if (isAdminOrTeacher) return false;

        // If the backend explicitly flagged it as locked
        if (lesson?.isLocked) return true;

        return false;
    }, []);

    const getLockMessage = useCallback((lesson) => {
        if (!lesson) return "";
        if (lesson.isLocked) return "Complete the previous mission to unlock this one.";
        return "";
    }, []);

    return {
        isLocked,
        getLockMessage
    };
};
