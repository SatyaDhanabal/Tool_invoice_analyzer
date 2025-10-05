const express = require('express');
const cors = require('cors');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});