import { useState } from 'react'
import './App.css'

// Definir las preguntas del wizard
const questions = [
  {
    id: 'objetivo',
    title: '¿Cuál es tu objetivo principal en los próximos 90 días?',
    options: [
      { value: 'validar', label: 'Validar mi idea de negocio', scores: { landing: 3, web: 1, app: 0 } },
      { value: 'leads', label: 'Generar leads y clientes potenciales', scores: { landing: 2, web: 2, app: 1 } },
      { value: 'ventas', label: 'Vender productos/servicios directamente', scores: { landing: 3, web: 2, app: 1 } },
      { value: 'retener', label: 'Retener y fidelizar clientes actuales', scores: { landing: 0, web: 1, app: 3 } }
    ]
  },
  {
    id: 'audiencia',
    title: '¿Cómo llega tu audiencia a ti principalmente?',
    options: [
      { value: 'ads', label: 'Publicidad pagada (Facebook, Google Ads)', scores: { landing: 3, web: 1, app: 0 } },
      { value: 'search', label: 'Búsquedas en Google', scores: { landing: 1, web: 3, app: 0 } },
      { value: 'social', label: 'Redes sociales orgánicas', scores: { landing: 2, web: 2, app: 1 } },
      { value: 'referral', label: 'Referencias y boca a boca', scores: { landing: 1, web: 2, app: 2 } },
      { value: 'existing', label: 'Ya tengo clientes que usan mi servicio', scores: { landing: 0, web: 1, app: 3 } }
    ]
  },
  {
    id: 'frecuencia',
    title: '¿Con qué frecuencia esperás que tus usuarios interactúen con tu solución?',
    options: [
      { value: 'once', label: 'Una vez (compra puntual)', scores: { landing: 3, web: 1, app: 0 } },
      { value: 'occasional', label: 'Ocasional (mensual)', scores: { landing: 2, web: 2, app: 1 } },
      { value: 'weekly', label: 'Semanal', scores: { landing: 1, web: 2, app: 2 } },
      { value: 'daily', label: 'Diaria', scores: { landing: 0, web: 1, app: 3 } }
    ]
  },
  {
    id: 'presupuesto',
    title: '¿Cuál es tu presupuesto inicial para desarrollo?',
    options: [
      { value: 'low', label: 'Menos de $500 USD', scores: { landing: 3, web: 1, app: 0 } },
      { value: 'medium', label: '$500 - $2,000 USD', scores: { landing: 2, web: 3, app: 1 } },
      { value: 'high', label: '$2,000 - $5,000 USD', scores: { landing: 1, web: 2, app: 2 } },
      { value: 'enterprise', label: 'Más de $5,000 USD', scores: { landing: 1, web: 2, app: 3 } }
    ]
  },
  {
    id: 'funciones',
    title: '¿Qué funcionalidad es más crítica para tu negocio?',
    options: [
      { value: 'convert', label: 'Convertir visitantes rápidamente', scores: { landing: 3, web: 1, app: 0 } },
      { value: 'inform', label: 'Informar sobre múltiples servicios', scores: { landing: 1, web: 3, app: 1 } },
      { value: 'engage', label: 'Crear contenido y educar', scores: { landing: 1, web: 3, app: 1 } },
      { value: 'interact', label: 'Permitir interacción continua', scores: { landing: 0, web: 1, app: 3 } }
    ]
  }
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }))
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResult(true)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const restart = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResult(false)
  }

  const calculateResult = () => {
    const scores = { landing: 0, web: 0, app: 0 }
    
    Object.entries(answers).forEach(([questionId, selectedOption]) => {
      const question = questions.find(q => q.id === questionId)
      const option = question.options.find(opt => opt.value === selectedOption.value)
      
      scores.landing += option.scores.landing
      scores.web += option.scores.web
      scores.app += option.scores.app
    })

    const maxScore = Math.max(scores.landing, scores.web, scores.app)
    
    if (maxScore === scores.landing) {
      return {
        type: 'Landing Page',
        reason: 'Tu prioridad es convertir rápidamente y validar tu propuesta de valor con una inversión mínima.',
        description: 'Una landing page te permitirá testear tu idea, capturar leads y generar ventas de forma rápida y económica.',
        nextSteps: ['Definir tu propuesta de valor única', 'Crear copy persuasivo', 'Configurar métricas de conversión', 'Lanzar campañas de tráfico pagado'],
        color: 'from-green-500 to-emerald-600'
      }
    } else if (maxScore === scores.web) {
      return {
        type: 'Sitio Web Completo',
        reason: 'Necesitás credibilidad, posicionamiento SEO y mostrar múltiples servicios o productos.',
        description: 'Un sitio web te dará la presencia digital completa que necesitás para establecer autoridad en tu nicho.',
        nextSteps: ['Planificar la arquitectura del sitio', 'Crear contenido para SEO', 'Diseñar múltiples páginas', 'Optimizar para buscadores'],
        color: 'from-blue-500 to-cyan-600'
      }
    } else {
      return {
        type: 'Aplicación',
        reason: 'Tu modelo de negocio requiere interacción frecuente y funcionalidades avanzadas.',
        description: 'Una aplicación te permitirá crear una experiencia única y retener usuarios con valor recurrente.',
        nextSteps: ['Definir MVP y funcionalidades core', 'Diseñar UX/UI detallada', 'Planificar desarrollo por fases', 'Considerar monetización recurrente'],
        color: 'from-purple-500 to-pink-600'
      }
    }
  }

  if (showResult) {
    const result = calculateResult()
    return (
      <div className="wizard-container">
        <div className="result-card">
          <div className={`result-header bg-gradient-to-r ${result.color}`}>
            <h1>🎯 Tu mejor opción es:</h1>
            <h2>{result.type}</h2>
          </div>
          
          <div className="result-content">
            <div className="result-reason">
              <h3>¿Por qué?</h3>
              <p>{result.reason}</p>
              <p className="description">{result.description}</p>
            </div>
            
            <div className="next-steps">
              <h3>Próximos pasos:</h3>
              <ul>
                {result.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            
            <div className="cta-section">
              <h3>¿Necesitás ayuda para implementarlo?</h3>
              <p>Hablemos de tu proyecto y te ayudo a llevarlo a cabo</p>
              <a 
                href={`https://wa.me/598091690509?text=${encodeURIComponent(`Hola! Acabo de hacer el test del Wizard Emprendedor y mi resultado fue: ${result.type}. Me gustaría recibir ayuda para implementar mi proyecto.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <span className="whatsapp-icon">💬</span>
                Hablemos por WhatsApp
              </a>
            </div>
            
            <button className="restart-btn" onClick={restart}>
              🔄 Hacer el test de nuevo
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const selectedAnswer = answers[currentQuestion.id]

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        <div className="wizard-header">
          <h1>🚀 Wizard Emprendedor</h1>
          <p>Descubrí qué necesita tu negocio en 2 minutos</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="step-counter">Paso {currentStep + 1} de {questions.length}</span>
        </div>
        
        <div className="question-section">
          <h2>{currentQuestion.title}</h2>
          
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                className={`option-button ${selectedAnswer?.value === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQuestion.id, option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="navigation">
          {currentStep > 0 && (
            <button className="nav-btn secondary" onClick={prevStep}>
              ← Anterior
            </button>
          )}
          
          <button 
            className="nav-btn primary" 
            onClick={nextStep}
            disabled={!selectedAnswer}
          >
            {currentStep === questions.length - 1 ? 'Ver Resultado 🎯' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
