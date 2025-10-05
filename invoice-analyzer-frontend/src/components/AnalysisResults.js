import React from 'react'

function AnalysisResults({ data, onContinue }) {
  const { scores, coverage, ruleFindings, meta } = data

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  // Sample data preview (first 3 rows)
  const sampleRows = meta.sampleData || []

  return React.createElement('div', null, [
    React.createElement('div', { key: 'scores', className: 'card' },
      React.createElement('h2', null,
        React.createElement('i', { className: 'fas fa-chart-bar' }),
        'Analysis Results'
      ),
      
      React.createElement('div', { className: 'score-overall' },
        React.createElement('div', { 
          className: 'score',
          style: { color: getScoreColor(scores.overall) }
        }, `${scores.overall}%`),
        React.createElement('div', { className: 'label' }, 
          `${getScoreLabel(scores.overall)} • Overall Readiness Score`
        )
      ),
      
      React.createElement('div', { className: 'score-breakdown' },
        React.createElement('div', { className: 'score-item' },
          React.createElement('div', { 
            className: 'score-value',
            style: { color: getScoreColor(scores.data) }
          }, `${scores.data}%`),
          React.createElement('div', { className: 'score-label' }, 'Data Quality'),
          React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' } }, 
            `${meta.rowsParsed} rows parsed`
          )
        ),
        React.createElement('div', { className: 'score-item' },
          React.createElement('div', { 
            className: 'score-value',
            style: { color: getScoreColor(scores.coverage) }
          }, `${scores.coverage}%`),
          React.createElement('div', { className: 'score-label' }, 'Field Coverage'),
          React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' } }, 
            `${coverage.matched.length} of ${coverage.matched.length + coverage.missing.length} fields`
          )
        ),
        React.createElement('div', { className: 'score-item' },
          React.createElement('div', { 
            className: 'score-value',
            style: { color: getScoreColor(scores.rules) }
          }, `${scores.rules}%`),
          React.createElement('div', { className: 'score-label' }, 'Rules Compliance'),
          React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' } }, 
            `${ruleFindings.filter(r => r.ok).length} of ${ruleFindings.length} rules passed`
          )
        ),
        React.createElement('div', { className: 'score-item' },
          React.createElement('div', { 
            className: 'score-value',
            style: { color: getScoreColor(scores.posture) }
          }, `${scores.posture}%`),
          React.createElement('div', { className: 'score-label' }, 'Technical Posture'),
          React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' } }, 
            'Complete questionnaire'
          )
        )
      )
    ),

    React.createElement('div', { key: 'coverage', className: 'card' },
      React.createElement('h2', null,
        React.createElement('i', { className: 'fas fa-map' }),
        'Field Coverage'
      ),
      
      React.createElement('div', { style: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
          React.createElement('div', { style: { width: '12px', height: '12px', borderRadius: '2px', background: '#10b981' } }),
          React.createElement('span', null, `Matched (${coverage.matched.length})`)
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
          React.createElement('div', { style: { width: '12px', height: '12px', borderRadius: '2px', background: '#f59e0b' } }),
          React.createElement('span', null, `Close Match (${coverage.close.length})`)
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
          React.createElement('div', { style: { width: '12px', height: '12px', borderRadius: '2px', background: '#ef4444' } }),
          React.createElement('span', null, `Missing (${coverage.missing.length})`)
        )
      ),
      
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' } },
        coverage.matched.length > 0 && React.createElement('div', null,
          React.createElement('h4', { style: { marginBottom: '0.5rem', color: '#10b981' } }, '✅ Matched Fields'),
          React.createElement('ul', { className: 'coverage-list' },
            coverage.matched.map((field, index) =>
              React.createElement('li', { key: index, className: 'matched' },
                React.createElement('i', { className: 'fas fa-check' }),
                field
              )
            )
          )
        ),
        
        coverage.close.length > 0 && React.createElement('div', null,
          React.createElement('h4', { style: { marginBottom: '0.5rem', color: '#f59e0b' } }, '⚠️ Close Matches'),
          React.createElement('ul', { className: 'coverage-list' },
            coverage.close.map((item, index) =>
              React.createElement('li', { key: index, className: 'close' },
                React.createElement('i', { className: 'fas fa-arrows-alt-h' }),
                React.createElement('div', null,
                  React.createElement('div', { style: { fontWeight: '500' } }, item.target),
                  React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b' } }, 
                    `Similar to: ${item.candidate}`
                  )
                )
              )
            )
          )
        ),
        
        coverage.missing.length > 0 && React.createElement('div', null,
          React.createElement('h4', { style: { marginBottom: '0.5rem', color: '#ef4444' } }, '❌ Missing Fields'),
          React.createElement('ul', { className: 'coverage-list' },
            coverage.missing.map((field, index) =>
              React.createElement('li', { key: index, className: 'missing' },
                React.createElement('i', { className: 'fas fa-times' }),
                field
              )
            )
          )
        )
      )
    ),

    React.createElement('div', { key: 'rules', className: 'card' },
      React.createElement('h2', null,
        React.createElement('i', { className: 'fas fa-check-double' }),
        'Rules Compliance'
      ),
      
      React.createElement('ul', { className: 'rules-list' },
        ruleFindings.map((rule, index) =>
          React.createElement('li', {
            key: index,
            className: rule.ok ? 'passed' : 'failed'
          },
            rule.ok ? 
              React.createElement('i', { className: 'fas fa-check', style: { color: '#10b981' } }) :
              React.createElement('i', { className: 'fas fa-times', style: { color: '#ef4444' } }),
            
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontWeight: '500' } }, 
                rule.rule.replace(/_/g, ' ')
              ),
              !rule.ok && rule.exampleLine && React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' } },
                `Line ${rule.exampleLine}: Expected ${rule.expected}, got ${rule.got}`
              ),
              !rule.ok && rule.value && React.createElement('div', { style: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' } },
                `Invalid value: ${rule.value}`
              )
            )
          )
        )
      )
    ),

    sampleRows.length > 0 && React.createElement('div', { key: 'preview', className: 'card' },
      React.createElement('h2', null,
        React.createElement('i', { className: 'fas fa-table' }),
        'Data Preview'
      ),
      
      React.createElement('div', { className: 'data-table' },
        React.createElement('table', null,
          React.createElement('thead', null,
            React.createElement('tr', null,
              Object.keys(sampleRows[0] || {}).map((key, index) =>
                React.createElement('th', { key: index }, key)
              )
            )
          ),
          React.createElement('tbody', null,
            sampleRows.slice(0, 5).map((row, rowIndex) =>
              React.createElement('tr', { key: rowIndex },
                Object.values(row).map((value, colIndex) =>
                  React.createElement('td', { key: colIndex }, 
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                      value,
                      React.createElement('span', { 
                        className: `badge badge-${typeof value === 'number' ? 'number' : isNaN(Date.parse(value)) ? 'text' : 'date'}`
                      }, 
                        typeof value === 'number' ? '123' : isNaN(Date.parse(value)) ? 'text' : 'date'
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),
      React.createElement('p', { style: { textAlign: 'center', color: '#64748b', marginTop: '1rem' } },
        `Showing 5 of ${meta.rowsParsed} rows`
      )
    ),

    React.createElement('div', { key: 'actions', className: 'action-bar' },
      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: onContinue
      },
        React.createElement('i', { className: 'fas fa-arrow-right' }),
        'Continue to Technical Details'
      )
    )
  ])
}

export default AnalysisResults