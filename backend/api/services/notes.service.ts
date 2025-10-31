/**
 * Notes Service
 * Handles CRUD operations for student notes with source tracking
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:36 AM CST
 * Last Updated: October 31, 2025 10:36 AM CST
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface CreateNoteData {
  userId: string;
  classId: string;
  title: string;
  content: string;
  noteType?: string;
  isAiGenerated?: boolean;
  sources?: Array<{
    sourceType: string;
    sourceId: string;
  }>;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
  noteType?: string;
}

export class NotesService {
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
   * Create a new note
   */
  public async createNote(data: CreateNoteData) {
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

    // Create note
    const { data: newNote, error } = await this.supabase
      .from('notes')
      .insert({
        user_id: data.userId,
        class_id: data.classId,
        title: data.title,
        content: data.content,
        note_type: data.noteType || 'manual',
        is_ai_generated: data.isAiGenerated || false,
        vector_id: null
      })
      .select()
      .single();

    if (error) {
      console.error('Create note error:', error);
      throw new Error('Failed to create note');
    }

    // Add note sources if provided
    if (data.sources && data.sources.length > 0) {
      const sourceRecords = data.sources.map(source => ({
        note_id: newNote.id,
        source_type: source.sourceType,
        source_id: source.sourceId
      }));

      await this.supabase.from('note_sources').insert(sourceRecords);
    }

    return {
      id: newNote.id,
      userId: newNote.user_id,
      classId: newNote.class_id,
      title: newNote.title,
      content: newNote.content,
      noteType: newNote.note_type,
      isAiGenerated: newNote.is_ai_generated,
      vectorId: newNote.vector_id,
      createdAt: newNote.created_at,
      updatedAt: newNote.updated_at
    };
  }

  /**
   * Get all notes for a class
   */
  public async getClassNotes(classId: string, userId: string) {
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

    const { data: notes, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get notes error:', error);
      throw new Error('Failed to retrieve notes');
    }

    return notes.map(note => ({
      id: note.id,
      userId: note.user_id,
      classId: note.class_id,
      title: note.title,
      content: note.content,
      noteType: note.note_type,
      isAiGenerated: note.is_ai_generated,
      vectorId: note.vector_id,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));
  }

  /**
   * Get specific note by ID with sources
   */
  public async getNoteById(noteId: string, userId: string) {
    const { data: note, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', userId)
      .single();

    if (error || !note) {
      throw new Error('Note not found or access denied');
    }

    // Get note sources
    const { data: sources } = await this.supabase
      .from('note_sources')
      .select('*')
      .eq('note_id', noteId);

    return {
      id: note.id,
      userId: note.user_id,
      classId: note.class_id,
      title: note.title,
      content: note.content,
      noteType: note.note_type,
      isAiGenerated: note.is_ai_generated,
      vectorId: note.vector_id,
      sources: sources || [],
      createdAt: note.created_at,
      updatedAt: note.updated_at
    };
  }

  /**
   * Update note
   */
  public async updateNote(noteId: string, userId: string, data: UpdateNoteData) {
    // Verify ownership
    const { data: existing } = await this.supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Note not found or access denied');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.noteType !== undefined) updateData.note_type = data.noteType;

    const { data: updated, error } = await this.supabase
      .from('notes')
      .update(updateData)
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Update note error:', error);
      throw new Error('Failed to update note');
    }

    return {
      id: updated.id,
      userId: updated.user_id,
      classId: updated.class_id,
      title: updated.title,
      content: updated.content,
      noteType: updated.note_type,
      isAiGenerated: updated.is_ai_generated,
      vectorId: updated.vector_id,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }

  /**
   * Delete note
   */
  public async deleteNote(noteId: string, userId: string) {
    // Verify ownership
    const { data: existing } = await this.supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Note not found or access denied');
    }

    // Delete note (cascade will delete note_sources)
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Delete note error:', error);
      throw new Error('Failed to delete note');
    }

    return { success: true, message: 'Note deleted successfully' };
  }
}
