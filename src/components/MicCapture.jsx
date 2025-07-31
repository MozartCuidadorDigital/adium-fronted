import React, { useState, useEffect, useRef } from 'react';
import { useAudioUtils } from '../utils/audioUtils.js';

const MicCapture = ({ 
  isConnected, 
  isCallActive,
  status, 
  onStatusUpdate, 
  onTranscription, 
  onError, 
  sendMessage 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  
  const { convertToWav, createAudioBuffer } = useAudioUtils();

  useEffect(() => {
    // Request microphone permission on component mount
    requestMicrophonePermission();
  }, []);

  // Auto-start recording when call becomes active
  useEffect(() => {
    if (isCallActive && !isRecording && hasPermission) {
      startRecording();
    } else if (!isCallActive && isRecording) {
      stopRecording();
    }
  }, [isCallActive, isRecording, hasPermission]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopRecording();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      setHasPermission(true);
      setupAudioAnalysis(stream);
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      onError('No se pudo acceder al micrófono. Verifica los permisos.');
      setHasPermission(false);
    }
  };

  const setupAudioAnalysis = (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      source.connect(analyserRef.current);
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  };

  const startRecording = async () => {
    if (!isConnected || !hasPermission) {
      onError('No conectado o sin permisos de micrófono');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      const chunks = [];
      
      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          
          // Convert to base64 and send for continuous streaming
          try {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            const base64Audio = await convertToWav(audioBlob);
            
            if (base64Audio) {
              sendMessage({
                type: 'audio_chunk',
                data: base64Audio
              });
            }
          } catch (error) {
            console.error('Error processing audio chunk:', error);
          }
        }
      };

      mediaRecorderRef.current.onstart = () => {
        setIsRecording(true);
        console.log('🎤 Grabación iniciada para llamada continua');
        startAudioLevelMonitoring();
      };

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
        console.log('🛑 Grabación detenida');
        stopAudioLevelMonitoring();
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording with 100ms intervals for real-time streaming
      mediaRecorderRef.current.start(100);

    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Error al iniciar la grabación');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    // Also stop the stream if it exists
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startAudioLevelMonitoring = () => {
    const updateAudioLevel = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average audio level
        const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
        const normalizedLevel = average / 255;
        
        setAudioLevel(normalizedLevel);
      }
      
      if (isRecording) {
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  const stopAudioLevelMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);
  };

  const handleMicClick = () => {
    // In continuous call mode, mic button is just for visual feedback
    // Recording is controlled automatically by call state
    if (isCallActive) {
      console.log('🎤 Micrófono activo en llamada continua');
    } else {
      console.log('🎤 Micrófono inactivo - inicia una llamada');
    }
  };

  const getMicIcon = () => {
    if (isCallActive && isRecording) {
      return '🔴'; // Recording in call
    } else if (isCallActive) {
      return '📞'; // Call active
    } else if (isRecording) {
      return '🔴'; // Recording
    }
    return '🎤'; // Microphone
  };

  const getMicButtonClass = () => {
    let className = 'mic-button';
    if (isCallActive) {
      className += ' call-active';
    } else if (isRecording) {
      className += ' recording';
    }
    if (!isConnected || !hasPermission) {
      className += ' disabled';
    }
    return className;
  };

  const getMicButtonTitle = () => {
    if (isCallActive) {
      return 'Llamada activa - Habla ahora';
    } else if (isRecording) {
      return 'Detener grabación';
    } else {
      return 'Iniciar grabación';
    }
  };

  return (
    <div className="mic-capture">
      <button
        className={getMicButtonClass()}
        onClick={handleMicClick}
        disabled={!isConnected || !hasPermission}
        title={getMicButtonTitle()}
      >
        {getMicIcon()}
      </button>
      
      {/* Audio Level Indicator */}
      {(isRecording || isCallActive) && (
        <div className="audio-level-container">
          <div className="audio-level-bar">
            <div 
              className="audio-level-fill"
              style={{
                width: `${audioLevel * 100}%`,
                backgroundColor: isCallActive ? '#3b82f6' : '#f59e0b'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Status Messages */}
      {isCallActive && (
        <div className="call-status">
          {isRecording ? '🎤 Grabando en tiempo real...' : '📞 Llamada activa'}
        </div>
      )}
      
      {!hasPermission && (
        <div className="permission-warning">
          Permiso de micrófono requerido
        </div>
      )}
      
      {!isConnected && (
        <div className="connection-warning">
          No conectado al servidor
        </div>
      )}
    </div>
  );
};

export default MicCapture; 