"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, Play, RotateCcw, Pause, 
  Maximize2, ChevronDown, Palette,
  Clock, X, Volume2, VolumeX
} from 'lucide-react';

type TimerStyle = 'cyber' | 'minimal' | 'sunset' | 'matrix' | 'luxury';

export const CountdownTimer = () => {
  const [msLeft, setMsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentStyle, setCurrentStyle] = useState<TimerStyle>('cyber');
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  // Hàm tạo âm thanh bằng mã code (Web Audio API)
  const playSound = (frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    if (isMuted) return;
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtx.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log("Audio Error");
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    let requestRef: number;
    let lastTick = 0;

    const animate = (time: number) => {
      if (!lastTick) lastTick = time;
      const delta = time - lastTick;
      lastTick = time;

      setMsLeft((prev) => {
        const next = prev - delta;
        
        // KIỂM TRA TỪNG GIÂY ĐỂ PHÁT TIẾNG TÍCH TẮC
        const currentSec = Math.floor(next / 1000);
        const prevSec = Math.floor(prev / 1000);

        if (next > 0 && currentSec !== prevSec) {
          if (next <= 5000) {
            // 5 giây cuối: Tiếng tích tắc cao độ và nhanh (Hồi hộp)
            playSound(1200, 'sine', 0.1, 0.2);
          } else {
            // Đang chạy: Tiếng tích tắc đều đặn (Vui tai)
            playSound(600, 'sine', 0.05, 0.05);
          }
        }

        // Âm thanh kết thúc khi về 0
        if (next <= 0 && isActive) {
          playSound(440, 'square', 0.5, 0.2);
          setTimeout(() => playSound(554, 'square', 0.5, 0.2), 150);
          setTimeout(() => playSound(659, 'square', 0.8, 0.2), 300);
          setIsActive(false);
          return 0;
        }
        return next;
      });

      requestRef = requestAnimationFrame(animate);
    };

    if (isActive && msLeft > 0) {
      requestRef = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef);
  }, [isActive, msLeft, isMuted]);

  const formatTime = (totalMs: number) => {
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const cents = Math.floor((totalMs % 1000) / 10);
    return {
      main: `${mins > 0 ? mins.toString().padStart(2, '0') + ':' : ''}${secs.toString().padStart(2, '0')}`,
      ms: cents.toString().padStart(2, '0')
    };
  };

  const handleStart = () => {
    if (!isActive && inputValue && msLeft === 0) {
      setMsLeft(parseInt(inputValue) * 60000);
    }
    setIsActive(!isActive);
    // Kích hoạt âm thanh ngay khi bấm nút
    playSound(1000, 'sine', 0.1, 0.01); 
  };

  const timeDisplay = formatTime(msLeft);

  const styleConfigs: Record<TimerStyle, { container: string, text: string, accent: string, label: string, msColor: string }> = {
    cyber: { container: "bg-black border-cyan-500/30", text: "text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] font-mono", msColor: "text-cyan-600/80", accent: "bg-cyan-500", label: "Cyber Neon" },
    minimal: { container: "bg-white border-slate-200", text: "text-slate-800 font-sans tracking-tight", msColor: "text-slate-300", accent: "bg-slate-800", label: "Minimalist" },
    sunset: { container: "bg-gradient-to-br from-orange-500 to-rose-600 border-transparent", text: "text-white drop-shadow-2xl", msColor: "text-white/50", accent: "bg-white/20", label: "Sunset Gradient" },
    matrix: { container: "bg-black border-green-500/50", text: "text-green-500 font-mono tracking-widest drop-shadow-[0_0_15px_#22c55e]", msColor: "text-green-900", accent: "bg-green-600", label: "Matrix Code" },
    luxury: { container: "bg-neutral-900 border-amber-500/50", text: "text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 font-serif", msColor: "text-amber-800", accent: "bg-amber-500", label: "Luxury Gold" }
  };

  const config = styleConfigs[currentStyle];

  return (
    <div ref={containerRef} className={`h-full w-full ${config.container} ${isFullScreen ? 'rounded-0 p-12' : 'rounded-2xl p-6'} flex flex-col justify-between shadow-2xl border transition-all duration-300 relative overflow-hidden`}>
      
      {/* Header */}
      <div className={`flex justify-between items-center z-20 ${isFullScreen ? 'mb-10' : 'mb-4'}`}>
        <div className="flex items-center gap-3">
          <Timer size={isFullScreen ? 32 : 18} className={currentStyle === 'minimal' ? 'text-slate-400' : 'text-white/40'} />
          <span className={`font-black uppercase tracking-[0.3em] ${isFullScreen ? 'text-lg' : 'text-[10px]'} ${currentStyle === 'minimal' ? 'text-slate-400' : 'text-white/40'}`}>
            Professional Race Timer
          </span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-2.5 rounded-xl transition-all border ${currentStyle === 'minimal' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}>
            {isMuted ? <VolumeX size={isFullScreen ? 32 : 16} /> : <Volume2 size={isFullScreen ? 32 : 16} />}
          </button>
          <div className="relative">
            <button onClick={() => setShowStyleMenu(!showStyleMenu)} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-2">
              <Palette size={16} className={currentStyle === 'minimal' ? 'text-slate-600' : 'text-white'} />
            </button>
            {showStyleMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4">
                {(Object.keys(styleConfigs) as TimerStyle[]).map((style) => (
                  <button key={style} onClick={() => { setCurrentStyle(style); setShowStyleMenu(false); }} className="w-full px-5 py-3 text-left text-xs font-black text-slate-600 hover:bg-blue-50 flex items-center gap-3 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${styleConfigs[style].accent}`} /> {styleConfigs[style].label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => isFullScreen ? document.exitFullscreen() : containerRef.current?.requestFullscreen()} className={`p-2.5 rounded-xl border ${currentStyle === 'minimal' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}>
            {isFullScreen ? <X size={isFullScreen ? 32 : 16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Display chính */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10">
        <div className={`flex items-baseline leading-none select-none ${isActive && msLeft <= 5000 && msLeft > 0 ? 'animate-pulse scale-105' : ''}`}>
          <span className={`font-black transition-all duration-300 ${config.text}`} style={{ fontSize: isFullScreen ? '22vw' : '4.5rem' }}>
            {timeDisplay.main}
          </span>
          <span className={`font-black ml-2 transition-all duration-300 ${config.msColor}`} style={{ fontSize: isFullScreen ? '8vw' : '2rem', minWidth: isFullScreen ? '12vw' : '2.5rem' }}>
            .{timeDisplay.ms}
          </span>
        </div>
        
        {!isActive && msLeft === 0 && (
          <div className={`${isFullScreen ? 'mt-10 max-w-md' : 'mt-4 max-w-[150px]'} w-full transition-all`}>
            <input 
              type="number" 
              placeholder="Số phút..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`w-full bg-black/20 border border-white/10 rounded-2xl text-center font-black focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all ${isFullScreen ? 'py-6 text-3xl px-8' : 'py-3 text-sm px-4'} ${currentStyle === 'minimal' ? 'bg-slate-100 text-slate-800' : 'text-white'}`}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`flex gap-6 z-10 ${isFullScreen ? 'max-w-4xl mx-auto w-full mb-10' : 'w-full'}`}>
        <button 
          onClick={handleStart}
          className={`flex-1 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${isFullScreen ? 'py-8 text-2xl' : 'py-4 text-[11px]'} ${
            isActive ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isActive ? <><Pause size={isFullScreen ? 32 : 18}/> Tạm dừng</> : <><Play size={isFullScreen ? 32 : 18}/> Bắt đầu</>}
        </button>
        <button 
          onClick={() => { setIsActive(false); setMsLeft(0); }}
          className={`rounded-2xl transition-all border active:scale-95 flex items-center justify-center ${isFullScreen ? 'px-12 py-8' : 'px-6 py-4'} ${
            currentStyle === 'minimal' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
          }`}
        >
          <RotateCcw size={isFullScreen ? 32 : 18} />
        </button>
      </div>

      <div className="absolute -bottom-20 -right-20 opacity-[0.05] pointer-events-none rotate-12">
        <Clock size={isFullScreen ? 600 : 250} className={currentStyle === 'minimal' ? 'text-slate-900' : 'text-white'} />
      </div>
    </div>
  );
};