import React, { useState } from 'react'

function FileUpload({ onUploadSuccess, apiBase }) {
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    setStatus('Uploading file...')

    const formData = new FormData(e.target)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Upload failed with status: ${response.status}`)
      }

      const data = await response.json()
      setStatus(`✅ File uploaded successfully! ${data.rowsParsed} rows parsed`)
      onUploadSuccess(data)
      
    } catch (error) {
      console.error('Upload error:', error)
      setStatus(`❌ Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return React.createElement('div', { className: 'card' },
    React.createElement('h2', null, 
      React.createElement('i', { className: 'fas fa-upload' }),
      'Upload Invoice Data'
    ),
    
    React.createElement('p', { className: 'form-hint' }, 
      'Upload a CSV or JSON file containing your invoice data. We\'ll analyze it against GETS standards.'
    ),

    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'file' }, 'Select File'),
        React.createElement('input', {
          type: 'file',
          id: 'file',
          name: 'file',
          accept: '.csv,.json,.txt',
          required: true,
          disabled: isUploading
        }),
        React.createElement('p', { className: 'form-hint' }, 'Supports CSV and JSON formats (max 5MB)')
      ),
      
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'country' }, 'Country'),
          React.createElement('select', {
            id: 'country',
            name: 'country',
            defaultValue: 'UAE',
            disabled: isUploading
          },
            React.createElement('option', { value: 'UAE' }, 'United Arab Emirates'),
            React.createElement('option', { value: 'KSA' }, 'Saudi Arabia'),
            React.createElement('option', { value: 'Other' }, 'Other')
          )
        ),
        
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'erp' }, 'ERP System'),
          React.createElement('input', {
            type: 'text',
            id: 'erp',
            name: 'erp',
            placeholder: 'e.g., SAP, Oracle, NetSuite',
            defaultValue: 'SAP',
            disabled: isUploading
          })
        )
      ),
      
      React.createElement('button', {
        type: 'submit',
        className: 'btn btn-primary',
        disabled: isUploading
      }, 
        isUploading ? 
          [React.createElement('i', { key: 'loading', className: 'fas fa-spinner fa-spin' }), ' Uploading...'] :
          [React.createElement('i', { key: 'upload', className: 'fas fa-upload' }), ' Upload & Analyze']
      )
    ),
    
    status && React.createElement('div', {
      className: `status ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}`
    }, status)
  )
}

export default FileUpload