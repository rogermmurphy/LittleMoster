/**
 * Authentication Routes
 * Handles user registration, login, token refresh
 */

import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();
const authService = new AuthService();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  state: z.string().optional(),
  gradeLevel: z.string().optional(),
  schoolName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const result = await authService.register(validatedData);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user and return tokens
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Login user
    const result = await authService.login(validatedData);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(401).json({
      success: false,
      error: error.message || 'Login failed'
    });
  }
});

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 */
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    // Refresh access token
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(401).json({
      success: false,
      error: error.message || 'Token refresh failed'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token and get user
    const payload = authService.verifyAccessToken(token);
    const user = await authService.getUserById(payload.userId);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Get user error:', error);

    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
});

export default router;
