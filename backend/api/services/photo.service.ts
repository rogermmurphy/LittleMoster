/**
 * Photo Service
 * Handles photo uploads, storage, and OCR text extraction
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:16 AM CST
 * Last Updated: October 31, 2025 9:16 AM CST
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';

interface UploadPhotoData {
  userId: string;
  classId: string;
  title: string;
  file: Express.Multer.File;
}

interface UpdatePhotoData {
  title?: string;
  extractionStatus?: string;
  extractedText?: string;
  vectorId?: string;
}

export class PhotoService {
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
   * Optimize image for storage (compress, resize if needed)
   */
  private async optimizeImage(filePath: string): Promise<Buffer> {
    return sharp(filePath)
      .resize(2048, 2048, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  }

  /**
   * Extract text from image using Tesseract OCR
   */
  private async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: () => {} // Suppress progress logs
      });
      return text.trim();
    } catch (error) {
      console.error('OCR extraction error:', error);
      return '';
    }
  }

  /**
   * Upload photo file and create database record
   */
  public async uploadPhoto(data: UploadPhotoData) {
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

    // Optimize image
    const optimizedImage = await this.optimizeImage(data.file.path);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${data.userId}/${data.classId}/${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('photos')
      .upload(filename, optimizedImage, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload photo');
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('photos')
      .getPublicUrl(filename);

    // Create database record (OCR will be processed in background)
    const { data: photoRecord, error: dbError } = await this.supabase
      .from('photos')
      .insert({
        user_id: data.userId,
        class_id: data.classId,
        title: data.title,
        image_url: urlData.publicUrl,
        extraction_status: 'pending',
        extracted_text: null,
        vector_id: null
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Cleanup: delete uploaded file
      await this.supabase.storage
        .from('photos')
        .remove([filename]);
      throw new Error('Failed to create photo record');
    }

    // Start OCR extraction in background (async, don't wait)
    this.processOCR(photoRecord.id, optimizedImage).catch(err => {
      console.error('Background OCR failed:', err);
    });

    return {
      id: photoRecord.id,
      userId: photoRecord.user_id,
      classId: photoRecord.class_id,
      title: photoRecord.title,
      imageUrl: photoRecord.image_url,
      extractionStatus: photoRecord.extraction_status,
      extractedText: photoRecord.extracted_text,
      createdAt: photoRecord.created_at
    };
  }

  /**
   * Process OCR extraction in background
   */
  private async processOCR(photoId: string, imageBuffer: Buffer): Promise<void> {
    try {
      // Update status to processing
      await this.supabase
        .from('photos')
        .update({ extraction_status: 'processing' })
        .eq('id', photoId);

      // Extract text
      const extractedText = await this.extractTextFromImage(imageBuffer);

      // Update with extracted text
      await this.supabase
        .from('photos')
        .update({
          extracted_text: extractedText,
          extraction_status: 'complete'
        })
        .eq('id', photoId);

    } catch (error) {
      console.error('OCR processing error:', error);
      // Mark as error
      await this.supabase
        .from('photos')
        .update({ extraction_status: 'error' })
        .eq('id', photoId);
    }
  }

  /**
   * Get all photos for a class
   */
  public async getClassPhotos(classId: string, userId: string) {
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

    const { data: photos, error } = await this.supabase
      .from('photos')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get photos error:', error);
      throw new Error('Failed to retrieve photos');
    }

    return photos.map(photo => ({
      id: photo.id,
      userId: photo.user_id,
      classId: photo.class_id,
      title: photo.title,
      imageUrl: photo.image_url,
      extractionStatus: photo.extraction_status,
      extractedText: photo.extracted_text,
      vectorId: photo.vector_id,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at
    }));
  }

  /**
   * Get specific photo by ID
   */
  public async getPhotoById(photoId: string, userId: string) {
    const { data: photo, error } = await this.supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .eq('user_id', userId)
      .single();

    if (error || !photo) {
      throw new Error('Photo not found or access denied');
    }

    return {
      id: photo.id,
      userId: photo.user_id,
      classId: photo.class_id,
      title: photo.title,
      imageUrl: photo.image_url,
      extractionStatus: photo.extraction_status,
      extractedText: photo.extracted_text,
      vectorId: photo.vector_id,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at
    };
  }

  /**
   * Update photo metadata
   */
  public async updatePhoto(photoId: string, userId: string, data: UpdatePhotoData) {
    // Verify ownership
    const { data: existing } = await this.supabase
      .from('photos')
      .select('id')
      .eq('id', photoId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Photo not found or access denied');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.extractionStatus !== undefined) updateData.extraction_status = data.extractionStatus;
    if (data.extractedText !== undefined) updateData.extracted_text = data.extractedText;
    if (data.vectorId !== undefined) updateData.vector_id = data.vectorId;

    const { data: updated, error } = await this.supabase
      .from('photos')
      .update(updateData)
      .eq('id', photoId)
      .select()
      .single();

    if (error) {
      console.error('Update photo error:', error);
      throw new Error('Failed to update photo');
    }

    return {
      id: updated.id,
      userId: updated.user_id,
      classId: updated.class_id,
      title: updated.title,
      imageUrl: updated.image_url,
      extractionStatus: updated.extraction_status,
      extractedText: updated.extracted_text,
      vectorId: updated.vector_id,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }

  /**
   * Delete photo
   */
  public async deletePhoto(photoId: string, userId: string) {
    // Get photo record
    const { data: photo } = await this.supabase
      .from('photos')
      .select('image_url, user_id')
      .eq('id', photoId)
      .eq('user_id', userId)
      .single();

    if (!photo) {
      throw new Error('Photo not found or access denied');
    }

    // Extract filename from URL
    const url = new URL(photo.image_url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts.slice(-3).join('/'); // user_id/class_id/timestamp.jpg

    // Delete from storage
    await this.supabase.storage
      .from('photos')
      .remove([filename]);

    // Delete database record
    const { error } = await this.supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      console.error('Delete photo error:', error);
      throw new Error('Failed to delete photo');
    }

    return { success: true, message: 'Photo deleted successfully' };
  }
}
