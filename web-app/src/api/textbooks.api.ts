/**
 * Textbooks API
 * API calls for textbook management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:40 AM CST
 */

import apiClient from './client';

export interface Textbook {
  id: string;
  userId: string;
  classId: string;
  title: string;
  author?: string;
  isbn?: string;
  filePath: string;
  pageCount?: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface UploadTextbookData {
  classId: string;
  title: string;
  author?: string;
  isbn?: string;
  file: File;
}

export const textbooksApi = {
  /**
   * Upload textbook PDF
   */
  upload: async (data: UploadTextbookData): Promise<Textbook> => {
    const formData = new FormData();
    formData.append('textbook', data.file);
    formData.append('classId', data.classId);
    formData.append('title', data.title);
    if (data.author) formData.append('author', data.author);
    if (data.isbn) formData.append('isbn', data.isbn);

    try {
      const response = await apiClient.post('/textbooks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.textbook;
    } catch (error) {
      console.error('Failed to upload textbook:', error);
      throw error;
    }
  },

  /**
   * Get all textbooks for a class
   */
  getByClass: async (classId: string): Promise<Textbook[]> => {
    try {
      const response = await apiClient.get(`/textbooks?classId=${classId}`);
      return response.data.data.textbooks;
    } catch (error) {
      console.error('Failed to fetch textbooks:', error);
      throw error;
    }
  },

  /**
   * Get specific textbook
   */
  getById: async (id: string): Promise<Textbook> => {
    try {
      const response = await apiClient.get(`/textbooks/${id}`);
      return response.data.data.textbook;
    } catch (error) {
      console.error('Failed to fetch textbook:', error);
      throw error;
    }
  },

  /**
   * Update textbook metadata
   */
  update: async (id: string, data: { title?: string; author?: string; isbn?: string }): Promise<Textbook> => {
    try {
      const response = await apiClient.patch(`/textbooks/${id}`, data);
      return response.data.data.textbook;
    } catch (error) {
      console.error('Failed to update textbook:', error);
      throw error;
    }
  },

  /**
   * Delete textbook
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/textbooks/${id}`);
    } catch (error) {
      console.error('Failed to delete textbook:', error);
      throw error;
    }
  }
};
