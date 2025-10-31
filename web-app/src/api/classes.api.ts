/**
 * Classes API
 * API calls for class management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:17 AM CST
 */

import apiClient from './client';

export interface Class {
  id: string;
  userId: string;
  name: string;
  subject?: string;
  teacher?: string;
  schedule?: string;
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassData {
  name: string;
  subject?: string;
  teacher?: string;
  schedule?: string;
  color?: string;
  description?: string;
}

export interface UpdateClassData {
  name?: string;
  subject?: string;
  teacher?: string;
  schedule?: string;
  color?: string;
  description?: string;
}

export const classesApi = {
  /**
   * Get all classes for current user
   */
  getAll: async (): Promise<Class[]> => {
    try {
      const response = await apiClient.get('/classes');
      return response.data.data.classes;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      throw error;
    }
  },

  /**
   * Get a specific class by ID
   */
  getById: async (id: string): Promise<Class> => {
    try {
      const response = await apiClient.get(`/classes/${id}`);
      return response.data.data.class;
    } catch (error) {
      console.error('Failed to fetch class:', error);
      throw error;
    }
  },

  /**
   * Create a new class
   */
  create: async (data: CreateClassData): Promise<Class> => {
    try {
      const response = await apiClient.post('/classes', data);
      return response.data.data.class;
    } catch (error) {
      console.error('Failed to create class:', error);
      throw error;
    }
  },

  /**
   * Update an existing class
   */
  update: async (id: string, data: UpdateClassData): Promise<Class> => {
    try {
      const response = await apiClient.patch(`/classes/${id}`, data);
      return response.data.data.class;
    } catch (error) {
      console.error('Failed to update class:', error);
      throw error;
    }
  },

  /**
   * Delete a class
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/classes/${id}`);
    } catch (error) {
      console.error('Failed to delete class:', error);
      throw error;
    }
  }
};
