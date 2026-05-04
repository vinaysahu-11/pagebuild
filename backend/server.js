import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import paymentRoutes from './routes/paymentRoutes.js';
import './firebaseAdmin.js';

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

const PORT = process.env.PORT || 5000;


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
