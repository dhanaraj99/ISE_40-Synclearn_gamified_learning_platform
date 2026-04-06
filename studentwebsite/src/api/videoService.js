import fetchClient from './fetchClient';

export const videoService = {
  /**
   * Fetch all video classes, optionally filtered by search, className, and subject.
   */
  getVideos: async (params = {}) => {
    // Construct query parameter string
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.className) query.append('className', params.className);
    if (params.subject) query.append('subject', params.subject);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await fetchClient.get(`videos${queryString}`);
    return response.data;
  }
};
