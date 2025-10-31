/**
 * Notes API
 * API calls for notes management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:41 AM CST
 */

import apiClient from './client';

export interface Note {
  id: string;
  userId: string;
  classId: string;
  title: string;
  content: string;
  sourceType?: 'audio' | 'photo' | 'textbook' | 'manual';
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  classId: string;
  title: string;
  content: string;
  sourceType?: 'audio' | 'photo' | 'textbook' | 'manual';
  sourceId?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}

export const notesApi = {
  /**
   * Create a new note
   */
  create: async (data: CreateNoteData): Promise<Note> => {
    try {
      const response = await apiClient.post('/notes', data);
      return response.data.data.note;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  },

  /**
   * Get all notes for a class
   */
  getByClass: async (classId: string): Promise<Note[]> => {
    try {
      const response = await apiClient.get(`/notes?classId=${classId}`);
      return response.data.data.notes;
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  },

  /**
   * Get specific note
   */
  getById: async (id: string): Promise<Note> => {
    try {
      const response = await apiClient.get(`/notes/${id}`);
      return response.data.data.note;
    } catch (error) {
      console.error('Failed to fetch note:', error);
      throw error;
    }
  },

  /**
   * Update note
   */
  update: async (id: string, data: UpdateNoteData): Promise<Note> => {
    try {
      const response = await apiClient.patch(`/notes/${id}`, data);
      return response.data.data.note;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },

  /**
   * Delete note
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/notes/${id}`);
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  }
};
