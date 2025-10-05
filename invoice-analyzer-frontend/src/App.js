import React, { useState } from 'react'
import FileUpload from './components/FileUpload.js'
import AnalysisResults from './components/AnalysisResults.js'
import Questionnaire from './components/Questionnaire.js'
import FinalReport from './components/FinalReport.js'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [uploadId, setUploadId] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [finalReport, setFinalReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use absolute URL for API calls
  const API_BASE = import.meta.env.MODE === 'development' 
    ? 'const API_BASE = import.meta.env.VITE_BACKEND_URL;' 
    : ''

  const handleUploadSuccess = (data) => {
    setUploadId(data.uploadId)
    setCurrentStep('analyze')
    handleAnalyze(data.uploadId)
  }

  const handleAnalyze = async (id = uploadId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadId: id })
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      setAnalysisData(data)
      setCurrentStep('questionnaire')
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Analysis failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionnaireSubmit = async (questionnaire) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId: uploadId,
          questionnaire: questionnaire
        })
      })
      
      if (!response.ok) {
        throw new Error('Report generation failed')
      }
      
      const data = await response.json()
      setFinalReport(data)
      setCurrentStep('report')
    } catch (error) {
      console.error('Report error:', error)
      alert('Report generation failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentStep('upload')
    setUploadId(null)
    setAnalysisData(null)
    setFinalReport(null)
  }

  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'app-header' },
      React.createElement('h1', null, '📊 Invoice Analyzer'),
      React.createElement('p', null, 'Check your invoice data readiness for GETS compliance')
    ),

    React.createElement('main', { className: 'app-main' },
      isLoading && React.createElement('div', { className: 'loading-overlay' },
        React.createElement('div', { className: 'spinner' }),
        React.createElement('p', null, 'Processing...')
      ),

      currentStep === 'upload' && React.createElement(FileUpload, {
        onUploadSuccess: handleUploadSuccess
      }),

      currentStep === 'analyze' && analysisData && React.createElement(AnalysisResults, {
        data: analysisData
      }),

      currentStep === 'questionnaire' && analysisData && React.createElement(Questionnaire, {
        onSubmit: handleQuestionnaireSubmit,
        onBack: () => setCurrentStep('analyze')
      }),

      currentStep === 'report' && finalReport && React.createElement(FinalReport, {
        data: finalReport,
        onReset: handleReset
      })
    )
  )
}

export default App