/**
 * Chat API
 * API calls for AI chat with RAG
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:41 AM CST
 */

import apiClient from './client';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  createdAt: string;
}

export interface ChatSource {
  type: 'audio' | 'photo' | 'textbook';
  id: string;
  title: string;
  excerpt?: string;
  pageNumber?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  classId: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface SendMessageData {
  classId: string;
  conversationId?: string;
  message: string;
}

export const chatApi = {
  /**
   * Send a message and get AI response
   */
  sendMessage: async (data: SendMessageData): Promise<{ message: ChatMessage; conversation: Conversation }> => {
    try {
      const response = await apiClient.post('/chat', data);
      return {
        message: response.data.data.message,
        conversation: response.data.data.conversation
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  /**
   * Get all conversations for a class
   */
  getConversations: async (classId: string): Promise<Conversation[]> => {
    try {
      const response = await apiClient.get(`/chat/conversations?classId=${classId}`);
      return response.data.data.conversations;
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw error;
    }
  },

  /**
   * Get messages for a specific conversation
   */
  getConversation: async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      const response = await apiClient.get(`/chat/${conversationId}`);
      return response.data.data.messages;
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (conversationId: string): Promise<void> => {
    try {
      await apiClient.delete(`/chat/${conversationId}`);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  }
};
