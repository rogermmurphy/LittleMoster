/**
 * Assignments Routes
 * Handles assignment CRUD operations
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:38 AM CST
 * Last Updated: October 31, 2025 10:38 AM CST
 */

import { Router, Request, Response } from 'express';
import { AssignmentsService } from '../services/assignments.service';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();
const assignmentsService = new AssignmentsService();
const authService = new AuthService();

// Validation schemas
const createAssignmentSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  title: z.string().min(1, 'Title is required').max(200),
  type: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string(), // ISO date string
  status: z.enum(['pending', 'in-progress', 'completed', 'overdue']).optional()
});

const updateAssignmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'overdue']).optional()
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
 * POST /api/assignments
 * Create a new assignment
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedData = createAssignmentSchema.parse(req.body);

    const result = await assignmentsService.createAssignment({
      userId: user.userId,
      ...validatedData
    });

    res.status(201).json({
      success: true,
      data: { assignment: result }
    });
  } catch (error: any) {
    console.error('Create assignment error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create assignment'
    });
  }
});

/**
 * GET /api/assignments?classId=xxx
 * Get all assignments for a class
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

    const assignments = await assignmentsService.getClassAssignments(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { assignments }
    });
  } catch (error: any) {
    console.error('Get assignments error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to retrieve assignments'
    });
  }
});

/**
 * GET /api/assignments/:id
 * Get specific assignment
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const assignmentId = req.params['id'];

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const assignment = await assignmentsService.getAssignmentById(assignmentId, user.userId);

    res.status(200).json({
      success: true,
      data: { assignment }
    });
  } catch (error: any) {
    console.error('Get assignment error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Assignment not found'
    });
  }
});

/**
 * PATCH /api/assignments/:id
 * Update assignment
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const assignmentId = req.params['id'];

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const validatedData = updateAssignmentSchema.parse(req.body);
    const updated = await assignmentsService.updateAssignment(assignmentId, user.userId, validatedData);

    res.status(200).json({
      success: true,
      data: { assignment: updated }
    });
  } catch (error: any) {
    console.error('Update assignment error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update assignment'
    });
  }
});

/**
 * DELETE /api/assignments/:id
 * Delete assignment
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const assignmentId = req.params['id'];

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const result = await assignmentsService.deleteAssignment(assignmentId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete assignment error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete assignment'
    });
  }
});

export default router;
