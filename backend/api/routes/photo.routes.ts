/**
 * Photo Routes
 * Handles photo uploads and CRUD operations
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:16 AM CST
 * Last Updated: October 31, 2025 9:16 AM CST
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { PhotoService } from '../services/photo.service';
import { AuthService } from '../services/auth.service';
import { tmpdir } from 'os';
import { join } from 'path';

const router = Router();
const photoService = new PhotoService();
const authService = new AuthService();

// Configure multer for photo uploads
const upload = multer({
  dest: join(tmpdir(), 'photo-uploads'),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|heic|webp)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
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
 * POST /api/photos/upload
 * Upload photo for a class
 */
router.post('/upload', authenticate, upload.single('photoFile'), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No photo file provided'
      });
    }

    const { classId, title } = req.body;

    if (!classId || !title) {
      return res.status(400).json({
        success: false,
        error: 'classId and title are required'
      });
    }

    const result = await photoService.uploadPhoto({
      userId: user.userId,
      classId,
      title,
      file
    });

    res.status(201).json({
      success: true,
      data: { photo: result }
    });
  } catch (error: any) {
    console.error('Photo upload error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to upload photo'
    });
  }
});

/**
 * GET /api/photos?classId=xxx
 * Get all photos for a class
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

    const photos = await photoService.getClassPhotos(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { photos }
    });
  } catch (error: any) {
    console.error('Get photos error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to retrieve photos'
    });
  }
});

/**
 * GET /api/photos/:id
 * Get specific photo with extracted text
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const photoId = req.params['id'];

    if (!photoId) {
      return res.status(400).json({
        success: false,
        error: 'Photo ID is required'
      });
    }

    const photo = await photoService.getPhotoById(photoId, user.userId);

    res.status(200).json({
      success: true,
      data: { photo }
    });
  } catch (error: any) {
    console.error('Get photo error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Photo not found'
    });
  }
});

/**
 * PATCH /api/photos/:id
 * Update photo metadata
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const photoId = req.params['id'];

    if (!photoId) {
      return res.status(400).json({
        success: false,
        error: 'Photo ID is required'
      });
    }

    const updated = await photoService.updatePhoto(photoId, user.userId, req.body);

    res.status(200).json({
      success: true,
      data: { photo: updated }
    });
  } catch (error: any) {
    console.error('Update photo error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update photo'
    });
  }
});

/**
 * DELETE /api/photos/:id
 * Delete photo and file
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const photoId = req.params['id'];

    if (!photoId) {
      return res.status(400).json({
        success: false,
        error: 'Photo ID is required'
      });
    }

    const result = await photoService.deletePhoto(photoId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete photo error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete photo'
    });
  }
});

export default router;
