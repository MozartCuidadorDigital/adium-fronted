import { useCallback } from 'react';

export const useAudioUtils = () => {
  /**
   * Convert audio blob to PCM raw format for streaming
   * @param {Blob} audioBlob - Audio blob to convert
   * @returns {Promise<string|null>} - Base64 PCM string or null if conversion fails
   */
  const convertToWav = useCallback(async (audioBlob) => {
    try {
      // For streaming, we'll use PCM raw instead of WAV
      // This avoids the need for WAV headers in small chunks
      
      // Convert blob to base64 string for sending to backend
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to base64 string
      let binary = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);
      
      return base64;
    } catch (error) {
      console.error('Error converting audio to PCM:', error);
      return null;
    }
  }, []);

  /**
   * Create audio buffer from blob
   * @param {Blob} audioBlob - Audio blob
   * @returns {Promise<AudioBuffer|null>} - Audio buffer or null if creation fails
   */
  const createAudioBuffer = useCallback(async (audioBlob) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.error('Error creating audio buffer:', error);
      return null;
    }
  }, []);

  /**
   * Convert audio buffer to WAV format (browser-compatible)
   * @param {AudioBuffer} audioBuffer - Audio buffer to convert
   * @returns {string} - Base64 encoded WAV data
   */
  const audioBufferToWav = useCallback((audioBuffer) => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    
    // Create WAV header
    const buffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numChannels * 2, true);
    
    // Write audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    // Convert to base64
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }, []);

  /**
   * Convert audio buffer to base64
   * @param {AudioBuffer} audioBuffer - Audio buffer to convert
   * @returns {string} - Base64 encoded audio
   */
  const audioBufferToBase64 = useCallback((audioBuffer) => {
    return audioBufferToWav(audioBuffer);
  }, [audioBufferToWav]);

  /**
   * Create audio context
   * @returns {AudioContext} - Audio context
   */
  const createAudioContext = useCallback(() => {
    return new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  /**
   * Get audio level from audio buffer
   * @param {AudioBuffer} audioBuffer - Audio buffer
   * @returns {number} - Audio level (0-1)
   */
  const getAudioLevel = useCallback((audioBuffer) => {
    const channelData = audioBuffer.getChannelData(0);
    let sum = 0;
    
    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] * channelData[i];
    }
    
    const rms = Math.sqrt(sum / channelData.length);
    return rms;
  }, []);

  /**
   * Normalize audio buffer
   * @param {AudioBuffer} audioBuffer - Audio buffer to normalize
   * @returns {AudioBuffer} - Normalized audio buffer
   */
  const normalizeAudioBuffer = useCallback((audioBuffer) => {
    const audioContext = createAudioContext();
    const normalizedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = normalizedBuffer.getChannelData(channel);
      
      // Find the maximum absolute value
      let maxValue = 0;
      for (let i = 0; i < inputData.length; i++) {
        maxValue = Math.max(maxValue, Math.abs(inputData[i]));
      }
      
      // Normalize if maxValue > 0
      if (maxValue > 0) {
        const scale = 0.95 / maxValue; // Leave some headroom
        for (let i = 0; i < inputData.length; i++) {
          outputData[i] = inputData[i] * scale;
        }
      } else {
        // Copy data as-is if all zeros
        for (let i = 0; i < inputData.length; i++) {
          outputData[i] = inputData[i];
        }
      }
    }
    
    return normalizedBuffer;
  }, [createAudioContext]);

  /**
   * Resample audio buffer to target sample rate
   * @param {AudioBuffer} audioBuffer - Audio buffer to resample
   * @param {number} targetSampleRate - Target sample rate
   * @returns {AudioBuffer} - Resampled audio buffer
   */
  const resampleAudioBuffer = useCallback((audioBuffer, targetSampleRate) => {
    const audioContext = createAudioContext();
    const resampledBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      Math.round(audioBuffer.length * targetSampleRate / audioBuffer.sampleRate),
      targetSampleRate
    );
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = resampledBuffer.getChannelData(channel);
      
      const ratio = audioBuffer.sampleRate / targetSampleRate;
      
      for (let i = 0; i < outputData.length; i++) {
        const inputIndex = i * ratio;
        const inputIndexFloor = Math.floor(inputIndex);
        const inputIndexCeil = Math.min(inputIndexFloor + 1, inputData.length - 1);
        const fraction = inputIndex - inputIndexFloor;
        
        outputData[i] = inputData[inputIndexFloor] * (1 - fraction) + 
                       inputData[inputIndexCeil] * fraction;
      }
    }
    
    return resampledBuffer;
  }, [createAudioContext]);

  return {
    convertToWav,
    createAudioBuffer,
    audioBufferToWav,
    audioBufferToBase64,
    createAudioContext,
    getAudioLevel,
    normalizeAudioBuffer,
    resampleAudioBuffer
  };
}; 