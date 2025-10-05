import React, { useState } from 'react'

function Questionnaire({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    webhooks: false,
    sandbox_env: false,
    retries: false
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return React.createElement('div', { className: 'card' },
    React.createElement('h2', null,
      React.createElement('i', { className: 'fas fa-clipboard-list' }),
      'Technical Configuration'
    ),
    
    React.createElement('p', { style: { marginBottom: '2rem', color: '#64748b' } }, 
      'Provide additional details about your technical setup to improve your readiness score.'
    ),

    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          },
          onMouseOver: (e) => e.currentTarget.style.borderColor = '#cbd5e1',
          onMouseOut: (e) => e.currentTarget.style.borderColor = '#e2e8f0'
        },
          React.createElement('input', {
            type: 'checkbox',
            name: 'webhooks',
            checked: formData.webhooks,
            onChange: handleChange,
            style: { transform: 'scale(1.2)' }
          }),
          React.createElement('div', null,
            React.createElement('div', { style: { fontWeight: '600', marginBottom: '0.25rem' } }, 
              'Webhooks Configured'
            ),
            React.createElement('div', { style: { fontSize: '0.9rem', color: '#64748b' } }, 
              'Real-time notifications for invoice status changes'
            )
          )
        )
      ),
      
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          },
          onMouseOver: (e) => e.currentTarget.style.borderColor = '#cbd5e1',
          onMouseOut: (e) => e.currentTarget.style.borderColor = '#e2e8f0'
        },
          React.createElement('input', {
            type: 'checkbox',
            name: 'sandbox_env',
            checked: formData.sandbox_env,
            onChange: handleChange,
            style: { transform: 'scale(1.2)' }
          }),
          React.createElement('div', null,
            React.createElement('div', { style: { fontWeight: '600', marginBottom: '0.25rem' } }, 
              'Sandbox Environment'
            ),
            React.createElement('div', { style: { fontSize: '0.9rem', color: '#64748b' } }, 
              'Testing environment available for integration'
            )
          )
        )
      ),
      
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          },
          onMouseOver: (e) => e.currentTarget.style.borderColor = '#cbd5e1',
          onMouseOut: (e) => e.currentTarget.style.borderColor = '#e2e8f0'
        },
          React.createElement('input', {
            type: 'checkbox',
            name: 'retries',
            checked: formData.retries,
            onChange: handleChange,
            style: { transform: 'scale(1.2)' }
          }),
          React.createElement('div', null,
            React.createElement('div', { style: { fontWeight: '600', marginBottom: '0.25rem' } }, 
              'Retry Mechanisms'
            ),
            React.createElement('div', { style: { fontSize: '0.9rem', color: '#64748b' } }, 
              'Automatic retry logic for failed API calls'
            )
          )
        )
      ),
      
      React.createElement('div', { className: 'action-bar' },
        React.createElement('button', {
          type: 'button',
          className: 'btn btn-outline',
          onClick: onBack
        },
          React.createElement('i', { className: 'fas fa-arrow-left' }),
          'Back to Analysis'
        ),
        React.createElement('button', {
          type: 'submit',
          className: 'btn btn-primary'
        },
          React.createElement('i', { className: 'fas fa-file-alt' }),
          'Generate Final Report'
        )
      )
    )
  )
}

export default Questionnaire