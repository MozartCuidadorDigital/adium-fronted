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
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import TirzepatidaMenu from './TirzepatidaMenu';
import TirzepatidaStudiesMenu from './TirzepatidaStudiesMenu';
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
  const [canScrollLeftState, setCanScrollLeftState] = useState(false);
  const [canScrollRightState, setCanScrollRightState] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const faqScrollRef = useRef(null);

  // Función para scroll hacia arriba (donde están las flechas verdes)

  // Función para scroll horizontal de las preguntas frecuentes
  const scrollFaq = (direction) => {
    if (faqScrollRef.current) {
      const scrollAmount = 300; // Scroll de 300px por click
      const currentScroll = faqScrollRef.current.scrollLeft;
      const newScroll = direction === 'left'
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

      faqScrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // Función para verificar si se pueden mostrar las flechas
  const canScrollLeft = () => {
    if (faqScrollRef.current) {
      return faqScrollRef.current.scrollLeft > 0;
    }
    return false;
  };

  const canScrollRight = () => {
    if (faqScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = faqScrollRef.current;
      return scrollLeft < scrollWidth - clientWidth - 10; // 10px de margen
    }
    return false;
  };

  // Efecto para detectar cuando se puede mostrar las flechas
  useEffect(() => {
    const checkScrollButtons = () => {
      setCanScrollLeftState(canScrollLeft());
      setCanScrollRightState(canScrollRight());
    };

    if (faqScrollRef.current) {
      checkScrollButtons();
      faqScrollRef.current.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }

    return () => {
      if (faqScrollRef.current) {
        faqScrollRef.current.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [predefinedQuestions]);


  useEffect(() => {
    // Focus en el input cuando no está procesando
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = 0;
      console.log('🔝 Scroll forzado arriba');
    }
  }, [messages]);

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
      console.log('🔄 handleSubmit() ejecutado');
      console.log('📊 inputText:', inputText);
      console.log('📊 isProcessing:', isProcessing);

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

  const renderTextWithLineBreaks = (text) => {
    if (!text) return '';

    // Primero dividir por saltos de línea normales
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Para cada línea, dividir por puntos bullet (•)
      const bulletParts = line.split('•');
      
      // Si hay puntos bullet en esta línea
      if (line.includes('•') && bulletParts.length > 1) {
        return (
          <React.Fragment key={lineIndex}>
            {bulletParts.map((bulletText, bulletIndex) => {
              const trimmedText = bulletText.trim();
              if (!trimmedText) return null;
              
              return (
                <React.Fragment key={`${lineIndex}-${bulletIndex}`}>
                  {bulletIndex === 0 ? (
                    // Primera parte (antes del primer bullet)
                    <span>{renderMarkdown(trimmedText)}</span>
                  ) : (
                    // Partes con bullet
                    <>
                      <br />
                      <span className="bullet-point">• {renderMarkdown(trimmedText)}</span>
                    </>
                  )}
                </React.Fragment>
              );
            })}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      
      // Si no hay bullets, renderizar normalmente
      return (
        <React.Fragment key={lineIndex}>
          {renderMarkdown(line)}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
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

  const handleFaqQuestionClick = (questionData) => {
    onPredefinedQuestion(questionData);
  };

  return (
    <div className="chat-interface">
      {/* TOP SECTION - Input Area and Controls */}
      <div className="top-section">
        {/* Input Area */}
        <div className="input-area">
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

        {/* FAQ Section - Preguntas como botones individuales */}
        {predefinedQuestions && predefinedQuestions.length > 0 && (
          <div className="faq-section">
            <div className="faq-questions-grid" ref={faqScrollRef}>
              {predefinedQuestions.map((question, index) => {
                // Si es la pregunta de tirzepatida, mostrar ambos menús juntos
                if (question.id === 'sobre-tirzepatida') {
                  return (
                    <React.Fragment key={question.id}>
                      <TirzepatidaMenu
                        onQuestionSelect={handleFaqQuestionClick}
                        isProcessing={isProcessing}
                      />
                      <TirzepatidaStudiesMenu
                        onQuestionSelect={handleFaqQuestionClick}
                        isProcessing={isProcessing}
                      />
                    </React.Fragment>
                  );
                }
                
                // Para las demás preguntas, mostrar botón normal
                return (
                  <button
                    key={question.id}
                    onClick={() => handleFaqQuestionClick(question.question)}
                    disabled={isProcessing}
                    className="faq-question-button"
                  >
                    <div className="faq-question-content">
                      <span className="faq-text">{question.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {canScrollLeftState && (
              <button
                className="faq-nav-button left-faq-nav"
                onClick={() => scrollFaq('left')}
                aria-label="Ir a la izquierda"
                title="Ir a la izquierda"
              >
                <MdChevronLeft size={24} />
              </button>
            )}
            {canScrollRightState && (
              <button
                className="faq-nav-button right-faq-nav"
                onClick={() => scrollFaq('right')}
                aria-label="Ir a la derecha"
                title="Ir a la derecha"
              >
                <MdChevronRight size={24} />
              </button>
            )}
          </div>
        )}
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
        {[...messages].reverse().map((message, index) => (
          <div
            key={message.id}
            className={`message ${message.type}`}
          >
            <div className="message-content">
              {/* Mostrar texto primero */}
              <div className="message-text">
                {renderTextWithLineBreaks(message.text)}
              </div>
              {/* Mostrar imagen después del texto */}
              {message.image && (
                <div className="message-image">
                  <img 
                    src={message.image} 
                    alt="Imagen de la respuesta" 
                    className="response-image"
                  />
                </div>
              )}
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