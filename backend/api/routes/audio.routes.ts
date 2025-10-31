/**
 * Audio Routes
 * Handles audio file uploads and CRUD operations
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:13 AM CST
 * Last Updated: October 31, 2025 9:13 AM CST
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { AudioService } from '../services/audio.service';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { tmpdir } from 'os';
import { join } from 'path';

const router = Router();
const audioService = new AudioService();
const authService = new AuthService();

// Configure multer for file uploads
const upload = multer({
  dest: join(tmpdir(), 'audio-uploads'),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Authentication middleware
const authenticate = (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyAccessToken(token);
    
    (req as any).user = payload;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * POST /api/audio/upload
 * Upload audio file for a class
 */
router.post('/upload', authenticate, upload.single('audioFile'), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided'
      });
    }

    const { classId, title } = req.body;

    if (!classId || !title) {
      return res.status(400).json({
        success: false,
        error: 'classId and title are required'
      });
    }

    const result = await audioService.uploadAudio({
      userId: user.userId,
      classId,
      title,
      file
    });

    res.status(201).json({
      success: true,
      data: { audio: result }
    });
  } catch (error: any) {
    console.error('Audio upload error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to upload audio'
    });
  }
});

/**
 * GET /api/audio?classId=xxx
 * Get all audio recordings for a class
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classId = req.query['classId'] as string;

    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'classId query parameter is required'
      });
    }

    const recordings = await audioService.getClassAudioRecordings(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { recordings }
    });
  } catch (error: any) {
    console.error('Get audio recordings error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to retrieve audio recordings'
    });
  }
});

/**
 * GET /api/audio/:id
 * Get specific audio recording with transcript
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const audioId = req.params['id'];

    if (!audioId) {
      return res.status(400).json({
        success: false,
        error: 'Audio ID is required'
      });
    }

    const audio = await audioService.getAudioById(audioId, user.userId);

    res.status(200).json({
      success: true,
      data: { audio }
    });
  } catch (error: any) {
    console.error('Get audio error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Audio recording not found'
    });
  }
});

/**
 * PATCH /api/audio/:id
 * Update audio recording metadata
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const audioId = req.params['id'];

    if (!audioId) {
      return res.status(400).json({
        success: false,
        error: 'Audio ID is required'
      });
    }

    const updated = await audioService.updateAudio(audioId, user.userId, req.body);

    res.status(200).json({
      success: true,
      data: { audio: updated }
    });
  } catch (error: any) {
    console.error('Update audio error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update audio recording'
    });
  }
});

/**
 * DELETE /api/audio/:id
 * Delete audio recording and file
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const audioId = req.params['id'];

    if (!audioId) {
      return res.status(400).json({
        success: false,
        error: 'Audio ID is required'
      });
    }

    const result = await audioService.deleteAudio(audioId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete audio error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete audio recording'
    });
  }
});

export default router;
