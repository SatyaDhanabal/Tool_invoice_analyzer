const express = require('express');
const cors = require('cors');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Enhanced JSON error handling
app.use(cors());

// Raw body middleware to capture what's actually being sent
app.use(express.raw({ type: 'application/json', limit: '5mb' }));

// Custom JSON parser with detailed error handling
app.use((req, res, next) => {
  if (req.is('application/json') && req.body && req.body.length > 0) {
    try {
      const rawBody = req.body.toString();
      console.log('Raw request body received:', rawBody);
      console.log('Body length:', rawBody.length);
      
      req.body = JSON.parse(rawBody);
      next();
    } catch (err) {
      console.error('JSON Parse Error Details:');
      console.error('Error message:', err.message);
      console.error('Position:', err.message.match(/position (\d+)/)?.[1] || 'unknown');
      
      const rawBody = req.body.toString();
      console.error('Problematic JSON:', rawBody);
      
      // Show the problematic character
      const position = parseInt(err.message.match(/position (\d+)/)?.[1]) || 0;
      if (position > 0 && rawBody.length >= position) {
        console.error('Problem area:', rawBody.substring(Math.max(0, position - 10), position + 10));
      }
      
      return res.status(400).json({
        error: 'Invalid JSON in request body',
        details: err.message,
        help: 'Make sure your JSON is properly formatted with double quotes'
      });
    }
  } else {
    // If no body or not JSON, use regular JSON parser
    express.json({ limit: '5mb' })(req, res, next);
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', reportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GETS Readiness API Running ✅',
    endpoints: {
      upload: 'POST /api/upload',
      analyze: 'POST /api/analyze',
      report: 'GET /api/report/:id',
      reports: 'GET /api/reports'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    db: 'sqlite',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:3000`);
  console.log(`Health check: http://localhost:3000/health`);
});