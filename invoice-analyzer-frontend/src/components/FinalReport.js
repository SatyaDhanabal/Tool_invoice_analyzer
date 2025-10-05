import React from 'react'

function FinalReport({ data, onReset }) {
  const { scores, reportId, coverage, ruleFindings, meta } = data

  const getOverallStatus = (score) => {
    if (score >= 80) return { 
      text: 'Excellent - Ready for GETS Integration', 
      color: '#10b981',
      bgColor: '#f8fafc',
      borderColor: '#10b981',
      icon: 'fas fa-trophy'
    }
    if (score >= 60) return { 
      text: 'Good - Minor Improvements Needed', 
      color: '#f59e0b',
      bgColor: '#f8fafc',
      borderColor: '#f59e0b',
      icon: 'fas fa-check-circle'
    }
    if (score >= 40) return { 
      text: 'Fair - Significant Work Required', 
      color: '#f97316',
      bgColor: '#f8fafc',
      borderColor: '#f97316',
      icon: 'fas fa-exclamation-triangle'
    }
    return { 
      text: 'Poor - Major Restructuring Needed', 
      color: '#ef4444',
      bgColor: '#f8fafc',
      borderColor: '#ef4444',
      icon: 'fas fa-times-circle'
    }
  }

  const status = getOverallStatus(scores.overall)

  const downloadReport = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gets-report-${reportId}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyShareableLink = () => {
    const link = `${window.location.origin}/report/${reportId}`
    navigator.clipboard.writeText(link).then(() => {
      alert('Shareable link copied to clipboard!')
    })
  }

  return React.createElement('div', null, [
    // Header Card with Overall Score
    React.createElement('div', { key: 'header', className: 'card', style: { 
      background: status.bgColor,
      border: `2px solid ${status.borderColor}`,
      textAlign: 'center'
    }},
      React.createElement('div', { style: { fontSize: '3rem', marginBottom: '1rem', color: status.color } },
        React.createElement('i', { className: status.icon })
      ),
      React.createElement('h1', { style: { fontSize: '2.5rem', fontWeight: '700', color: status.color, marginBottom: '0.5rem' } }, 
        `${scores.overall}%`
      ),
      React.createElement('p', { style: { fontSize: '1.2rem', color: '#64748b', marginBottom: '1.5rem' } }, 
        status.text
      ),
      React.createElement('div', { style: { 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: '#f1f5f9',
        color: '#475569',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600'
      }},
        React.createElement('i', { className: 'fas fa-calendar' }),
        `Generated: ${new Date().toLocaleDateString()}`
      )
    ),

    // Score Breakdown in Grid
    React.createElement('div', { key: 'scores', className: 'card' },
      React.createElement('h2', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' } },
        React.createElement('i', { className: 'fas fa-chart-pie', style: { color: '#2563eb' } }),
        'Detailed Score Breakdown'
      ),
      
      React.createElement('div', { style: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }},
        [
          { score: scores.data, label: 'Data Quality', desc: `${meta.rowsParsed} rows parsed`, icon: 'fas fa-database', color: '#3b82f6' },
          { score: scores.coverage, label: 'Field Coverage', desc: `${coverage.matched.length} fields matched`, icon: 'fas fa-map-marked-alt', color: '#8b5cf6' },
          { score: scores.rules, label: 'Rules Compliance', desc: `${ruleFindings.filter(r => r.ok).length}/${ruleFindings.length} rules passed`, icon: 'fas fa-check-double', color: '#10b981' },
          { score: scores.posture, label: 'Technical Posture', desc: 'Based on configuration', icon: 'fas fa-sliders-h', color: '#f59e0b' }
        ].map((item, index) => 
          React.createElement('div', { 
            key: index,
            style: { 
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              textAlign: 'center',
              background: '#ffffff',
              transition: 'all 0.3s ease'
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }
          },
            React.createElement('div', { style: { fontSize: '2rem', color: item.color, marginBottom: '0.5rem' } },
              React.createElement('i', { className: item.icon })
            ),
            React.createElement('div', { style: { fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' } }, 
              `${item.score}%`
            ),
            React.createElement('div', { style: { fontWeight: '600', color: '#374151', marginBottom: '0.5rem' } }, 
              item.label
            ),
            React.createElement('div', { style: { fontSize: '0.875rem', color: '#64748b' } }, 
              item.desc
            )
          )
        )
      )
    ),

    // Quick Stats
    React.createElement('div', { key: 'stats', className: 'card' },
      React.createElement('h2', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' } },
        React.createElement('i', { className: 'fas fa-chart-line', style: { color: '#2563eb' } }),
        'Quick Stats'
      ),
      
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' } },
        [
          { label: 'Total Fields', value: coverage.matched.length + coverage.missing.length, icon: 'fas fa-tags', color: '#3b82f6' },
          { label: 'Fields Matched', value: coverage.matched.length, icon: 'fas fa-check-circle', color: '#10b981' },
          { label: 'Rules Passed', value: ruleFindings.filter(r => r.ok).length, icon: 'fas fa-shield-alt', color: '#8b5cf6' },
          { label: 'Data Rows', value: meta.rowsParsed, icon: 'fas fa-layer-group', color: '#f59e0b' }
        ].map((stat, index) =>
          React.createElement('div', { 
            key: index,
            style: { 
              textAlign: 'center',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }
          },
            React.createElement('div', { style: { fontSize: '1.5rem', color: stat.color, marginBottom: '0.5rem' } },
              React.createElement('i', { className: stat.icon })
            ),
            React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' } }, 
              stat.value
            ),
            React.createElement('div', { style: { fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' } }, 
              stat.label
            )
          )
        )
      )
    ),

    // Action Cards - Clean Professional Design
    React.createElement('div', { key: 'actions', className: 'card' },
      React.createElement('h2', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' } },
        React.createElement('i', { className: 'fas fa-rocket', style: { color: '#2563eb' } }),
        'Next Steps'
      ),
      
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' } },
        // Download Card
        React.createElement('div', { 
          style: { 
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            transition: 'all 0.3s ease'
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' } },
            React.createElement('div', { style: { width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #3b82f6' } },
              React.createElement('i', { className: 'fas fa-file-download', style: { color: '#3b82f6', fontSize: '1.25rem' } })
            ),
            React.createElement('div', null,
              React.createElement('h3', { style: { margin: 0, color: '#1e293b' } }, 'Download Report'),
              React.createElement('p', { style: { margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' } }, 'Get detailed JSON analysis')
            )
          ),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: downloadReport,
            style: { width: '100%' }
          },
            React.createElement('i', { className: 'fas fa-download' }),
            'Download JSON Report'
          )
        ),

        // Share Card
        React.createElement('div', { 
          style: { 
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            transition: 'all 0.3s ease'
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' } },
            React.createElement('div', { style: { width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #10b981' } },
              React.createElement('i', { className: 'fas fa-share-nodes', style: { color: '#10b981', fontSize: '1.25rem' } })
            ),
            React.createElement('div', null,
              React.createElement('h3', { style: { margin: 0, color: '#1e293b' } }, 'Share Results'),
              React.createElement('p', { style: { margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' } }, 'Share with your team')
            )
          ),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: copyShareableLink,
            style: { width: '100%' }
          },
            React.createElement('i', { className: 'fas fa-link' }),
            'Copy Shareable Link'
          )
        ),

        // New Analysis Card
        React.createElement('div', { 
          style: { 
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            transition: 'all 0.3s ease'
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' } },
            React.createElement('div', { style: { width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #f59e0b' } },
              React.createElement('i', { className: 'fas fa-file-circle-plus', style: { color: '#f59e0b', fontSize: '1.25rem' } })
            ),
            React.createElement('div', null,
              React.createElement('h3', { style: { margin: 0, color: '#1e293b' } }, 'New Analysis'),
              React.createElement('p', { style: { margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' } }, 'Analyze another file')
            )
          ),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: onReset,
            style: { width: '100%' }
          },
            React.createElement('i', { className: 'fas fa-plus' }),
            'Analyze Another File'
          )
        )
      )
    ),

    // Report ID Footer
    React.createElement('div', { key: 'footer', className: 'card', style: { background: '#f8fafc', textAlign: 'center' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
        React.createElement('i', { className: 'fas fa-fingerprint', style: { color: '#64748b' } }),
        React.createElement('span', { style: { fontWeight: '600', color: '#374151' } }, 'Report ID:'),
        React.createElement('code', { style: { 
          background: '#e2e8f0', 
          padding: '0.25rem 0.5rem', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          color: '#475569'
        }}, reportId)
      ),
      React.createElement('p', { style: { color: '#64748b', fontSize: '0.875rem', margin: 0 } }, 
        'Use this ID to retrieve your report later'
      )
    )
  ])
}

export default FinalReport