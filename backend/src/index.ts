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
import audioRoutes from '../api/routes/audio.routes';
import photoRoutes from '../api/routes/photo.routes';
import textbookRoutes from '../api/routes/textbook.routes';
import chatRoutes from '../api/routes/chat.routes';

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
app.use('/api/audio', audioRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/textbooks', textbookRoutes);
app.use('/api/chat', chatRoutes);

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
  console.log('   Audio:');
  console.log(`   POST   /api/audio/upload`);
  console.log(`   GET    /api/audio?classId=xxx`);
  console.log(`   GET    /api/audio/:id`);
  console.log(`   PATCH  /api/audio/:id`);
  console.log(`   DELETE /api/audio/:id`);
  console.log('   Photos:');
  console.log(`   POST   /api/photos/upload`);
  console.log(`   GET    /api/photos?classId=xxx`);
  console.log(`   GET    /api/photos/:id`);
  console.log(`   PATCH  /api/photos/:id`);
  console.log(`   DELETE /api/photos/:id`);
  console.log('   Textbooks:');
  console.log(`   POST   /api/textbooks/upload`);
  console.log(`   GET    /api/textbooks?classId=xxx`);
  console.log(`   GET    /api/textbooks/:id`);
  console.log(`   PATCH  /api/textbooks/:id`);
  console.log(`   DELETE /api/textbooks/:id`);
  console.log('   AI Chat:');
  console.log(`   POST   /api/chat`);
  console.log(`   GET    /api/chat/conversations?classId=xxx`);
  console.log(`   GET    /api/chat/:conversationId`);
  console.log(`   DELETE /api/chat/:conversationId`);
  console.log('\n✅ Server ready to accept connections\n');
});

export default app;
