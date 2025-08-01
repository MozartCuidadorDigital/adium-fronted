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
  MdReplay,
  MdExpandMore,
  MdExpandLess,
  MdQuestionAnswer
} from 'react-icons/md';
import './ChatInterface.css';

const ChatInterface = ({ 
  messages, 
  // Quitar props de streaming que ya no se necesitan
  // streamingText, 
  // isStreaming, 
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
  const [showFaq, setShowFaq] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Función corregida para scroll hacia los mensajes más recientes (donde están las flechas verdes)
  const scrollToTop = () => {
    if (messagesAreaRef.current) {
      // Con column-reverse, scroll hacia ABAJO = visualmente hacia los mensajes más recientes
      const scrollHeight = messagesAreaRef.current.scrollHeight;
      const clientHeight = messagesAreaRef.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Scroll hacia abajo para ver los mensajes más recientes
      messagesAreaRef.current.scrollTop = maxScrollTop;
    }
  };

  // Función para prevenir scroll automático hacia los mensajes antiguos
  const preventAutoScrollDown = () => {
    if (messagesAreaRef.current) {
      // Si el scroll está muy arriba (cerca de los mensajes antiguos), forzarlo hacia abajo
      const currentScrollTop = messagesAreaRef.current.scrollTop;
      const scrollHeight = messagesAreaRef.current.scrollHeight;
      const clientHeight = messagesAreaRef.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Si está menos del 20% hacia abajo, forzarlo hacia los mensajes más recientes
      if (currentScrollTop < maxScrollTop * 0.2) {
        messagesAreaRef.current.scrollTop = maxScrollTop;
      }
    }
  };

  useEffect(() => {
    // Scroll hacia arriba cuando llegan nuevos mensajes
    if (messages.length > 0) {
      // Scroll hacia arriba y prevenir scroll hacia abajo
      scrollToTop();
      preventAutoScrollDown();
    }
  }, [messages]);

  // Efecto para scroll cuando comienza el procesamiento
  useEffect(() => {
    if (isProcessing) {
      // Scroll hacia arriba y prevenir scroll hacia abajo
      scrollToTop();
      preventAutoScrollDown();
    }
  }, [isProcessing]);

  useEffect(() => {
    // Focus en el input cuando no está procesando
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  // Efecto para prevenir scroll automático cuando se envían mensajes
  useEffect(() => {
    if (messages.length > 0) {
      // Scroll hacia los mensajes más recientes inmediatamente cuando se agrega un mensaje
      const scrollToRecent = () => {
        if (messagesAreaRef.current) {
          const scrollHeight = messagesAreaRef.current.scrollHeight;
          const clientHeight = messagesAreaRef.current.clientHeight;
          const maxScrollTop = scrollHeight - clientHeight;
          
          messagesAreaRef.current.scrollTop = maxScrollTop;
        }
      };
      
      // Ejecutar inmediatamente y después de pequeños delays
      scrollToRecent();
      setTimeout(scrollToRecent, 10);
      setTimeout(scrollToRecent, 50);
      setTimeout(scrollToRecent, 100);
    }
  }, [messages.length]);

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

  // Efecto para manejar scroll manual del usuario
  useEffect(() => {
    const messagesArea = messagesAreaRef.current;
    
    if (messagesArea) {
      const handleScroll = () => {
        // Con column-reverse, solo forzar scroll hacia abajo cuando esté muy arriba
        const currentScrollTop = messagesArea.scrollTop;
        const scrollHeight = messagesArea.scrollHeight;
        const clientHeight = messagesArea.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        
        // Solo forzar scroll hacia abajo si está muy arriba (cerca de los mensajes antiguos)
        if (currentScrollTop < maxScrollTop * 0.1) {
          messagesArea.scrollTop = maxScrollTop;
        }
      };
      
      // Agregar event listener para scroll
      messagesArea.addEventListener('scroll', handleScroll);
      
      return () => {
        messagesArea.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      // Scroll hacia arriba antes de enviar el mensaje
      scrollToTop();
      preventAutoScrollDown();
      
      onQuestionSubmit(inputText.trim());
      setInputText('');
      
      // Scroll hacia arriba después de enviar
      setTimeout(() => {
        scrollToTop();
        preventAutoScrollDown();
      }, 10);
      
      setTimeout(() => {
        scrollToTop();
        preventAutoScrollDown();
      }, 50);
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

  const renderTextWithLineBreaks = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {renderMarkdown(line)}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Convertir **texto** a <strong>texto</strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Es texto en negrilla
        const boldText = part.slice(2, -2); // Remover **
        return <strong key={index}>{boldText}</strong>;
      }
      return part;
    });
  };

  const handleReplayClick = (audioUrl) => {
    if (audioUrl) {
      onReplayAudio(audioUrl);
    }
  };

  const handleFaqToggle = () => {
    setShowFaq(!showFaq);
  };

  const handleFaqQuestionClick = (question) => {
    onPredefinedQuestion(question);
    setShowFaq(false); // Cerrar el FAQ después de seleccionar
  };

  return (
    <div className="chat-interface">
      {/* TOP SECTION - Input Area and Controls */}
      <div className="top-section">
        {/* Input Area */}
        <div className="input-area">
          {/* FAQ Button */}
          {predefinedQuestions && predefinedQuestions.length > 0 && (
            <div className="faq-section">
              <button
                onClick={handleFaqToggle}
                disabled={isProcessing}
                className="faq-toggle-button"
                title="Preguntas Frecuentes"
              >
                <MdQuestionAnswer size={20} />
                <span>Preguntas Frecuentes</span>
                {showFaq ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
              </button>
              
              {/* FAQ Dropdown */}
              {showFaq && (
                <div className="faq-dropdown">
                  <div className="faq-header">
                    <h4>Preguntas Frecuentes sobre Mounjaro</h4>
                    <p>Selecciona una pregunta para obtener información detallada</p>
                  </div>
                  <div className="faq-questions">
                    {predefinedQuestions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => handleFaqQuestionClick(question.question)}
                        disabled={isProcessing}
                        className="faq-question-item"
                      >
                        <span className="faq-number">{index + 1}</span>
                        <span className="faq-text">{question.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              
              {/* Commented Mic Button */}
              {/*
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
              */}
              
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="send-button"
                aria-label="Enviar pregunta"
              >
                <MdSend size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Messages Area - REVERSE CHAT */}
      <div className="messages-area reverse-chat" ref={messagesAreaRef}>
        {/* Welcome Message - Al final */}
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">
              <MdChat size={48} />
            </div>
            <h3>Información sobre Mounjaro</h3>
            <p>Pregunte cualquier cosa necesaria sobre Mounjaro.</p>
          </div>
        )}
        
        {/* Messages in normal order but with reverse layout */}
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.type}`}
          >
            <div className="message-content">
              <div className="message-text">
                {renderTextWithLineBreaks(message.text)}
              </div>
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
        
        {isProcessing && (
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
      </div>
    </div>
  );
};

export default ChatInterface; 