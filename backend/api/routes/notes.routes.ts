/**
 * Notes Routes
 * Handles note CRUD operations with source tracking
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:37 AM CST
 * Last Updated: October 31, 2025 10:37 AM CST
 */

import { Router, Request, Response } from 'express';
import { NotesService } from '../services/notes.service';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();
const notesService = new NotesService();
const authService = new AuthService();

// Validation schemas
const createNoteSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  noteType: z.string().optional(),
  isAiGenerated: z.boolean().optional(),
  sources: z.array(z.object({
    sourceType: z.string(),
    sourceId: z.string().uuid()
  })).optional()
});

const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  noteType: z.string().optional()
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
 * POST /api/notes
 * Create a new note
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedData = createNoteSchema.parse(req.body);

    const result = await notesService.createNote({
      userId: user.userId,
      ...validatedData
    });

    res.status(201).json({
      success: true,
      data: { note: result }
    });
  } catch (error: any) {
    console.error('Create note error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create note'
    });
  }
});

/**
 * GET /api/notes?classId=xxx
 * Get all notes for a class
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

    const notes = await notesService.getClassNotes(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { notes }
    });
  } catch (error: any) {
    console.error('Get notes error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to retrieve notes'
    });
  }
});

/**
 * GET /api/notes/:id
 * Get specific note with sources
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const noteId = req.params['id'];

    if (!noteId) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    const note = await notesService.getNoteById(noteId, user.userId);

    res.status(200).json({
      success: true,
      data: { note }
    });
  } catch (error: any) {
    console.error('Get note error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Note not found'
    });
  }
});

/**
 * PATCH /api/notes/:id
 * Update note
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const noteId = req.params['id'];

    if (!noteId) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    const validatedData = updateNoteSchema.parse(req.body);
    const updated = await notesService.updateNote(noteId, user.userId, validatedData);

    res.status(200).json({
      success: true,
      data: { note: updated }
    });
  } catch (error: any) {
    console.error('Update note error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update note'
    });
  }
});

/**
 * DELETE /api/notes/:id
 * Delete note
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const noteId = req.params['id'];

    if (!noteId) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    const result = await notesService.deleteNote(noteId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete note error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete note'
    });
  }
});

export default router;
