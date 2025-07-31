import React, { useState, useRef, useEffect } from 'react';
import { 
  MdChat, 
  MdInfo, 
  MdWarning, 
  MdLocalHospital, 
  MdSecurity, 
  MdLink,
  MdMic,
  MdSend,
  MdClose,
  MdReplay
} from 'react-icons/md';
import './ChatInterface.css';

const ChatInterface = ({ 
  messages, 
  streamingText, 
  isStreaming, 
  isProcessing, 
  onQuestionSubmit, 
  onClearChat,
  onReplayAudio,
  predefinedQuestions,
  onPredefinedQuestion
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAutoSending, setIsAutoSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    // Focus en el input cuando no está procesando
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('🎤 Micrófono activado');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        console.log('🎤 Texto reconocido:', transcript);
        
        // Mostrar que se va a enviar automáticamente
        setIsAutoSending(true);
        
        // Enviar automáticamente después de un pequeño delay
        setTimeout(() => {
          if (transcript.trim() && !isProcessing) {
            onQuestionSubmit(transcript.trim());
            setInputText('');
          }
          setIsAutoSending(false);
        }, 1000); // 1 segundo de delay para que el usuario pueda ver el texto
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('🎤 Micrófono desactivado');
      };
    } else {
      console.warn('Reconocimiento de voz no soportado en este navegador');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onQuestionSubmit(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleMicClick = () => {
    if (!isProcessing && !isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error iniciando reconocimiento de voz:', error);
      }
    } else if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReplayClick = (audioUrl) => {
    if (audioUrl) {
      onReplayAudio(audioUrl);
    }
  };

  return (
    <div className="chat-interface">
      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 && !isStreaming && (
          <div className="welcome-message">
            <div className="welcome-icon">
              <MdChat size={48} />
            </div>
            <h3>Información sobre Mounjaro</h3>
            <p>Pregunte cualquier cosa necesaria sobre Mounjaro.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.type}`}
          >
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-footer">
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
                {message.type === 'assistant' && message.audioUrl && (
                  <button
                    className="replay-button"
                    onClick={() => handleReplayClick(message.audioUrl)}
                    aria-label="Volver a reproducir audio"
                    title="Volver a reproducir audio"
                  >
                    <MdReplay size={12} />
                    <span>Reproducir</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isStreaming && streamingText && (
          <div className="message assistant streaming">
            <div className="message-content">
              <div className="message-text">
                {streamingText}
                <span className="streaming-cursor">|</span>
              </div>
              <div className="message-footer">
                <div className="streaming-audio-indicator">
                  <div className="audio-wave">
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                    <div className="wave-bar"></div>
                  </div>
                  <span>Reproduciendo...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isProcessing && !streamingText && (
          <div className="message assistant processing">
            <div className="message-content">
              <div className="processing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        {/* Floating Question Buttons */}
        {predefinedQuestions && predefinedQuestions.length > 0 && (
          <div className="floating-questions">
            {predefinedQuestions.map((question) => {
              // Determinar el ícono basado en el ID de la pregunta
              let IconComponent = MdChat; // Default
              if (question.id === "info") IconComponent = MdInfo;
              else if (question.id === "effects") IconComponent = MdWarning;
              else if (question.id === "dosage") IconComponent = MdLocalHospital;
              else if (question.id === "safety") IconComponent = MdSecurity;
              else if (question.id === "interactions") IconComponent = MdLink;
              
              return (
                <button
                  key={question.id}
                  onClick={() => onPredefinedQuestion(question.question)}
                  disabled={isProcessing}
                  className="floating-question-btn"
                  title={question.text}
                >
                  <div className="question-icon">
                    <IconComponent size={20} />
                  </div>
                  <span className="question-text">{question.text}</span>
                </button>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isAutoSending ? "Enviando automáticamente..." : "Escriba su pregunta..."}
              disabled={isProcessing || isAutoSending}
              className={`question-input ${isAutoSending ? 'auto-sending' : ''}`}
            />
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isProcessing || isAutoSending}
              className={`mic-button ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Detener grabación' : 'Grabar voz'}
              aria-label={isListening ? 'Detener grabación' : 'Grabar voz'}
            >
              <MdMic size={20} />
            </button>
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="send-button"
              aria-label="Enviar pregunta"
            >
              <MdSend size={20} />
            </button>
          </div>
          
          <button
            type="button"
            onClick={onClearChat}
            className="clear-button"
            disabled={messages.length === 0}
            aria-label="Limpiar chat"
          >
            <MdClose size={20} />
            Limpiar chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 