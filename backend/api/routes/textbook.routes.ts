/**
 * Textbook Routes
 * Handles PDF textbook uploads and CRUD operations
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:57 AM CST
 * Last Updated: October 31, 2025 9:57 AM CST
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { TextbookService } from '../services/textbook.service';
import { AuthService } from '../services/auth.service';
import { tmpdir } from 'os';
import { join } from 'path';

const router = Router();
const textbookService = new TextbookService();
const authService = new AuthService();

// Configure multer for PDF uploads
const upload = multer({
  dest: join(tmpdir(), 'textbook-uploads'),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF files only
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
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
 * POST /api/textbooks/upload
 * Upload PDF textbook for a class
 */
router.post('/upload', authenticate, upload.single('pdfFile'), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    const { classId, title, author, isbn } = req.body;

    if (!classId || !title) {
      return res.status(400).json({
        success: false,
        error: 'classId and title are required'
      });
    }

    const result = await textbookService.uploadTextbook({
      userId: user.userId,
      classId,
      title,
      author,
      isbn,
      file
    });

    res.status(201).json({
      success: true,
      data: { textbook: result }
    });
  } catch (error: any) {
    console.error('Textbook upload error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to upload textbook'
    });
  }
});

/**
 * GET /api/textbooks?classId=xxx
 * Get all textbooks for a class
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

    const textbooks = await textbookService.getClassTextbooks(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { textbooks }
    });
  } catch (error: any) {
    console.error('Get textbooks error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to retrieve textbooks'
    });
  }
});

/**
 * GET /api/textbooks/:id
 * Get specific textbook details
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const textbookId = req.params['id'];

    if (!textbookId) {
      return res.status(400).json({
        success: false,
        error: 'Textbook ID is required'
      });
    }

    const textbook = await textbookService.getTextbookById(textbookId, user.userId);

    res.status(200).json({
      success: true,
      data: { textbook }
    });
  } catch (error: any) {
    console.error('Get textbook error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Textbook not found'
    });
  }
});

/**
 * PATCH /api/textbooks/:id
 * Update textbook metadata
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const textbookId = req.params['id'];

    if (!textbookId) {
      return res.status(400).json({
        success: false,
        error: 'Textbook ID is required'
      });
    }

    const updated = await textbookService.updateTextbook(textbookId, user.userId, req.body);

    res.status(200).json({
      success: true,
      data: { textbook: updated }
    });
  } catch (error: any) {
    console.error('Update textbook error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update textbook'
    });
  }
});

/**
 * DELETE /api/textbooks/:id
 * Delete textbook and file
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const textbookId = req.params['id'];

    if (!textbookId) {
      return res.status(400).json({
        success: false,
        error: 'Textbook ID is required'
      });
    }

    const result = await textbookService.deleteTextbook(textbookId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete textbook error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete textbook'
    });
  }
});

export default router;
