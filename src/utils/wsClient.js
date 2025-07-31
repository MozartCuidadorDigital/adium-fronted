import { useState, useEffect, useRef, useCallback } from 'react';

// WebSocket connection state
let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

// Message listeners
const messageListeners = new Set();

export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = '3001'; // Backend port
      const wsUrl = `${protocol}//${host}:${port}`;

      console.log('🔌 Conectando a WebSocket:', wsUrl);
      ws = new WebSocket(wsUrl);
      setConnectionStatus('connecting');

      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        setConnectionStatus('connected');
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Mensaje recibido:', message.type);
          
          // Update last message for React state
          setLastMessage(message);
          
          // Notify all message listeners
          messageListeners.forEach(listener => {
            try {
              listener(message);
            } catch (error) {
              console.error('❌ Error en message listener:', error);
            }
          });
        } catch (error) {
          console.error('❌ Error parseando mensaje WebSocket:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket cerrado:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1);
          
          console.log(`🔄 Reintentando conexión (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) en ${delay}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Error de WebSocket:', error);
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.error('❌ Error creando conexión WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (ws) {
      console.log('🔌 Desconectando WebSocket...');
      ws.close(1000, 'User disconnected');
      ws = null;
    }
    
    setConnectionStatus('disconnected');
    reconnectAttempts = 0;
  }, []);

  const sendMessage = useCallback((message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        console.log('📤 Enviando mensaje:', message.type);
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('❌ Error enviando mensaje WebSocket:', error);
      }
    } else {
      console.warn('⚠️ WebSocket no está abierto, no se puede enviar mensaje');
    }
  }, []);

  const addMessageListener = useCallback((listener) => {
    messageListeners.add(listener);
  }, []);

  const removeMessageListener = useCallback((listener) => {
    messageListeners.delete(listener);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    addMessageListener,
    removeMessageListener,
    connectionStatus,
    lastMessage
  };
};

// Utility functions for WebSocket management
export const getWebSocketStatus = () => {
  if (!ws) return 'disconnected';
  
  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return 'connecting';
    case WebSocket.OPEN:
      return 'connected';
    case WebSocket.CLOSING:
      return 'closing';
    case WebSocket.CLOSED:
      return 'disconnected';
    default:
      return 'unknown';
  }
};

export const isWebSocketConnected = () => {
  return ws && ws.readyState === WebSocket.OPEN;
};

export const sendPing = () => {
  if (isWebSocketConnected()) {
    ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
  }
};

export const createHeartbeat = (interval = 30000) => {
  let heartbeatInterval = null;
  
  const start = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    
    heartbeatInterval = setInterval(() => {
      if (isWebSocketConnected()) {
        sendPing();
      }
    }, interval);
  };
  
  const stop = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };
  
  return { start, stop };
}; 