"use client";
import React, { useState, useRef } from 'react';
import { PlayCircle, Upload, Film, ListVideo, MonitorPlay } from 'lucide-react';

const VideoLessons = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("");
  const [playlist, setPlaylist] = useState<{name: string, url: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoName(file.name);
      // Thêm vào danh sách phát
      setPlaylist(prev => [{ name: file.name, url: url }, ...prev]);
    }
  };

  const selectFromPlaylist = (video: {name: string, url: string}) => {
    setVideoUrl(video.url);
    setVideoName(video.name);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner shrink-0">
            <Film size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Kho Video bài giảng</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">Quản lý và trình chiếu học liệu số</p>
          </div>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Upload size={14}/> Tải video lên
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main Video Player */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border-4 border-white aspect-video flex items-center justify-center relative group">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain" 
                autoPlay 
                key={videoUrl}
              />
            ) : (
              <div className="text-center space-y-3 opacity-30">
                <MonitorPlay size={60} className="mx-auto text-white" />
                <p className="text-white font-black uppercase tracking-widest text-[10px]">Chưa có video được chọn</p>
              </div>
            )}
            {videoName && (
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-bold truncate max-w-[300px]">{videoName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col h-full min-h-[400px]">
            <h3 className="text-[12px] font-black text-slate-800 uppercase mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <ListVideo size={16} className="text-blue-600" /> Danh sách phát Video
            </h3>
            
            <div className="space-y-2 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
              {playlist.length > 0 ? (
                playlist.map((video, index) => (
                  <div 
                    key={index} 
                    onClick={() => selectFromPlaylist(video)}
                    className={`flex gap-3 p-3 rounded-lg transition-all cursor-pointer group border ${
                      videoUrl === video.url 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="w-16 h-10 bg-slate-200 rounded-md shrink-0 flex items-center justify-center relative overflow-hidden">
                      <PlayCircle size={16} className={videoUrl === video.url ? 'text-blue-600' : 'text-slate-400'} />
                      {videoUrl === video.url && (
                        <div className="absolute inset-0 bg-blue-600/10 animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <h4 className={`text-[10px] font-black uppercase leading-tight truncate ${
                        videoUrl === video.url ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {video.name}
                      </h4>
                      <p className="text-[8px] font-bold text-slate-400 mt-1">VIDEO BÀI GIẢNG</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                  <ListVideo size={40} strokeWidth={1} />
                  <p className="text-[9px] font-black uppercase mt-4">Danh sách đang trống</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLessons;