import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { videoService } from '../api/videoService';

const TeacherVideoListPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyVideos = async () => {
    setLoading(true);
    try {
      const response = await videoService.getMyVideos();
      if (response.success) {
        setVideos(response.data);
      } else {
        toast.error("Failed to load videos.");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video class? This action cannot be undone and will permanently remove the video file.")) {
      return;
    }

    try {
      const response = await videoService.deleteVideo(id);
      if (response.success) {
        toast.success("Video deleted successfully");
        setVideos(videos.filter(v => v._id !== id));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete video");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
              Manage Videos
            </h1>
            <p className="text-slate-400 mt-1">View or remove videos you have uploaded.</p>
          </div>
          <button 
            onClick={() => navigate('/upload-video')}
            className="px-6 py-2.5 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Upload New Video
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-slate-700/50 rounded-lg animate-pulse w-full"></div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-16 text-center shadow-xl border border-slate-700">
             <div className="mx-auto w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
             </div>
            <h3 className="text-xl font-semibold text-slate-300">No videos uploaded yet</h3>
            <p className="text-slate-500 mt-2 mb-6">You haven't added any video lessons to the platform.</p>
            <button 
              onClick={() => navigate('/upload-video')}
              className="px-6 py-2 bg-slate-700 rounded-lg text-white font-medium hover:bg-slate-600 transition"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Video Details</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Class</th>
                    <th className="p-4 font-medium hidden md:table-cell">Subject</th>
                    <th className="p-4 font-medium hidden lg:table-cell">Uploaded On</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {videos.map(video => (
                    <tr key={video._id} className="hover:bg-slate-700/20 transition-colors group">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-white text-base truncate max-w-[200px] sm:max-w-xs">{video.title}</p>
                          <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">{video.description}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {video.className}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {video.subject}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm hidden lg:table-cell">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                          title="Delete Video"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherVideoListPage;
