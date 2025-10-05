const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const parseFile = require('../utils/parser');
const matchFields = require('../utils/fieldMapper');
const runRules = require('../utils/rulesEngine');
const computeScores = require('../utils/scoring');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    let rawText;
    const country = req.body.country || 'UAE';
    const erp = req.body.erp || 'Unknown';

    // Handle file upload or text input
    if (req.file) {
      const filePath = req.file.path;
      rawText = fs.readFileSync(filePath, 'utf8');
    } else if (req.body.text) {
      rawText = req.body.text;
    } else {
      return res.status(400).json({ error: 'No file or text provided.' });
    }

    // Debug: log raw file content
    console.log('Raw file content:', rawText);

    // Parse the file
    const { rows, meta } = parseFile(rawText);

    // Debug: log parsed rows
    console.log('Parsed rows:', rows);

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        error: 'No valid data found in file.',
        details: 'Check if your file has headers and data rows. Supported formats: CSV, TXT.'
      });
    }

    // Generate upload ID
    const uploadId = 'u_' + uuidv4();

    // Store in database
    db.prepare(`
      INSERT INTO uploads (id, created_at, country, erp, rows_parsed, parsed_rows)
      VALUES (?, datetime('now'), ?, ?, ?, ?)
    `).run(uploadId, country, erp, rows.length, JSON.stringify(rows));

    return res.json({
      uploadId,
      rowsParsed: rows.length,
      format: meta.format
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload or parse file.' });
  }
});

// POST /api/analyze
router.post('/analyze', async (req, res) => {
  try {
    console.log('=== ANALYZE ENDPOINT CALLED ===');
    console.log('Request body received:', req.body);
    console.log('Request body type:', typeof req.body);

    // Check if body exists
    if (!req.body) {
      return res.status(400).json({
        error: 'No request body received',
        help: 'Make sure to send a JSON body with Content-Type: application/json'
      });
    }

    const { uploadId, questionnaire = {} } = req.body;

    if (!uploadId) {
      return res.status(400).json({
        error: 'uploadId is required in request body',
        receivedBody: req.body
      });
    }

    console.log('Looking for uploadId:', uploadId);

    // Fetch upload from database
    const uploadRow = db.prepare(`SELECT * FROM uploads WHERE id = ?`).get(uploadId);

    if (!uploadRow) {
      return res.status(404).json({
        error: 'Upload not found',
        uploadId: uploadId,
        help: 'Make sure the uploadId exists and was created recently'
      });
    }

    if (!uploadRow.parsed_rows) {
      return res.status(400).json({ error: 'Parsed data missing from upload.' });
    }

    // Parse the stored rows
    let rows;
    try {
      rows = JSON.parse(uploadRow.parsed_rows);
    } catch (parseError) {
      return res.status(500).json({
        error: 'Failed to parse stored data',
        details: parseError.message
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'No valid data to analyze.' });
    }

    console.log('Running analysis on', rows.length, 'rows');

    // Run analysis
    const matchResult = matchFields(rows);
    const ruleResult = runRules(rows);
    const scores = computeScores(rows, matchResult, ruleResult, questionnaire);

    // Generate report
    const reportId = 'r_' + uuidv4();
    const report = {
      reportId,
      scores,
      coverage: matchResult.coverage,
      ruleFindings: ruleResult.findings,
      gaps: ruleResult.gaps,
      meta: {
        rowsParsed: rows.length,
        linesTotal: rows.length,
        country: uploadRow.country,
        erp: uploadRow.erp,
        db: 'sqlite',
        uploadId: uploadId
      }
    };

    // Store report in database
    db.prepare(`
      INSERT INTO reports (id, upload_id, created_at, scores_overall, report_json, expires_at)
      VALUES (?, ?, datetime('now'), ?, ?, datetime('now', '+7 days'))
    `).run(reportId, uploadId, scores.overall, JSON.stringify(report));

    console.log('Analysis completed successfully. Report ID:', reportId);

    return res.json(report);
  } catch (err) {
    console.error('Analyze error:', err);

    return res.status(500).json({
      error: 'Analysis failed',
      details: err.message,
      type: err.constructor.name
    });
  }
});

// GET /api/report/:id
router.get('/report/:id', (req, res) => {
  try {
    const { id } = req.params;

    const row = db.prepare(`
      SELECT report_json FROM reports
      WHERE id = ? AND datetime('now') < expires_at
    `).get(id);

    if (!row) {
      return res.status(404).json({ error: 'Report not found or expired.' });
    }

    return res.json(JSON.parse(row.report_json));
  } catch (err) {
    console.error('Fetch report error:', err);
    return res.status(500).json({ error: 'Failed to fetch report.' });
  }
});

// GET /api/reports (P1 - optional)
router.get('/reports', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const rows = db.prepare(`
      SELECT id, created_at, scores_overall
      FROM reports
      WHERE datetime('now') < expires_at
      ORDER BY created_at DESC
      LIMIT ?
    `).all(limit);

    const reports = rows.map(row => ({
      reportId: row.id,
      createdAt: row.created_at,
      overallScore: row.scores_overall
    }));

    return res.json({ reports });
  } catch (err) {
    console.error('Fetch reports error:', err);
    return res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

module.exports = router;