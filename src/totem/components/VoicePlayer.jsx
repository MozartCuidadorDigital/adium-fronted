import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './VoicePlayer.css';

const VoicePlayer = forwardRef(({ audioUrl, isPlaying, onEnd, onPause, onStop }, ref) => {
  const audioRef = React.useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPaused(false);
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPaused(true);
      }
    },
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        setIsPaused(false);
      }
    }
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (audioUrl && isPlaying) {
        // Solo limpiar si hay un audio diferente
        if (audio.src !== audioUrl) {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
          setIsPaused(false);
        }
        
        audio.src = audioUrl;
        audio.load();
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
          });
        }
      } else if (!isPlaying && audio.src) {
        // Solo limpiar si no se está reproduciendo
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        setIsPaused(false);
      }
    }
  }, [audioUrl, isPlaying]);

  const handleAudioEnd = () => {
    setIsPaused(false);
    onEnd();
  };

  const handleAudioError = (error) => {
    console.error('Audio error:', error);
    setIsPaused(false);
    onEnd();
  };

  const handlePauseClick = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
        onPause && onPause(false);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        onPause && onPause(true);
      }
    }
  };

  const handleStopClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      setIsPaused(false);
      onStop && onStop();
    }
  };

  return (
    <div className="voice-player">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={handleAudioError}
        preload="auto"
        style={{ display: 'none' }}
      />
      
      {isPlaying && (
        <div className="audio-indicator">
          <div className="audio-waves">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <span className="audio-text">
            {isPaused ? 'Audio pausado' : 'Reproduciendo audio...'}
          </span>
          <div className="audio-controls">
            <button
              onClick={handlePauseClick}
              className="audio-control-btn pause-btn"
              title={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              )}
            </button>
            <button
              onClick={handleStopClick}
              className="audio-control-btn stop-btn"
              title="Detener"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h12v12H6z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

VoicePlayer.displayName = 'VoicePlayer';

export default VoicePlayer; 