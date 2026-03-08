import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Nhạc nền: As Long As You Love Me - Backstreet Boys
  const audioUrl = '/nhac.mp3'; // Trong Vite, file trong public được truy cập trực tiếp từ root /

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
        alert("Hãy nhấn vào màn hình để bắt đầu phát nhạc nhé!");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-container">
      <audio ref={audioRef} src={audioUrl} loop />
      <button
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        <span className="music-text">{isPlaying ? "Đang phát nhạc..." : "Nhấn để bật nhạc 🎵"}</span>
      </button>
    </div>
  );
};

export default BackgroundMusic;
