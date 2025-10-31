/**
 * Photos API
 * API calls for photo/image management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:40 AM CST
 */

import apiClient from './client';

export interface Photo {
  id: string;
  userId: string;
  classId: string;
  title: string;
  description?: string;
  filePath: string;
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
  extractedText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadPhotoData {
  classId: string;
  title: string;
  description?: string;
  file: File;
}

export const photosApi = {
  /**
   * Upload photo
   */
  upload: async (data: UploadPhotoData): Promise<Photo> => {
    const formData = new FormData();
    formData.append('photo', data.file);
    formData.append('classId', data.classId);
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }

    try {
      const response = await apiClient.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.photo;
    } catch (error) {
      console.error('Failed to upload photo:', error);
      throw error;
    }
  },

  /**
   * Get all photos for a class
   */
  getByClass: async (classId: string): Promise<Photo[]> => {
    try {
      const response = await apiClient.get(`/photos?classId=${classId}`);
      return response.data.data.photos;
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      throw error;
    }
  },

  /**
   * Get specific photo
   */
  getById: async (id: string): Promise<Photo> => {
    try {
      const response = await apiClient.get(`/photos/${id}`);
      return response.data.data.photo;
    } catch (error) {
      console.error('Failed to fetch photo:', error);
      throw error;
    }
  },

  /**
   * Update photo metadata
   */
  update: async (id: string, data: { title?: string; description?: string }): Promise<Photo> => {
    try {
      const response = await apiClient.patch(`/photos/${id}`, data);
      return response.data.data.photo;
    } catch (error) {
      console.error('Failed to update photo:', error);
      throw error;
    }
  },

  /**
   * Delete photo
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/photos/${id}`);
    } catch (error) {
      console.error('Failed to delete photo:', error);
      throw error;
    }
  }
};
