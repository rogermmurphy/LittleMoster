/**
 * Chat Routes
 * Handles AI chat interactions with RAG-based context retrieval
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:01 AM CST
 * Last Updated: October 31, 2025 10:01 AM CST
 */

import { Router, Request, Response } from 'express';
import { ChatService } from '../../ai-services/chat.service';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();
const chatService = new ChatService();
const authService = new AuthService();

// Validation schemas
const chatMessageSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  conversationId: z.string().uuid().optional(),
  includeAudio: z.boolean().optional(),
  includePhotos: z.boolean().optional(),
  includeTextbooks: z.boolean().optional()
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
 * POST /api/chat
 * Send message to AI tutor and get response with sources
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedData = chatMessageSchema.parse(req.body);

    const result = await chatService.chat({
      userId: user.userId,
      ...validatedData
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Chat error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat message'
    });
  }
});

/**
 * GET /api/chat/conversations?classId=xxx
 * List all conversations for a class
 */
router.get('/conversations', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classId = req.query['classId'] as string;

    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'classId query parameter is required'
      });
    }

    const conversations = await chatService.listConversations(user.userId, classId);

    res.status(200).json({
      success: true,
      data: { conversations }
    });
  } catch (error: any) {
    console.error('List conversations error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve conversations'
    });
  }
});

/**
 * GET /api/chat/:conversationId
 * Get conversation history with messages
 */
router.get('/:conversationId', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const conversationId = req.params['conversationId'];

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    const conversation = await chatService.getConversation(conversationId, user.userId);

    res.status(200).json({
      success: true,
      data: { conversation }
    });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Conversation not found'
    });
  }
});

/**
 * DELETE /api/chat/:conversationId
 * Delete conversation and all messages
 */
router.delete('/:conversationId', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const conversationId = req.params['conversationId'];

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    const result = await chatService.deleteConversation(conversationId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete conversation'
    });
  }
});

export default router;
