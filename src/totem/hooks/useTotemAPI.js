import { useState, useCallback } from 'react';

const API_BASE_URL = '/api/totem';

export const useTotemAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [error, setError] = useState(null);

  const sendQuestion = useCallback(async (question) => {
    console.log('🔧 Hook: Iniciando sendQuestion');
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔧 Hook: Haciendo fetch a:', `${API_BASE_URL}/question`);
      const response = await fetch(`${API_BASE_URL}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          filter: "modulo eq 'mounjaro'"
        }),
      });

      console.log('🔧 Hook: Response status:', response.status);
      console.log('🔧 Hook: Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔧 Hook: Data recibida:', data);
      
      if (data.success) {
        console.log('🔧 Hook: Respuesta exitosa, retornando datos');
        return {
          success: true,
          text: data.text,
          audioUrl: data.audioUrl,
          searchResults: data.searchResults,
          usage: data.usage,
          warning: data.warning
        };
      } else {
        console.log('🔧 Hook: Respuesta fallida, retornando error');
        return {
          success: false,
          error: data.error || 'Error desconocido',
          text: data.text || 'No se pudo procesar la pregunta'
        };
      }
    } catch (error) {
      console.error('🔧 Hook: Error en sendQuestion:', error);
      setError(error.message);
      return {
        success: false,
        error: 'Error de conexión. Por favor, verifica tu conexión e intenta de nuevo.',
        text: 'No se pudo conectar con el servidor'
      };
    } finally {
      console.log('🔧 Hook: Finalizando sendQuestion');
      setIsLoading(false);
    }
  }, []);

  const getPredefinedQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPredefinedQuestions(data.questions || []);
      } else {
        console.error('Error getting predefined questions:', data.error);
        setError(data.error || 'Error al cargar las preguntas');
      }
    } catch (error) {
      console.error('Error getting predefined questions:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const healthCheck = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in health check:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, []);

  const testConnection = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in test connection:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, []);

  return {
    sendQuestion,
    getPredefinedQuestions,
    healthCheck,
    testConnection,
    predefinedQuestions,
    isLoading,
    error
  };
}; 