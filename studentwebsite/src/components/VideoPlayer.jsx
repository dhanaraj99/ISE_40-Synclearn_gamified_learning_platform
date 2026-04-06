import React, { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ src, videoId }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  let controlsTimeout = null;

  useEffect(() => {
    // Load saved progress from localStorage mapping by video ID
    if (videoId) {
      const savedTime = localStorage.getItem(`video-progress-${videoId}`);
      if (savedTime && videoRef.current) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  }, [videoId]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    if (isPlaying) {
      controlsTimeout = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        // Hide controls after 3s of playing
        if (controlsTimeout) clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => setShowControls(false), 3000);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    
    setProgress((current / total) * 100);
    setCurrentTime(formatTime(current));
    
    // Save current time to localStorage every ~1 second (timeupdate triggers multiple times a second, so we throttle visually)
    if (videoId && Math.floor(current) % 5 === 0) {
      localStorage.setItem(`video-progress-${videoId}`, current);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleProgressChange = (e) => {
    if (!videoRef.current) return;
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleSeek = (amount) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group bg-black overflow-hidden select-none ${isFullscreen ? 'h-screen w-screen' : 'w-full rounded-lg'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        crossOrigin="anonymous"
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      ></video>

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 space-y-2 mb-2 w-full">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress || 0} 
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between mt-2">
          
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-indigo-400 focus:outline-none">
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <button onClick={() => handleSeek(-10)} className="text-white hover:text-indigo-400 focus:outline-none text-xs font-bold flex flex-col items-center">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"></path></svg>
              -10s
            </button>

            <button onClick={() => handleSeek(10)} className="text-white hover:text-indigo-400 focus:outline-none text-xs font-bold flex flex-col items-center">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"></path></svg>
              +10s
            </button>
            
            <div className="flex items-center space-x-2 group/volume relative">
              <button onClick={toggleMute} className="text-white hover:text-indigo-400 focus:outline-none">
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z m5.414-5l4 4m0-4l-4 4"></path></svg>
                ) : (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                )}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={isMuted ? 0 : volume} 
                onChange={handleVolumeChange} 
                className="w-16 md:w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hidden group-hover/volume:block transition-all"
              />
            </div>

            <span className="text-white text-xs md:text-sm font-medium">
              {currentTime} / {duration}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <select 
              value={playbackSpeed} 
              onChange={handleSpeedChange} 
              className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option className="bg-slate-800" value="0.5">0.5x</option>
              <option className="bg-slate-800" value="1">1x</option>
              <option className="bg-slate-800" value="1.25">1.25x</option>
              <option className="bg-slate-800" value="1.5">1.5x</option>
              <option className="bg-slate-800" value="2">2x</option>
            </select>

            <button onClick={toggleFullscreen} className="text-white hover:text-indigo-400 focus:outline-none">
              {!isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 14h4v4m0-4l-5 5M20 14h-4v4m0-4l5 5M4 10h4V6m0 4l-5-5m16 5h-4V6m0 4l5-5"></path></svg>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
