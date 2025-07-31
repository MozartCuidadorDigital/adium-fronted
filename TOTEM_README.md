# Adium - Kiosko Mounjaro

Aplicación de kiosko/totem para información sobre Mounjaro con chat de voz y texto.

## 🎯 Características

- **Interfaz de kiosko vertical** optimizada para pantallas táctiles
- **Chat con voz** usando ElevenLabs para síntesis de voz
- **Preguntas predefinidas** sobre Mounjaro
- **Streaming de texto** en tiempo real
- **Diseño responsive** para diferentes tamaños de pantalla
- **Accesibilidad** completa con soporte para lectores de pantalla

## 🚀 Instalación y Uso

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev:totem

# O ejecutar manualmente
npm run dev
# Luego abrir http://localhost:3000/totem.html
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview:totem
```

## 📁 Estructura del Proyecto

```
src/totem/
├── TotemApp.jsx              # Componente principal
├── TotemApp.css              # Estilos principales
├── index.jsx                 # Punto de entrada
├── index.css                 # Estilos globales
├── components/
│   ├── ChatInterface.jsx     # Interfaz de chat
│   ├── ChatInterface.css     # Estilos del chat
│   ├── PredefinedQuestions.jsx # Preguntas predefinidas
│   ├── PredefinedQuestions.css # Estilos de preguntas
│   ├── VoicePlayer.jsx       # Reproductor de voz
│   └── VoicePlayer.css       # Estilos del reproductor
└── hooks/
    └── useTotemAPI.js        # Hook para API del totem
```

## 🔧 Configuración

### Backend

La aplicación requiere que el backend esté ejecutándose en `http://localhost:3001` con los siguientes endpoints:

- `POST /api/totem/question` - Procesar preguntas
- `GET /api/totem/questions` - Obtener preguntas predefinidas
- `GET /api/totem/health` - Health check
- `GET /api/totem/test` - Test de conexión

### Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_TOTEM_MODE=true
```

## 🎨 Características de Diseño

### Interfaz de Kiosko
- **Pantalla completa** sin barras de navegación
- **Botones táctiles** con tamaño mínimo de 44px
- **Prevención de zoom** en dispositivos móviles
- **Desactivación de menú contextual**

### Chat
- **Streaming de texto** palabra por palabra
- **Indicadores de carga** animados
- **Mensajes de error** claros
- **Historial de conversación** persistente

### Preguntas Predefinidas
- **Botones horizontales** con scroll
- **Iconos descriptivos** para cada categoría
- **Estados de carga** y error
- **Diseño responsive** para diferentes pantallas

### Reproductor de Voz
- **Indicador visual** de reproducción
- **Ondas animadas** durante la reproducción
- **Posicionamiento fijo** en la esquina inferior derecha
- **Manejo de errores** de audio

## 🔌 API Integration

### Endpoints Utilizados

```javascript
// Enviar pregunta
POST /api/totem/question
{
  "question": "¿Qué es Mounjaro?",
  "filter": "modulo eq 'mounjaro'"
}

// Respuesta
{
  "success": true,
  "text": "Mounjaro es un medicamento...",
  "audioUrl": "https://...",
  "searchResults": 3,
  "usage": {...}
}

// Obtener preguntas predefinidas
GET /api/totem/questions

// Respuesta
{
  "success": true,
  "questions": [
    {
      "id": "info",
      "text": "Información sobre Mounjaro",
      "question": "¿Qué es Mounjaro y para qué se usa?"
    }
  ]
}
```

## 🎯 Casos de Uso

### Kiosko en Farmacia
- **Información médica** sobre Mounjaro
- **Efectos secundarios** y contraindicaciones
- **Dosificación** y administración
- **Interacciones** medicamentosas

### Eventos Médicos
- **Educación del paciente** sobre medicamentos
- **Información de seguridad** y advertencias
- **Preguntas frecuentes** sobre tratamientos

## 🛠️ Desarrollo

### Agregar Nuevas Preguntas

```javascript
// En el backend: totemService.js
getPredefinedQuestions() {
  return [
    {
      id: 'nueva-categoria',
      text: 'Nueva Categoría',
      question: '¿Pregunta específica?'
    }
  ];
}
```

### Personalizar Estilos

```css
/* En TotemApp.css */
.totem-app {
  /* Personalizar colores y diseño */
  background: linear-gradient(135deg, #tu-color 0%, #tu-color-2 100%);
}
```

### Agregar Nuevos Iconos

```javascript
// En PredefinedQuestions.jsx
const getQuestionIcon = (questionId) => {
  const icons = {
    'nueva-categoria': '🆕',
    // ... otros iconos
  };
  return icons[questionId] || '❓';
};
```

## 🚀 Despliegue

### Kiosko Físico
1. Construir la aplicación: `npm run build`
2. Copiar archivos a dispositivo de kiosko
3. Configurar pantalla completa en navegador
4. Configurar auto-refresh si es necesario

### Servidor Web
1. Construir: `npm run build`
2. Subir archivos `dist/` al servidor
3. Configurar proxy para `/api` al backend
4. Configurar HTTPS para audio

## 🔍 Troubleshooting

### Problemas Comunes

**Audio no reproduce:**
- Verificar permisos de audio en navegador
- Verificar que el backend genere URLs de audio válidas
- Verificar conexión a ElevenLabs

**Chat no responde:**
- Verificar conexión al backend
- Verificar logs del servidor
- Verificar configuración de Azure OpenAI

**Interfaz no se adapta:**
- Verificar viewport meta tags
- Verificar CSS responsive
- Verificar tamaño de pantalla del dispositivo

### Logs de Desarrollo

```bash
# Ver logs del frontend
npm run dev:totem

# Ver logs del backend
# En el directorio del backend
node server.js
```

## 📱 Compatibilidad

- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+
- **Dispositivos:** Tablets, pantallas táctiles, kioskos
- **Resoluciones:** 1024x768 hasta 4K
- **Orientación:** Vertical (portrait) recomendada

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto es parte de Adium - The Power of GIP. 