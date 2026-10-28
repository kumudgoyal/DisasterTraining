const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');
const db = require('./config/database');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Security & Parsing
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO event listeners
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`[Socket.IO] Client ${socket.id} joined ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/field-reports', require('./routes/fieldReports'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/response-teams', require('./routes/responseTeams'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/damage-reports', require('./routes/damageReports'));
app.use('/api/training', require('./routes/training'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/gis', require('./routes/gis'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));

// Global health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Disaster Management & Emergency Coordination API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    console.log('Running database migrations...');
    await db.migrate.latest();
    console.log('Database migrations completed.');

    // Check if roles or incidents exist; if not, run seed
    const roleCount = await db('roles').count('id as c').first();
    if (!roleCount || roleCount.c === 0) {
      console.log('Database empty. Running seed...');
      await db.seed.run();
      console.log('Database seeded successfully.');
    }

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Emergency Command Center Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = { app, server };
