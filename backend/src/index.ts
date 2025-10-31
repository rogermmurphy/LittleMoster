/**
 * Little Monster GPA Platform - Backend API Server
 * Main entry point for the Express API server
 */

import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import authRoutes from '../api/routes/auth.routes';
import classesRoutes from '../api/routes/classes.routes';

const app: Express = express();
const PORT = process.env['PORT'] || 3000;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Little Monster GPA Backend API');
  console.log('=================================');
  console.log(`📦 Environment: ${NODE_ENV}`);
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('=================================');
  console.log('\n📍 Available endpoints:');
  console.log('   Auth:');
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh-token`);
  console.log(`   GET    /api/auth/me`);
  console.log('   Classes:');
  console.log(`   POST   /api/classes`);
  console.log(`   GET    /api/classes`);
  console.log(`   GET    /api/classes/:id`);
  console.log(`   PATCH  /api/classes/:id`);
  console.log(`   DELETE /api/classes/:id`);
  console.log('\n✅ Server ready to accept connections\n');
});

export default app;
