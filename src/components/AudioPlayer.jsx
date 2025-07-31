import React, { useEffect, useRef } from 'react';
import { useWebSocket } from '../utils/wsClient.js';

const AudioPlayer = ({ isConnected, onStatusUpdate, onError }) => {
  const audioRef = useRef(null);
  const { addMessageListener, removeMessageListener } = useWebSocket();

  useEffect(() => {
    // Set up message listener for audio data
    const handleAudioMessage = (message) => {
      console.log('AudioPlayer received message:', message.type);
      
      if (message.type === 'audio' && message.data) {
        console.log('AudioPlayer processing audio data, length:', message.data.length);
        playAudio(message.data);
      }
    };

    addMessageListener(handleAudioMessage);

    // Cleanup
    return () => {
      removeMessageListener(handleAudioMessage);
    };
  }, []);

  const playAudio = async (base64Audio) => {
    try {
      // Convert base64 to blob
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create audio element
      const audio = new Audio(audioUrl);
      
      audio.onloadstart = () => {
        onStatusUpdate('speaking');
      };
      
      audio.oncanplay = () => {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          onError('Error reproduciendo audio');
        });
      };
      
      audio.onended = () => {
        onStatusUpdate('ready');
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        onError('Error reproduciendo audio');
        onStatusUpdate('ready');
        URL.revokeObjectURL(audioUrl);
      };
      
      // Store reference for cleanup
      audioRef.current = audio;
      
    } catch (error) {
      console.error('Error processing audio data:', error);
      onError('Error procesando audio');
      onStatusUpdate('ready');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      stopAudio();
    };
  }, []);

  // Stop audio when connection is lost
  useEffect(() => {
    if (!isConnected) {
      stopAudio();
    }
  }, [isConnected]);

  return null; // This component doesn't render anything visible
};

export default AudioPlayer; 