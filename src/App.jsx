import React, { useState, useEffect } from 'react';
import MicCapture from './components/MicCapture.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import { useWebSocket } from './utils/wsClient.js';

function App() {
  const [status, setStatus] = useState('ready');
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [lastProcessedTranscription, setLastProcessedTranscription] = useState('');

  const { 
    connect, 
    disconnect, 
    sendMessage, 
    connectionStatus,
    lastMessage 
  } = useWebSocket();

  useEffect(() => {
    // Connect to WebSocket when component mounts
    connect();
  }, []);

  useEffect(() => {
    setIsConnected(connectionStatus === 'connected');
  }, [connectionStatus]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'call_started':
        setIsCallActive(true);
        setStatus('call_active');
        setError('');
        break;
        
      case 'call_stopped':
        setIsCallActive(false);
        setStatus('ready');
        break;
        
      case 'transcription':
        setTranscription(message.text);
        if (message.isFinal && message.text.trim()) {
          // Evitar duplicar la misma transcripción
          const trimmedText = message.text.trim();
          if (trimmedText !== lastProcessedTranscription) {
            console.log('📝 Agregando nueva transcripción al historial:', trimmedText);
            setLastProcessedTranscription(trimmedText);
            // Add to conversation history
            setConversationHistory(prev => [...prev, {
              role: 'user',
              content: trimmedText,
              timestamp: message.timestamp || Date.now()
            }]);
          } else {
            console.log('⚠️ Transcripción duplicada ignorada:', trimmedText);
          }
        }
        break;
        
      case 'ai_response':
        setAiResponse(message.text);
        setStatus('speaking');
        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          role: 'assistant',
          content: message.text,
          timestamp: message.timestamp
        }]);
        break;
        
      case 'status':
        setStatus(message.status);
        break;
        
      case 'audio_level':
        setAudioLevel(message.level);
        break;
        
      case 'error':
        setError(message.message);
        setStatus('error');
        break;
        
      case 'conversation_reset':
        setConversationHistory([]);
        setTranscription('');
        setAiResponse('');
        setError('');
        break;
    }
  };

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    setError('');
  };

  const handleTranscription = (text, isFinal) => {
    setTranscription(text);
    if (isFinal && text.trim()) {
      setStatus('processing');
    }
  };

  const handleAIResponse = (response) => {
    setAiResponse(response);
    setStatus('speaking');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setStatus('ready');
  };

  const handleStartCall = () => {
    sendMessage({ type: 'start_call' });
    setTranscription('');
    setAiResponse('');
    setError('');
    setConversationHistory([]);
    setLastProcessedTranscription('');
  };

  const handleStopCall = () => {
    sendMessage({ type: 'stop_call' });
    setStatus('ready');
    setIsCallActive(false);
  };

  const handleResetConversation = () => {
    sendMessage({ type: 'reset_conversation' });
    setTranscription('');
    setAiResponse('');
    setError('');
    setConversationHistory([]);
    setLastProcessedTranscription('');
  };

  const getStatusText = () => {
    switch (status) {
      case 'ready':
        return 'Listo para iniciar llamada';
      case 'call_active':
        return 'Llamada activa - Habla ahora';
      case 'processing':
        return 'Procesando...';
      case 'speaking':
        return 'Asistente hablando...';
      case 'error':
        return 'Error';
      default:
        return 'Listo';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return '#10b981'; // green
      case 'call_active':
        return '#3b82f6'; // blue
      case 'processing':
        return '#f59e0b'; // yellow
      case 'speaking':
        return '#8b5cf6'; // purple
      case 'error':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="voice-assistant">
      <div className={`connection-status ${connectionStatus}`}>
        {getConnectionStatusText()}
      </div>

      <div className="voice-container">
        <h1>📞 Asistente de Voz - Llamada Continua</h1>
        
        <div className="status-indicator">
          <div 
            className="status-dot" 
            style={{ backgroundColor: getStatusColor() }}
          ></div>
          <span>{getStatusText()}</span>
        </div>

        {/* Audio Level Indicator */}
        {isCallActive && (
          <div className="audio-level-indicator">
            <div 
              className="audio-level-bar"
              style={{ 
                width: `${audioLevel * 100}%`,
                backgroundColor: getStatusColor()
              }}
            ></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <MicCapture
          isConnected={isConnected}
          isCallActive={isCallActive}
          status={status}
          onStatusUpdate={handleStatusUpdate}
          onTranscription={handleTranscription}
          onError={handleError}
          sendMessage={sendMessage}
        />

        {/* Current Transcription */}
        <div className="transcription-display">
          {transcription || 'Tu voz aparecerá aquí...'}
        </div>

        {/* Current AI Response */}
        {aiResponse && (
          <div className="ai-response-display">
            <strong>Asistente:</strong> {aiResponse}
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="conversation-history">
            <h3>Historial de Conversación</h3>
            <div className="history-container">
              {conversationHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`history-message ${message.role}`}
                >
                  <strong>{message.role === 'user' ? 'Tú:' : 'Asistente:'}</strong> {message.content}
                </div>
              ))}
            </div>
          </div>
        )}

        <AudioPlayer
          isConnected={isConnected}
          onStatusUpdate={handleStatusUpdate}
          onError={handleError}
        />

        <div className="controls">
          <button 
            className={`control-button ${isCallActive ? 'stop' : 'start'}`}
            onClick={isCallActive ? handleStopCall : handleStartCall}
            disabled={!isConnected}
          >
            {isCallActive ? '🛑 Detener Llamada' : '📞 Iniciar Llamada'}
          </button>
          
          <button 
            className="control-button reset"
            onClick={handleResetConversation}
            disabled={!isConnected}
          >
            🔄 Reiniciar Conversación
          </button>
        </div>

        {!isConnected && (
          <div className="connection-warning">
            No conectado al servidor. Verifica que el backend esté ejecutándose.
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 