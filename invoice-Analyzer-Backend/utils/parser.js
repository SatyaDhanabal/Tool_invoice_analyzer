const { parse } = require('csv-parse/sync');

const MAX_ROWS = 200;

/**
 * Try to parse CSV or JSON string.
 * Returns { rows: Array<object>, meta: { format: 'csv' | 'json' } }
 */
function parseFile(rawText) {
  let rows = [];

  // Remove BOM if present
  if (rawText.charCodeAt(0) === 0xFEFF) {
    rawText = rawText.slice(1);
  }

  // Handle empty input
  if (!rawText || rawText.trim().length === 0) {
    console.error('Input is empty.');
    return { rows: [], meta: { format: 'unknown' } };
  }

  try {
    // First, try parsing as JSON
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) {
      rows = parsed.slice(0, MAX_ROWS);
      return { rows, meta: { format: 'json' } };
    } else {
      throw new Error('Not an array');
    }
  } catch (jsonErr) {
    // Fallback to CSV
    try {
      rows = parse(rawText, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }).slice(0, MAX_ROWS);

      // Log for debugging
      if (!rows || rows.length === 0) {
        console.error('CSV parsed but no rows found.');
      }

      return { rows, meta: { format: 'csv' } };
    } catch (csvErr) {
      console.error('CSV parse failed:', csvErr.message);
      return { rows: [], meta: { format: 'csv' } };
    }
  }
}

module.exports = parseFile;