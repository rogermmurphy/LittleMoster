/**
 * Textbook Service
 * Handles PDF textbook uploads, parsing, and storage
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:37 AM CST
 * Last Updated: October 31, 2025 9:37 AM CST
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as pdfParse from 'pdf-parse';

interface UploadTextbookData {
  userId: string;
  classId: string;
  title: string;
  author?: string;
  isbn?: string;
  file: Express.Multer.File;
}

interface UpdateTextbookData {
  title?: string;
  author?: string;
  isbn?: string;
  embeddingStatus?: string;
  totalChunks?: number;
}

export class TextbookService {
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
   * Upload PDF textbook and extract metadata
   */
  public async uploadTextbook(data: UploadTextbookData) {
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

    // Read PDF file
    const pdfBuffer = readFileSync(data.file.path);
    
    // Extract PDF metadata
    let pageCount = 0;
    try {
      const pdfData = await pdfParse(pdfBuffer);
      pageCount = pdfData.numpages;
    } catch (error) {
      console.error('PDF parse error:', error);
      // Continue with upload even if parsing fails
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${data.userId}/${data.classId}/${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('textbooks')
      .upload(filename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload textbook');
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('textbooks')
      .getPublicUrl(filename);

    // Create database record
    const { data: textbookRecord, error: dbError } = await this.supabase
      .from('textbook_downloads')
      .insert({
        user_id: data.userId,
        class_id: data.classId,
        title: data.title,
        author: data.author || null,
        isbn: data.isbn || null,
        file_url: urlData.publicUrl,
        file_type: 'pdf',
        file_size_bytes: data.file.size,
        page_count: pageCount,
        total_chunks: 0,
        embedding_status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Cleanup: delete uploaded file
      await this.supabase.storage
        .from('textbooks')
        .remove([filename]);
      throw new Error('Failed to create textbook record');
    }

    return {
      id: textbookRecord.id,
      userId: textbookRecord.user_id,
      classId: textbookRecord.class_id,
      title: textbookRecord.title,
      author: textbookRecord.author,
      isbn: textbookRecord.isbn,
      fileUrl: textbookRecord.file_url,
      fileSizeBytes: textbookRecord.file_size_bytes,
      pageCount: textbookRecord.page_count,
      totalChunks: textbookRecord.total_chunks,
      embeddingStatus: textbookRecord.embedding_status,
      createdAt: textbookRecord.created_at
    };
  }

  /**
   * Get all textbooks for a class
   */
  public async getClassTextbooks(classId: string, userId: string) {
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

    const { data: textbooks, error } = await this.supabase
      .from('textbook_downloads')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get textbooks error:', error);
      throw new Error('Failed to retrieve textbooks');
    }

    return textbooks.map(tb => ({
      id: tb.id,
      userId: tb.user_id,
      classId: tb.class_id,
      title: tb.title,
      author: tb.author,
      isbn: tb.isbn,
      fileUrl: tb.file_url,
      fileSizeBytes: tb.file_size_bytes,
      pageCount: tb.page_count,
      totalChunks: tb.total_chunks,
      embeddingStatus: tb.embedding_status,
      createdAt: tb.created_at,
      updatedAt: tb.updated_at
    }));
  }

  /**
   * Get specific textbook by ID
   */
  public async getTextbookById(textbookId: string, userId: string) {
    const { data: textbook, error } = await this.supabase
      .from('textbook_downloads')
      .select('*')
      .eq('id', textbookId)
      .eq('user_id', userId)
      .single();

    if (error || !textbook) {
      throw new Error('Textbook not found or access denied');
    }

    return {
      id: textbook.id,
      userId: textbook.user_id,
      classId: textbook.class_id,
      title: textbook.title,
      author: textbook.author,
      isbn: textbook.isbn,
      fileUrl: textbook.file_url,
      fileSizeBytes: textbook.file_size_bytes,
      pageCount: textbook.page_count,
      totalChunks: textbook.total_chunks,
      embeddingStatus: textbook.embedding_status,
      createdAt: textbook.created_at,
      updatedAt: textbook.updated_at
    };
  }

  /**
   * Update textbook metadata
   */
  public async updateTextbook(textbookId: string, userId: string, data: UpdateTextbookData) {
    // Verify ownership
    const { data: existing } = await this.supabase
      .from('textbook_downloads')
      .select('id')
      .eq('id', textbookId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Textbook not found or access denied');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.isbn !== undefined) updateData.isbn = data.isbn;
    if (data.embeddingStatus !== undefined) updateData.embedding_status = data.embeddingStatus;
    if (data.totalChunks !== undefined) updateData.total_chunks = data.totalChunks;

    const { data: updated, error } = await this.supabase
      .from('textbook_downloads')
      .update(updateData)
      .eq('id', textbookId)
      .select()
      .single();

    if (error) {
      console.error('Update textbook error:', error);
      throw new Error('Failed to update textbook');
    }

    return {
      id: updated.id,
      userId: updated.user_id,
      classId: updated.class_id,
      title: updated.title,
      author: updated.author,
      isbn: updated.isbn,
      fileUrl: updated.file_url,
      fileSizeBytes: updated.file_size_bytes,
      pageCount: updated.page_count,
      totalChunks: updated.total_chunks,
      embeddingStatus: updated.embedding_status,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }

  /**
   * Delete textbook
   */
  public async deleteTextbook(textbookId: string, userId: string) {
    // Get textbook record
    const { data: textbook } = await this.supabase
      .from('textbook_downloads')
      .select('file_url, user_id')
      .eq('id', textbookId)
      .eq('user_id', userId)
      .single();

    if (!textbook) {
      throw new Error('Textbook not found or access denied');
    }

    // Extract filename from URL
    const url = new URL(textbook.file_url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts.slice(-3).join('/');

    // Delete from storage
    await this.supabase.storage
      .from('textbooks')
      .remove([filename]);

    // Delete database record
    const { error } = await this.supabase
      .from('textbook_downloads')
      .delete()
      .eq('id', textbookId);

    if (error) {
      console.error('Delete textbook error:', error);
      throw new Error('Failed to delete textbook');
    }

    return { success: true, message: 'Textbook deleted successfully' };
  }
}
