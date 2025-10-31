/**
 * Audio API
 * API calls for audio recording management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:40 AM CST
 */

import apiClient from './client';

export interface AudioRecording {
  id: string;
  userId: string;
  classId: string;
  title: string;
  description?: string;
  filePath: string;
  duration?: number;
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  transcript?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadAudioData {
  classId: string;
  title: string;
  description?: string;
  file: File;
}

export const audioApi = {
  /**
   * Upload audio recording
   */
  upload: async (data: UploadAudioData): Promise<AudioRecording> => {
    const formData = new FormData();
    formData.append('audio', data.file);
    formData.append('classId', data.classId);
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }

    try {
      const response = await apiClient.post('/audio/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.audio;
    } catch (error) {
      console.error('Failed to upload audio:', error);
      throw error;
    }
  },

  /**
   * Get all audio recordings for a class
   */
  getByClass: async (classId: string): Promise<AudioRecording[]> => {
    try {
      const response = await apiClient.get(`/audio?classId=${classId}`);
      return response.data.data.recordings;
    } catch (error) {
      console.error('Failed to fetch audio recordings:', error);
      throw error;
    }
  },

  /**
   * Get specific audio recording
   */
  getById: async (id: string): Promise<AudioRecording> => {
    try {
      const response = await apiClient.get(`/audio/${id}`);
      return response.data.data.audio;
    } catch (error) {
      console.error('Failed to fetch audio recording:', error);
      throw error;
    }
  },

  /**
   * Update audio recording metadata
   */
  update: async (id: string, data: { title?: string; description?: string }): Promise<AudioRecording> => {
    try {
      const response = await apiClient.patch(`/audio/${id}`, data);
      return response.data.data.audio;
    } catch (error) {
      console.error('Failed to update audio recording:', error);
      throw error;
    }
  },

  /**
   * Delete audio recording
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/audio/${id}`);
    } catch (error) {
      console.error('Failed to delete audio recording:', error);
      throw error;
    }
  }
};
