/**
 * Audio Service
 * Handles audio file uploads, storage, and transcription management
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:13 AM CST
 * Last Updated: October 31, 2025 9:13 AM CST
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

interface UploadAudioData {
  userId: string;
  classId: string;
  title: string;
  file: Express.Multer.File;
}

interface UpdateAudioData {
  title?: string;
  transcriptStatus?: string;
  transcriptText?: string;
  vectorId?: string;
}

export class AudioService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  /**
   * Upload audio file to Supabase Storage and create database record
   */
  public async uploadAudio(data: UploadAudioData) {
    // Verify class ownership
    const { data: classData, error: classError } = await this.supabase
      .from('classes')
      .select('id')
      .eq('id', data.classId)
      .eq('user_id', data.userId)
      .single();

    if (classError || !classData) {
      throw new Error('Class not found or access denied');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = data.file.originalname.split('.').pop();
    const filename = `${data.userId}/${data.classId}/${timestamp}.${fileExt}`;

    // Upload to Supabase Storage
    const fileBuffer = readFileSync(data.file.path);
    
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('audio-recordings')
      .upload(filename, fileBuffer, {
        contentType: data.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload audio file');
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('audio-recordings')
      .getPublicUrl(filename);

    // Calculate duration (placeholder - would use audio metadata library)
    const durationSeconds = Math.floor(data.file.size / 16000); // Rough estimate

    // Create database record
    const { data: audioRecord, error: dbError } = await this.supabase
      .from('audio_recordings')
      .insert({
        user_id: data.userId,
        class_id: data.classId,
        title: data.title,
        file_url: urlData.publicUrl,
        duration_seconds: durationSeconds,
        transcript_status: 'pending',
        transcript_text: null,
        vector_id: null
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Cleanup: delete uploaded file
      await this.supabase.storage
        .from('audio-recordings')
        .remove([filename]);
      throw new Error('Failed to create audio record');
    }

    return {
      id: audioRecord.id,
      userId: audioRecord.user_id,
      classId: audioRecord.class_id,
      title: audioRecord.title,
      fileUrl: audioRecord.file_url,
      durationSeconds: audioRecord.duration_seconds,
      transcriptStatus: audioRecord.transcript_status,
      transcriptText: audioRecord.transcript_text,
      createdAt: audioRecord.created_at
    };
  }

  /**
   * Get all audio recordings for a class
   */
  public async getClassAudioRecordings(classId: string, userId: string) {
    // Verify class ownership
    const { data: classData } = await this.supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('user_id', userId)
      .single();

    if (!classData) {
      throw new Error('Class not found or access denied');
    }

    const { data: recordings, error } = await this.supabase
      .from('audio_recordings')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get recordings error:', error);
      throw new Error('Failed to retrieve audio recordings');
    }

    return recordings.map(rec => ({
      id: rec.id,
      userId: rec.user_id,
      classId: rec.class_id,
      title: rec.title,
      fileUrl: rec.file_url,
      durationSeconds: rec.duration_seconds,
      transcriptStatus: rec.transcript_status,
      transcriptText: rec.transcript_text,
      vectorId: rec.vector_id,
      createdAt: rec.created_at,
      updatedAt: rec.updated_at
    }));
  }

  /**
   * Get specific audio recording by ID
   */
  public async getAudioById(audioId: string, userId: string) {
    const { data: audio, error } = await this.supabase
      .from('audio_recordings')
      .select('*')
      .eq('id', audioId)
      .eq('user_id', userId)
      .single();

    if (error || !audio) {
      throw new Error('Audio recording not found or access denied');
    }

    return {
      id: audio.id,
      userId: audio.user_id,
      classId: audio.class_id,
      title: audio.title,
      fileUrl: audio.file_url,
      durationSeconds: audio.duration_seconds,
      transcriptStatus: audio.transcript_status,
      transcriptText: audio.transcript_text,
      vectorId: audio.vector_id,
      createdAt: audio.created_at,
      updatedAt: audio.updated_at
    };
  }

  /**
   * Update audio recording metadata or transcript
   */
  public async updateAudio(audioId: string, userId: string, data: UpdateAudioData) {
    // Verify ownership
    const { data: existing } = await this.supabase
      .from('audio_recordings')
      .select('id')
      .eq('id', audioId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Audio recording not found or access denied');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.transcriptStatus !== undefined) updateData.transcript_status = data.transcriptStatus;
    if (data.transcriptText !== undefined) updateData.transcript_text = data.transcriptText;
    if (data.vectorId !== undefined) updateData.vector_id = data.vectorId;

    const { data: updated, error } = await this.supabase
      .from('audio_recordings')
      .update(updateData)
      .eq('id', audioId)
      .select()
      .single();

    if (error) {
      console.error('Update audio error:', error);
      throw new Error('Failed to update audio recording');
    }

    return {
      id: updated.id,
      userId: updated.user_id,
      classId: updated.class_id,
      title: updated.title,
      fileUrl: updated.file_url,
      durationSeconds: updated.duration_seconds,
      transcriptStatus: updated.transcript_status,
      transcriptText: updated.transcript_text,
      vectorId: updated.vector_id,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }

  /**
   * Delete audio recording
   */
  public async deleteAudio(audioId: string, userId: string) {
    // Get audio record
    const { data: audio } = await this.supabase
      .from('audio_recordings')
      .select('file_url, user_id')
      .eq('id', audioId)
      .eq('user_id', userId)
      .single();

    if (!audio) {
      throw new Error('Audio recording not found or access denied');
    }

    // Extract filename from URL
    const url = new URL(audio.file_url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts.slice(-3).join('/'); // user_id/class_id/timestamp.ext

    // Delete from storage
    await this.supabase.storage
      .from('audio-recordings')
      .remove([filename]);

    // Delete database record (cascade will handle related records)
    const { error } = await this.supabase
      .from('audio_recordings')
      .delete()
      .eq('id', audioId);

    if (error) {
      console.error('Delete audio error:', error);
      throw new Error('Failed to delete audio recording');
    }

    return { success: true, message: 'Audio recording deleted successfully' };
  }
}
