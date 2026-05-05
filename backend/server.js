import express from 'express';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import paymentRoutes from './routes/paymentRoutes.js';
import './firebaseAdmin.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for testing, restrict in prod
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io injection middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/payments', paymentRoutes);


// Serve Static Frontend (Production Unified Build)
const clientPath = path.join(__dirname, '../dist');
app.use(express.static(clientPath));


// Fallback Route for React Router (fix wildcard for Express 5)
app.get(/.*/, (req, res) => {
  const indexPath = path.join(clientPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found. Please ensure "npm run build" is executed during deployment.');
  }
});

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
