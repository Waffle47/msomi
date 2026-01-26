import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import categoryRoutes from './routes/categories.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Logging
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: ['http://127.0.0.1:8082', 'http://localhost:8082', 'http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'CSRF-Token', 'Authorization'],
}));
app.options('*', cors());

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSRF Protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
});

// Apply CSRF protection to all routes except GET requests to static files
app.use((req, res, next) => {
  if (req.method === 'GET' && (req.path.startsWith('/uploads') || req.path.startsWith('/public'))) {
    return next();
  }
  csrfProtection(req, res, next);
});

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});