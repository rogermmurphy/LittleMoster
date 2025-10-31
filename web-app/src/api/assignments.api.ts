/**
 * Assignments API
 * API calls for assignment management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:41 AM CST
 */

import apiClient from './client';

export interface Assignment {
  id: string;
  userId: string;
  classId: string;
  title: string;
  type?: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentData {
  classId: string;
  title: string;
  type?: string;
  description?: string;
  dueDate: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export interface UpdateAssignmentData {
  title?: string;
  type?: string;
  description?: string;
  dueDate?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export const assignmentsApi = {
  /**
   * Create a new assignment
   */
  create: async (data: CreateAssignmentData): Promise<Assignment> => {
    try {
      const response = await apiClient.post('/assignments', data);
      return response.data.data.assignment;
    } catch (error) {
      console.error('Failed to create assignment:', error);
      throw error;
    }
  },

  /**
   * Get all assignments for a class
   */
  getByClass: async (classId: string): Promise<Assignment[]> => {
    try {
      const response = await apiClient.get(`/assignments?classId=${classId}`);
      return response.data.data.assignments;
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      throw error;
    }
  },

  /**
   * Get specific assignment
   */
  getById: async (id: string): Promise<Assignment> => {
    try {
      const response = await apiClient.get(`/assignments/${id}`);
      return response.data.data.assignment;
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      throw error;
    }
  },

  /**
   * Update assignment
   */
  update: async (id: string, data: UpdateAssignmentData): Promise<Assignment> => {
    try {
      const response = await apiClient.patch(`/assignments/${id}`, data);
      return response.data.data.assignment;
    } catch (error) {
      console.error('Failed to update assignment:', error);
      throw error;
    }
  },

  /**
   * Delete assignment
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/assignments/${id}`);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      throw error;
    }
  }
};
