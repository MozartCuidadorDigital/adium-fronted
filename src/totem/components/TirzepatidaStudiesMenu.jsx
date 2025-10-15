import React, { useState, useRef, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import './TirzepatidaMenu.css';

const TirzepatidaStudiesMenu = ({ onQuestionSelect, isProcessing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isScrollingRef = useRef(false);

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
        // Solo cerrar si no es un evento de scroll
        if (event.type === 'mousedown' || (event.type === 'touchstart' && !event.target.closest('.tirzepatida-questions-list'))) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      // Solo usar touchstart para clicks fuera del área de scroll
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Las 22 nuevas preguntas sobre estudios SURPASS y SURMOUNT
  const tirzepatidaStudiesQuestions = [
    {
      id: 'surpass1-hba1c-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás uno?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás uno?',
      image: '/Pregunta1.png',
      audioUrl: '', // Se agregará el base64 del audio
      answer: 'El estudio Surpás uno demostró que Tirzepatida de cinco miligramos, diez miligramos y quince miligramos fue significativamente superior en el cambio de Hemoglobina glicosilada desde el inicio hasta las cuarenta semanas, mostrando resultados en reducción de HbA1c de menos uno punto setenta y cinco por ciento, menos uno punto setenta y uno por ciento y menos uno punto sesenta y nueve por ciento respectivamente, versus menos cero punto cero nueve por ciento con placebo.'
    },
    {
      id: 'surpass1-hba1c-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás uno?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás uno?',
      image: '/Pregunta2.png',
      audioUrl: '',
      answer: 'El estudio Surpás uno demostró reducciones significativas de Hemoglobina glicosilada a las cuarenta semanas en el grupo con Tirzepatida versus placebo. El ochenta y siete a noventa y dos por ciento de los participantes que utilizaron Tirzepatida lograron una HbA1c menor o igual a siete punto cero por ciento. El ochenta y uno a ochenta y seis por ciento lograron una HbA1c menor o igual a seis punto cinco por ciento, y entre treinta y uno y cincuenta y dos por ciento alcanzaron una HbA1c menor a cinco punto siete por ciento, considerada normoglucemia.'
    },
    {
      id: 'surpass2-hba1c-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás dos?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás dos?',
      image: '/Pregunta3.png',
      audioUrl: '',
      answer: 'El estudio Surpás dos demostró que Tirzepatida de cinco, diez y quince miligramos una vez a la semana fue significativamente superior a Semaglutida de un miligramo en el cambio medio de HbA1c desde el inicio hasta la semana cuarenta, alcanzando valores de menos dos punto cero uno, menos dos punto veinticuatro y menos dos punto treinta con Tirzepatida, y menos uno punto ochenta y seis con Semaglutida.'
    },
    {
      id: 'surpass2-hba1c-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás dos?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás dos?',
      image: '/Pregunta4.png',
      audioUrl: '',
      answer: 'El estudio Surpás dos demostró que con Tirzepatida de cinco, diez y quince miligramos una vez a la semana un mayor número de pacientes alcanzaron metas de HbA1c menor o igual a siete, seis punto cinco y cinco punto cuatro por ciento comparado con Semaglutida. Entre el ochenta y dos y ochenta y seis por ciento de los participantes con Tirzepatida alcanzaron metas menores o iguales a siete por ciento, el setenta y siete a ochenta por ciento menores o iguales a seis punto cinco, y el cuarenta y seis por ciento alcanzaron normoglicemia con Tirzepatida versus diecinueve por ciento con Semaglutida.'
    },
    {
      id: 'surpass3-hba1c-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás tres?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás tres?',
      image: '/Pregunta5.png',
      audioUrl: '',
      answer: 'El estudio Surpás tres demostró superioridad significativa en el control glicémico con Tirzepatida de cinco, diez y quince miligramos en pacientes tratados con metformina y o S-G-L-T dos, con reducciones de menos uno punto noventa y tres, menos dos punto veinte y menos dos punto treinta y siete por ciento respectivamente, versus menos uno punto treinta y cuatro por ciento con insulina degludec, evaluadas a las cincuenta y dos semanas del estudio.'
    },
    {
      id: 'surpass3-hba1c-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás tres?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás tres?',
      image: '/Pregunta6.png',
      audioUrl: '',
      answer: 'El estudio Surpás tres demostró que el ochenta y dos a noventa y tres por ciento de los participantes con Tirzepatida lograron una HbA1c menor a siete por ciento, el setenta y uno a ochenta y cinco por ciento menor o igual a seis punto cinco, y el veintiséis a cuarenta y ocho por ciento menor a cinco punto siete por ciento.'
    },
    {
      id: 'surpass4-hba1c-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás cuatro?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás cuatro?',
      image: '/Pregunta7.png',
      audioUrl: '',
      answer: 'El estudio Surpás cuatro demostró que Tirzepatida de cinco, diez y quince miligramos una vez a la semana fue significativamente superior a Insulina Glargina en el cambio medio de HbA1c desde el basal a la semana cincuenta y dos, alcanzando valores de menos dos punto veinticuatro, menos dos punto cuarenta y tres y menos dos punto cincuenta y ocho con Tirzepatida, y menos uno punto cuarenta y cuatro con Insulina Glargina.'
    },
    {
      id: 'surpass4-hba1c-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás cuatro?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás cuatro?',
      image: '/Pregunta8.png',
      audioUrl: '',
      answer: 'El estudio Surpás cuatro demostró que con Tirzepatida cinco, diez y quince miligramos una vez a la semana un mayor número de pacientes alcanzaron metas de HbA1c de menor o igual a siete, seis punto cinco y cinco punto cuatro por ciento comparado con Insulina Glargina. Entre el ochenta y uno y noventa y un por ciento de los participantes con Tirzepatida alcanzaron metas menores o iguales a siete por ciento, el setenta y seis a ochenta y uno por ciento menores o iguales a seis punto cinco, y el cuarenta y tres por ciento alcanzaron normoglicemia versus tres por ciento con Insulina Glargina.'
    },
    {
      id: 'surpass5-hba1c-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás cinco?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c en pacientes con Diabetes Tipo Dos según el estudio Surpás cinco?',
      image: '/Pregunta9.png',
      audioUrl: '',
      answer: 'El estudio Surpás cinco demostró superioridad en el control glicémico con Tirzepatida de cinco, diez y quince miligramos en pacientes tratados con insulina glargina con o sin metformina, con reducciones de menos dos punto once, menos dos punto cuarenta y menos dos punto treinta y cuatro por ciento respectivamente, versus menos cero punto ochenta y seis con placebo, evaluadas a las cuarenta semanas.'
    },
    {
      id: 'surpass5-hba1c-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás cinco?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás cinco?',
      image: '/Pregunta10.png',
      audioUrl: '',
      answer: 'El estudio Surpás cinco mostró que el ochenta y cinco a noventa por ciento de los participantes con Tirzepatida lograron una HbA1c menor a siete por ciento, el setenta y cuatro a ochenta y seis por ciento menor o igual a seis punto cinco, y el veinticuatro a cincuenta por ciento menor a cinco punto siete por ciento, considerada normoglucemia.'
    },
    {
      id: 'surpass6-hba1c-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c según el estudio Surpás seis?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de HbA1c según el estudio Surpás seis?',
      image: '/Pregunta11.png',
      audioUrl: '',
      answer: 'El estudio Surpás seis mostró que Tirzepatida de cinco, diez y quince miligramos una vez a la semana fue significativamente superior a Insulina Lispro, con reducciones medias de HbA1c de menos dos punto cero cinco, menos dos punto veintisiete y menos dos punto cuarenta y seis respectivamente, comparado con menos uno punto dieciséis con Insulina Lispro.'
    },
    {
      id: 'surpass6-hba1c-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás seis?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de HbA1c en el estudio Surpás seis?',
      image: '/Pregunta12.png',
      audioUrl: '',
      answer: 'El estudio Surpás seis demostró que con Tirzepatida de cinco, diez y quince miligramos una vez a la semana un mayor número de pacientes alcanzaron metas de HbA1c de menor o igual a siete, seis punto cinco y cinco punto cuatro por ciento comparado con Insulina Lispro. Entre el setenta y seis y ochenta por ciento lograron metas menores o iguales a siete por ciento, el sesenta y dos a setenta por ciento menores o iguales a seis punto cinco, y el treinta y uno por ciento alcanzaron normoglucemia versus dos por ciento con Insulina Lispro.'
    },
    {
      id: 'surmount1-peso-resultados',
      text: '¿Cuáles fueron los resultados obtenidos en reducción de peso en el estudio Surmount uno?',
      question: '¿Cuáles fueron los resultados obtenidos en reducción de peso en el estudio Surmount uno?',
      image: '/Pregunta13.png',
      audioUrl: '',
      answer: 'El estudio Surmount uno demostró una diferencia significativa en reducción de peso con todas las dosis de Tirzepatida en comparación con placebo, con reducciones del quince, diecinueve punto cinco y veinte punto nueve por ciento con Tirzepatida de cinco, diez y quince miligramos respectivamente, en pacientes con sobrepeso u obesidad sin Diabetes Tipo Dos, a las setenta y dos semanas.'
    },
    {
      id: 'surmount1-peso-metas',
      text: '¿Cuál fue el porcentaje de participantes que alcanzó los objetivos de reducción de peso en el estudio Surmount uno?',
      question: '¿Cuál fue el porcentaje de participantes que alcanzó los objetivos de reducción de peso en el estudio Surmount uno?',
      image: '/Pregunta14.png',
      audioUrl: '',
      answer: 'Una proporción significativamente mayor de participantes con Tirzepatida logró reducciones de peso corporal del cinco, diez, quince y veinte por ciento desde el inicio en comparación con placebo. Hasta el noventa punto nueve por ciento de los participantes lograron una reducción mayor o igual al cinco por ciento y hasta el cincuenta y seis punto siete por ciento una reducción mayor o igual al veinte por ciento.'
    },
    {
      id: 'surmount2-peso-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de peso en pacientes con Diabetes Tipo Dos y I-M-C mayor o igual a veintisiete según el estudio Surmount dos?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de peso en pacientes con Diabetes Tipo Dos y I-M-C mayor o igual a veintisiete según el estudio Surmount dos?',
      image: '/Pregunta15.png',
      audioUrl: '',
      answer: 'En el estudio Surmount dos se observó una diferencia significativa en la reducción de peso con Tirzepatida en comparación con placebo. Se observaron reducciones del doce punto ocho y catorce punto siete por ciento con Tirzepatida de diez y quince miligramos respectivamente, frente a menos tres punto dos por ciento con placebo.'
    },
    {
      id: 'surmount2-peso-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de reducción de peso en el estudio Surmount dos?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de reducción de peso en el estudio Surmount dos?',
      image: '/Pregunta16.png',
      audioUrl: '',
      answer: 'Una proporción significativamente mayor de participantes con Tirzepatida logró reducciones de peso corporal de cinco, diez, quince y veinte por ciento comparado con placebo. Hasta el ochenta y dos punto ocho por ciento alcanzó una reducción mayor al cinco por ciento y hasta el treinta punto ocho por ciento alcanzó una reducción mayor o igual al veinte por ciento.'
    },
    {
      id: 'surmount3-peso-resultados',
      text: '¿Cuáles fueron los resultados obtenidos en reducción de peso en el estudio Surmount tres?',
      question: '¿Cuáles fueron los resultados obtenidos en reducción de peso en el estudio Surmount tres?',
      image: '/Pregunta17.png',
      audioUrl: '',
      answer: 'El estudio Surmount tres demostró superioridad en reducción de peso corporal para dosis máximas toleradas de Tirzepatida frente a placebo, luego de intervención intensiva de cambio de hábitos, con reducciones promedio de veinticinco por ciento del peso corporal.'
    },
    {
      id: 'surmount3-peso-metas',
      text: '¿Cuál fue el porcentaje de participantes que alcanzó los objetivos de reducción de peso en el estudio Surmount tres?',
      question: '¿Cuál fue el porcentaje de participantes que alcanzó los objetivos de reducción de peso en el estudio Surmount tres?',
      image: '/Pregunta18.png',
      audioUrl: '',
      answer: 'Tirzepatida logró que un ochenta y siete punto cinco por ciento de los participantes alcanzara reducciones de peso mayor o igual al cinco por ciento a las setenta y dos semanas de seguimiento, frente a placebo.'
    },
    {
      id: 'surmount4-peso-resultados',
      text: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de peso según el estudio Surmount cuatro?',
      question: '¿Cuáles fueron los resultados de Tirzepatida en la reducción de peso según el estudio Surmount cuatro?',
      image: '/Pregunta19.png',
      audioUrl: '',
      answer: 'En este ensayo de ochenta y ocho semanas con pacientes con obesidad o sobrepeso, la retirada de Tirzepatida condujo a recuperación de peso, mientras que el tratamiento continuo mantuvo y aumentó la reducción inicial. Después de treinta y seis semanas, los participantes experimentaron una reducción media de veinte punto nueve por ciento, y una reducción general de veinticinco punto tres por ciento versus nueve punto nueve con placebo.'
    },
    {
      id: 'surmount4-peso-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de reducción de peso en el estudio Surmount cuatro?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de reducción de peso en el estudio Surmount cuatro?',
      image: '/Pregunta20.png',
      audioUrl: '',
      answer: 'El estudio mostró que el noventa y siete punto tres por ciento de los participantes alcanzaron reducciones mayores o iguales al cinco por ciento frente a setenta punto dos por ciento con placebo, y el sesenta y nueve punto cinco uno por ciento reducciones mayores o iguales al veinte por ciento.'
    },
    {
      id: 'surmount5-peso-resultados',
      text: '¿Cuáles fueron los resultados obtenidos en reducción de peso en el estudio Surmount cinco?',
      question: '¿Cuáles fueron los resultados obtenidos en reducción de peso en el estudio Surmount cinco?',
      image: '/Pregunta21.png',
      audioUrl: '',
      answer: 'Durante setenta y dos semanas, Tirzepatida fue significativamente superior a Semaglutida en reducción de peso, con resultados de disminución de veinte punto dos por ciento versus trece punto siete por ciento respectivamente.'
    },
    {
      id: 'surmount5-peso-metas',
      text: '¿Qué porcentaje de pacientes alcanzó las metas de reducción de peso en el estudio Surmount cinco?',
      question: '¿Qué porcentaje de pacientes alcanzó las metas de reducción de peso en el estudio Surmount cinco?',
      image: '/Pregunta22.png',
      audioUrl: '',
      answer: 'Un porcentaje significativamente mayor de participantes que tomaron Tirzepatida cumplió con los objetivos de reducción de peso de diez, quince, veinte y veinticinco por ciento frente a Semaglutida. El treinta y uno punto seis por ciento de los participantes con Tirzepatida tuvieron reducción del veinticinco por ciento, frente a dieciséis punto uno por ciento con Semaglutida.'
    }
  ];

  const handleToggle = () => {
    console.log('🔄 TirzepatidaStudiesMenu: Toggle clicked, current state:', isOpen);
    
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

  const handleQuestionClick = async (questionData) => {
    console.log('🎯 TirzepatidaStudiesMenu: Question selected:', questionData);
    setIsOpen(false);
    
    try {
      // Llamar al nuevo endpoint de estudios - DIRECTO AL BACKEND
      const response = await fetch('https://adium-backend.mozartai.com.co/api/tirzepatida-studies/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionData.question
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Respuesta del backend de estudios:', data);
      
      if (data.success) {
        // Preparar el objeto con todos los datos para el TotemApp
        const completeQuestionData = {
          question: questionData.question,
          text: data.text,
          image: data.image,
          audioUrl: data.audioUrl
        };
        
        console.log('✅ Datos completos preparados:', completeQuestionData);
        onQuestionSelect(completeQuestionData);
      } else {
        console.error('❌ Error en la respuesta del backend:', data.error);
        // Enviar sin audio/imagen si hay error
        onQuestionSelect(questionData);
      }
    } catch (error) {
      console.error('❌ Error al obtener respuesta de estudio:', error);
      // Enviar la pregunta de todos modos para que el usuario vea algo
      onQuestionSelect(questionData);
    }
  };

  const handleQuestionTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    isScrollingRef.current = false;
  };

  const handleQuestionTouchMove = (event) => {
    if (!touchStartRef.current) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Si se mueve más de 10px, consideramos que es scroll
    if (deltaX > 10 || deltaY > 10) {
      isScrollingRef.current = true;
    }
  };

  const handleQuestionTouchEnd = async (event, questionData) => {
    // Solo seleccionar si no fue un scroll
    if (!isScrollingRef.current && touchStartRef.current) {
      const touchDuration = Date.now() - touchStartRef.current.time;
      // Solo seleccionar si fue un tap rápido (menos de 500ms)
      if (touchDuration < 500) {
        event.stopPropagation();
        event.preventDefault();
        await handleQuestionClick(questionData);
      }
    }
    
    // Resetear referencias
    touchStartRef.current = null;
    isScrollingRef.current = false;
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
          <span>Estudios Tirzepatida</span>
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
            <h3>Estudios SURPASS y SURMOUNT</h3>
            <p>Selecciona una pregunta sobre los estudios clínicos:</p>
          </div>
          
          <div 
            className="tirzepatida-questions-list"
            onTouchStart={handleQuestionTouchStart}
            onTouchMove={handleQuestionTouchMove}
          >
            {tirzepatidaStudiesQuestions.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuestionClick(question)}
                onTouchStart={handleQuestionTouchStart}
                onTouchMove={handleQuestionTouchMove}
                onTouchEnd={(e) => handleQuestionTouchEnd(e, question)}
                disabled={isProcessing}
                className="tirzepatida-question-item"
                title={question.text}
              >
                <div className="question-icon">📊</div>
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

export default TirzepatidaStudiesMenu;
