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
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Función simplificada para scroll hacia arriba (donde están las flechas verdes)
  const scrollToTop = () => {
    if (messagesAreaRef.current) {
      console.log('🔄 scrollToTop() ejecutado');
      console.log('📍 scrollTop antes:', messagesAreaRef.current.scrollTop);
      
      // Con column-reverse, scroll hacia ARRIBA = visualmente hacia arriba (donde están las flechas verdes)
      messagesAreaRef.current.scrollTop = 0;
      
      console.log('📍 scrollTop después:', messagesAreaRef.current.scrollTop);
    }
  };

  // Función para prevenir scroll automático hacia abajo
  const preventAutoScrollDown = () => {
    if (messagesAreaRef.current) {
      console.log('🔄 preventAutoScrollDown() ejecutado');
      console.log('📍 scrollTop actual:', messagesAreaRef.current.scrollTop);
      
      // Si el scroll está muy abajo (cerca de las flechas rojas), forzarlo hacia arriba
      const currentScrollTop = messagesAreaRef.current.scrollTop;
      const scrollHeight = messagesAreaRef.current.scrollHeight;
      const clientHeight = messagesAreaRef.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Si está más del 80% hacia abajo, forzarlo hacia arriba
      if (currentScrollTop > maxScrollTop * 0.8) {
        console.log('🔄 Scroll muy abajo detectado, forzando hacia arriba');
        messagesAreaRef.current.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    // Scroll hacia arriba cuando llegan nuevos mensajes
    if (messages.length > 0) {
      console.log('🔄 useEffect - messages cambiaron');
      console.log('📊 messages.length:', messages.length);
      
      // Scroll hacia arriba y prevenir scroll hacia abajo
      scrollToTop();
      preventAutoScrollDown();
    }
  }, [messages]);

  // Efecto para scroll cuando comienza el procesamiento
  useEffect(() => {
    if (isProcessing) {
      console.log('🔄 useEffect - procesamiento comenzó');
      console.log('📊 isProcessing:', isProcessing);
      
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
      console.log('🔄 useEffect - mensajes cambiaron');
      console.log('📊 messages.length:', messages.length);
      
      // Scroll hacia arriba inmediatamente cuando se agrega un mensaje
      const scrollUp = () => {
        if (messagesAreaRef.current) {
          console.log('🔄 scrollUp() ejecutado');
          console.log('📍 scrollTop antes:', messagesAreaRef.current.scrollTop);
          
          messagesAreaRef.current.scrollTop = 0;
          console.log('📍 scrollTop después:', messagesAreaRef.current.scrollTop);
        }
      };
      
      // Ejecutar inmediatamente y después de pequeños delays
      scrollUp();
      setTimeout(scrollUp, 10);
      setTimeout(scrollUp, 50);
      setTimeout(scrollUp, 100);
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
        console.log('🔄 Event listener - scroll manual detectado');
        console.log('📍 scrollTop actual:', messagesArea.scrollTop);
        
        // Con column-reverse, solo forzar scroll hacia arriba cuando esté muy abajo
        const currentScrollTop = messagesArea.scrollTop;
        const scrollHeight = messagesArea.scrollHeight;
        const clientHeight = messagesArea.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        
        console.log('📊 scrollHeight:', scrollHeight);
        console.log('📊 clientHeight:', clientHeight);
        console.log('📊 maxScrollTop:', maxScrollTop);
        
        // Solo forzar scroll hacia arriba si está muy abajo (cerca de las flechas rojas)
        if (currentScrollTop > maxScrollTop * 0.9) {
          console.log('🔄 Event listener - scroll muy abajo detectado, forzando hacia arriba');
          messagesArea.scrollTop = 0;
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
      console.log('🔄 handleSubmit() ejecutado');
      console.log('📊 inputText:', inputText);
      console.log('📊 isProcessing:', isProcessing);
      
      // Scroll hacia arriba antes de enviar el mensaje
      scrollToTop();
      preventAutoScrollDown();
      
      onQuestionSubmit(inputText.trim());
      setInputText('');
      
      // Scroll hacia arriba después de enviar
      setTimeout(() => {
        console.log('🔄 handleSubmit() - timeout 10ms');
        scrollToTop();
        preventAutoScrollDown();
      }, 10);
      
      setTimeout(() => {
        console.log('🔄 handleSubmit() - timeout 50ms');
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

  const handleFaqQuestionClick = (question) => {
    onPredefinedQuestion(question);
  };

  return (
    <div className="chat-interface">
      {/* TOP SECTION - Input Area and Controls */}
      <div className="top-section">
        {/* Input Area */}
        <div className="input-area">
          {/* FAQ Section - Preguntas como botones individuales */}
          {predefinedQuestions && predefinedQuestions.length > 0 && (
            <div className="faq-section">
              <div className="faq-questions-grid">
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => handleFaqQuestionClick(question.question)}
                    disabled={isProcessing}
                    className="faq-question-button"
                  >
                    <div className="faq-question-content">
                      <span className="faq-number">{index + 1}</span>
                      <span className="faq-text">{question.text}</span>
                    </div>
                  </button>
                ))}
              </div>
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