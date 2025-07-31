import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import PredefinedQuestions from './components/PredefinedQuestions';
import VoicePlayer from './components/VoicePlayer';
import { useTotemAPI } from './hooks/useTotemAPI';
import './TotemApp.css';

const TotemApp = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const { 
    sendQuestion, 
    getPredefinedQuestions, 
    predefinedQuestions,
    isLoading: apiLoading 
  } = useTotemAPI();

  const audioRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  useEffect(() => {
    // Cargar preguntas predefinidas al iniciar
    getPredefinedQuestions();
  }, []);

  useEffect(() => {
    // Escuchar el evento de inicio desde el HTML
    const handleStartApp = () => {
      console.log('🚀 Iniciando aplicación...');
      handleQuestionSubmit("Hola");
    };

    window.addEventListener('startApp', handleStartApp);

    return () => {
      window.removeEventListener('startApp', handleStartApp);
    };
  }, []);

  useEffect(() => {
    // Limpiar intervalo de streaming cuando se desmonte
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const handleQuestionSubmit = async (question) => {
    if (!question.trim() || isProcessing) return;

    console.log('🔄 Iniciando procesamiento de pregunta:', question);
    
    setIsProcessing(true);
    setIsStreaming(true);
    setStreamingText('');
    
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log('📤 Enviando pregunta al backend...');
      const response = await sendQuestion(question);
      console.log('📥 Respuesta recibida:', response);
      
      if (response && response.success) {
        console.log('✅ Respuesta exitosa, iniciando streaming...');
        
        // Reproducir audio inmediatamente si está disponible
        if (response.audioUrl && audioRef.current) {
          console.log('🎵 Reproduciendo audio inmediatamente...');
          audioRef.current.src = response.audioUrl;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error reproduciendo audio:', error);
            });
          }
          setIsPlaying(true);
          setCurrentAudioUrl(response.audioUrl);
        }
        
        // Iniciar streaming de texto (audio ya está reproduciéndose)
        await simulateTextAndAudioStreaming(response.text, null);
        
        // Agregar respuesta del asistente
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          text: response.text,
          timestamp: new Date(),
          audioUrl: response.audioUrl
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        console.log('✅ Mensaje del asistente agregado correctamente');
      } else {
        console.error('❌ Respuesta fallida:', response);
        // Agregar mensaje de error
        const errorMessage = {
          id: Date.now() + 1,
          type: 'error',
          text: response?.error || 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('❌ Error en handleQuestionSubmit:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        text: 'Error de conexión. Por favor, verifica tu conexión e intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      console.log('🏁 Finalizando procesamiento...');
      setIsProcessing(false);
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const simulateTextAndAudioStreaming = (fullText, audioUrl) => {
    return new Promise((resolve) => {
      console.log('🎬 Iniciando streaming de texto');
      const words = fullText.split(' ');
      let currentIndex = 0;
      
      // Solo manejar audio si se proporciona audioUrl
      if (audioUrl && audioRef.current) {
        console.log('🎵 Reproduciendo audio...');
        audioRef.current.src = audioUrl;
        
        // Manejar la reproducción de audio de forma segura
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error reproduciendo audio:', error);
          });
        }
        setIsPlaying(true);
      }
      
      streamingIntervalRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          setStreamingText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(streamingIntervalRef.current);
          setStreamingText(fullText);
          console.log('✅ Streaming completado');
          resolve();
        }
      }, 50); // Velocidad de streaming
    });
  };

  const handlePredefinedQuestion = (question) => {
    handleQuestionSubmit(question);
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentAudioUrl(null);
    setIsPlaying(false);
    setStreamingText('');
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentAudioUrl(null);
  };

  const handleAudioPause = (isPaused) => {
    // Opcional: puedes agregar lógica adicional aquí si necesitas manejar el estado de pausa
    console.log('Audio pausado:', isPaused);
  };

  const handleAudioStop = () => {
    setIsPlaying(false);
    setCurrentAudioUrl(null);
  };

  const handleReplayAudio = (audioUrl) => {
    if (audioUrl && audioRef.current) {
      // Usar el método stop del ref para una limpieza más segura
      audioRef.current.stop();
      
      // Pequeña pausa para asegurar que el audio anterior se detenga completamente
      setTimeout(() => {
        // Reproducir el audio seleccionado
        audioRef.current.src = audioUrl;
        
        // Manejar la reproducción de audio de forma segura
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error reproduciendo audio en replay:', error);
          });
        }
        setIsPlaying(true);
        setCurrentAudioUrl(audioUrl);
      }, 50);
    }
  };

  return (
    <div className="totem-app">
      <header className="totem-header">
        <div className="logo-section">
          <div className="logo">
            <img src="/Adium-1.png" alt="Adium Logo" />
          </div>
          <div className="brand">
            
            <p>The Power of GIP</p>
          </div>
        </div>
      </header>

      <main className="totem-main">
        <div className="chat-container">
          <ChatInterface 
            messages={messages}
            streamingText={streamingText}
            isStreaming={isStreaming}
            isProcessing={isProcessing}
            onQuestionSubmit={handleQuestionSubmit}
            onClearChat={handleClearChat}
            onReplayAudio={handleReplayAudio}
            predefinedQuestions={predefinedQuestions}
            onPredefinedQuestion={handlePredefinedQuestion}
          />
        </div>
      </main>

      {/* Audio para reproducción (tanto streaming como replay) */}
      <VoicePlayer 
        audioUrl={currentAudioUrl}
        isPlaying={isPlaying}
        onEnd={handleAudioEnd}
        onPause={handleAudioPause}
        onStop={handleAudioStop}
        ref={audioRef}
      />
    </div>
  );
};

export default TotemApp; 