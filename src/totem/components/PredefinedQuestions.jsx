import React from 'react';
import './PredefinedQuestions.css';

const PredefinedQuestions = ({ questions, onQuestionSelect, isLoading, disabled }) => {
  if (isLoading) {
    return (
      <div className="predefined-questions">
        <div className="questions-loading">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="predefined-questions">
        <div className="no-questions">
          <p>No hay preguntas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="predefined-questions">
      <div className="questions-scroll">
        {questions.map((question) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(question.question)}
            disabled={disabled}
            className="question-button"
            aria-label={question.text}
          >
            <div className="question-icon">
              {getQuestionIcon(question.id)}
            </div>
            <span className="question-text">{question.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const getQuestionIcon = (questionId) => {
  const icons = {
    'info': 'ℹ️',
    'effects': '⚠️',
    'dosage': '💊',
    'safety': '🛡️',
    'interactions': '⚗️'
  };
  
  return icons[questionId] || '❓';
};

export default PredefinedQuestions; 