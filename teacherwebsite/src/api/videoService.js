import fetchClient from './fetchClient';

const baseURL = import.meta.env.VITE_API_URL;

export const videoService = {
  /**
   * Upload a new video
   * @param {FormData} formData - Must contain title, description, className, subject, and the video file
   */
  uploadVideo: async (formData) => {
    const token = localStorage.getItem('token');
    
    const endpoint = baseURL.endsWith('/') ? 'videos/upload' : '/videos/upload';
    
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type, browser will automatically set it with boundary for FormData
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
    }
    return data;
  },
  
  /**
   * Get all video classes uploaded by the logged-in teacher
   */
  getMyVideos: async () => {
    const response = await fetchClient.get('videos/my');
    return response.data;
  },

  /**
   * Delete a specific video class by ID
   */
  deleteVideo: async (id) => {
    const response = await fetchClient.delete(`videos/${id}`);
    return response.data;
  }
};
