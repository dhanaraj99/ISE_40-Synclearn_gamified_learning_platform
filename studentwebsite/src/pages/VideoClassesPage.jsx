import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { videoService } from '../api/videoService';
import VideoPlayer from '../components/VideoPlayer';

const VideoClassesPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    className: '',
    subject: ''
  });

  const classes = ["Class 10", "Class 11", "Class 12", "Foundation"];
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"];

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await videoService.getVideos(filters);
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
    // Delay fetching slightly to allow typing search string without spamming
    const timeoutId = setTimeout(() => {
      fetchVideos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.className, filters.subject]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getFullVideoUrl = (relativeUrl) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const origin = baseURL.split('/api')[0];
    return `${origin}${relativeUrl}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Filters */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Video Classes
            </h1>
            <p className="text-slate-400 mt-2 md:mt-0">Learn at your own pace anytime, anywhere.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search video titles..."
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
            <select
              name="className"
              value={filters.className}
              onChange={handleFilterChange}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full cursor-pointer"
            >
              <option value="">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full cursor-pointer"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Loading / Empty / Content States */}
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-slate-800 rounded-2xl animate-pulse flex flex-col h-[400px]">
                <div className="h-2/3 bg-slate-700 rounded-t-2xl w-full"></div>
                <div className="h-1/3 p-6 space-y-4">
                  <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-16 text-center shadow-xl border border-slate-700">
            <svg className="mx-auto h-16 w-16 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-slate-300">No videos found.</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {videos.map(video => (
              <div key={video._id} className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-colors flex flex-col">
                <div className="w-full aspect-video bg-black relative">
                  <VideoPlayer 
                    src={getFullVideoUrl(video.videoUrl)} 
                    videoId={video._id} 
                  />
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <h2 className="text-2xl font-bold text-white line-clamp-1">{video.title}</h2>
                       <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-4">
                         {video.subject}
                       </span>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700 flex flex-wrap gap-4 items-center justify-between text-sm">
                    <div className="flex items-center text-slate-300 gap-2">
                       <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                         {video.uploadedBy?.name?.charAt(0) || "T"}
                       </div>
                       <span className="font-medium text-slate-200">
                         {video.uploadedBy?.name || "Unknown Teacher"}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        {video.className}
                      </span>
                      <span className="flex items-center gap-1">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                         {new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoClassesPage;
