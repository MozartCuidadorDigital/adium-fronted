import React, { useState, useRef, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import './TirzepatidaMenu.css';

const TirzepatidaMenu = ({ onQuestionSelect, isProcessing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cerrar menú al hacer clic fuera en móvil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && isMobile && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Preguntas hardcodeadas en el frontend
  const tirzepatidaQuestions = [
    {
      id: 'que-es-tirzepatida',
      text: '¿Qué es tirzepatida?',
      question: '¿Qué es tirzepatida?'
    },
    {
      id: 'mecanismo-accion-tirzepatida',
      text: '¿Cuál es el mecanismo de acción de tirzepatida y por qué se considera "dual"?',
      question: '¿Cuál es el mecanismo de acción de tirzepatida y por qué se considera "dual"?'
    },
    {
      id: 'papel-fisiologico-gip',
      text: '¿Qué papel fisiológico tiene GIP y cómo se complementa con GLP-1?',
      question: '¿Qué papel fisiológico tiene GIP y cómo se complementa con GLP-1?'
    },
    {
      id: 'monoterapia-dm2-surpass1',
      text: 'En monoterapia (pacientes con DM2 naïve a inyectables), ¿qué eficacia mostró tirzepatida? (SURPASS-1)',
      question: 'En monoterapia (pacientes con DM2 naïve a inyectables), ¿qué eficacia mostró tirzepatida? (SURPASS-1)'
    },
    {
      id: 'comparacion-semaglutida-surpass2',
      text: '¿Cómo se comparó con semaglutida 1 mg en DM2 con metformina? (SURPASS-2)',
      question: '¿Cómo se comparó con semaglutida 1 mg en DM2 con metformina? (SURPASS-2)'
    },
    {
      id: 'vs-insulina-degludec-surpass3',
      text: '¿Frente a insulina basal degludec como intensificación inyectable inicial, qué mostró? (SURPASS-3)',
      question: '¿Frente a insulina basal degludec como intensificación inyectable inicial, qué mostró? (SURPASS-3)'
    },
    {
      id: 'alto-riesgo-cv-surpass4',
      text: '¿En pacientes con alto riesgo CV, cómo se comparó con glargina e ¿hubo señal cardiovascular? (SURPASS-4)',
      question: '¿En pacientes con alto riesgo CV, cómo se comparó con glargina e ¿hubo señal cardiovascular? (SURPASS-4)'
    },
    {
      id: 'anadir-glargina-surpass5',
      text: '¿Qué aporta añadir tirzepatida a insulina glargina frente a placebo? (SURPASS-5)',
      question: '¿Qué aporta añadir tirzepatida a insulina glargina frente a placebo? (SURPASS-5)'
    },
    {
      id: 'vs-lispro-surpass6',
      text: 'Como alternativa a añadir prandial (bolo) a basal, ¿cómo rinde frente a lispro? (SURPASS-6)',
      question: 'Como alternativa a añadir prandial (bolo) a basal, ¿cómo rinde frente a lispro? (SURPASS-6)'
    },
    {
      id: 'obesidad-sin-diabetes-surmount',
      text: 'En obesidad sin diabetes, ¿qué magnitud de pérdida de peso logra y cómo se compara con semaglutida 2.4 mg? (SURMOUNT-1 y SURMOUNT-5)',
      question: 'En obesidad sin diabetes, ¿qué magnitud de pérdida de peso logra y cómo se compara con semaglutida 2.4 mg? (SURMOUNT-1 y SURMOUNT-5)'
    },
    {
      id: 'evidencia-obesidad-apnea-surmount',
      text: '¿Qué evidencia existe en obesidad con diabetes, en apnea obstructiva del sueño y tras intervención intensiva en estilo de vida?',
      question: '¿Qué evidencia existe en obesidad con diabetes, en apnea obstructiva del sueño y tras intervención intensiva en estilo de vida?'
    }
  ];

  const handleToggle = () => {
    console.log('🔄 TirzepatidaMenu: Toggle clicked, current state:', isOpen);
    
    if (!isOpen && menuRef.current && !isMobile) {
      // Solo calcular posición en desktop
      const rect = menuRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
    
    setIsOpen(!isOpen);
  };

  const handleQuestionClick = (question) => {
    console.log('🎯 TirzepatidaMenu: Question selected:', question);
    onQuestionSelect(question);
    setIsOpen(false);
  };

  return (
    <>
      <div className="tirzepatida-menu" ref={menuRef}>
        <button
          className="tirzepatida-menu-trigger"
          onClick={handleToggle}
          disabled={isProcessing}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>Sobre Tirzepatida</span>
          {isOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
        </button>
      </div>
      
      {isOpen && (
        <div 
          className="tirzepatida-menu-dropdown"
          style={!isMobile ? {
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          } : {}}
        >
          <div className="tirzepatida-menu-header">
            <h3>Preguntas sobre Tirzepatida</h3>
            <p>Selecciona una pregunta para obtener información detallada:</p>
          </div>
          
          <div className="tirzepatida-questions-list">
            {tirzepatidaQuestions.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuestionClick(question.question)}
                disabled={isProcessing}
                className="tirzepatida-question-item"
                title={question.text}
              >
                <div className="question-icon">❓</div>
                <div className="question-content">
                  <span className="question-text">{question.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TirzepatidaMenu;
