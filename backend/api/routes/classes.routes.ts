/**
 * Classes Routes
 * Handles CRUD operations for student classes
 */

import { Router, Request, Response } from 'express';
import { ClassesService } from '../services/classes.service';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();
const classesService = new ClassesService();
const authService = new AuthService();

// Validation schemas
const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100),
  teacherName: z.string().max(100).optional(),
  period: z.string().max(20).optional(),
  color: z.string().max(20).optional(),
  subject: z.string().max(50).optional(),
  currentGrade: z.string().max(5).optional(),
  gradePercent: z.number().min(0).max(100).optional()
});

const updateClassSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  teacherName: z.string().max(100).optional(),
  period: z.string().max(20).optional(),
  color: z.string().max(20).optional(),
  subject: z.string().max(50).optional(),
  currentGrade: z.string().max(5).optional(),
  gradePercent: z.number().min(0).max(100).optional()
});

/**
 * Authentication middleware
 */
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
    
    // Attach user info to request
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
 * POST /api/classes
 * Create a new class
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedData = createClassSchema.parse(req.body);

    const newClass = await classesService.createClass({
      userId: user.userId,
      ...validatedData
    });

    res.status(201).json({
      success: true,
      data: { class: newClass }
    });
  } catch (error: any) {
    console.error('Create class error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create class'
    });
  }
});

/**
 * GET /api/classes
 * Get all classes for the authenticated user
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classes = await classesService.getUserClasses(user.userId);

    res.status(200).json({
      success: true,
      data: { classes }
    });
  } catch (error: any) {
    console.error('Get classes error:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve classes'
    });
  }
});

/**
 * GET /api/classes/:id
 * Get a specific class by ID
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classId = req.params['id'];

    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'Class ID is required'
      });
    }

    const classData = await classesService.getClassById(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { class: classData }
    });
  } catch (error: any) {
    console.error('Get class error:', error);

    res.status(404).json({
      success: false,
      error: error.message || 'Class not found'
    });
  }
});

/**
 * PATCH /api/classes/:id
 * Update a class
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classId = req.params['id'];

    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'Class ID is required'
      });
    }

    const validatedData = updateClassSchema.parse(req.body);

    const updatedClass = await classesService.updateClass(
      classId,
      user.userId,
      validatedData
    );

    res.status(200).json({
      success: true,
      data: { class: updatedClass }
    });
  } catch (error: any) {
    console.error('Update class error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update class'
    });
  }
});

/**
 * DELETE /api/classes/:id
 * Delete a class
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classId = req.params['id'];

    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'Class ID is required'
      });
    }

    const result = await classesService.deleteClass(classId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete class error:', error);

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete class'
    });
  }
});

export default router;
