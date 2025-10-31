/**
 * Classes Service
 * Handles CRUD operations for student classes
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface CreateClassData {
  userId: string;
  name: string;
  teacherName?: string;
  period?: string;
  color?: string;
  subject?: string;
  currentGrade?: string;
  gradePercent?: number;
}

interface UpdateClassData {
  name?: string;
  teacherName?: string;
  period?: string;
  color?: string;
  subject?: string;
  currentGrade?: string;
  gradePercent?: number;
}

export class ClassesService {
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
   * Create a new class
   */
  public async createClass(data: CreateClassData) {
    // Check if class with same name already exists for this user
    const { data: existingClass } = await this.supabase
      .from('classes')
      .select('id')
      .eq('user_id', data.userId)
      .eq('name', data.name)
      .single();

    if (existingClass) {
      throw new Error('A class with this name already exists');
    }

    // Create class
    const { data: newClass, error } = await this.supabase
      .from('classes')
      .insert({
        user_id: data.userId,
        name: data.name,
        teacher_name: data.teacherName || null,
        period: data.period || null,
        color: data.color || 'bg-blue-500',
        subject: data.subject || null,
        current_grade: data.currentGrade || null,
        grade_percent: data.gradePercent || null
      })
      .select()
      .single();

    if (error) {
      console.error('Create class error:', error);
      throw new Error('Failed to create class');
    }

    return {
      id: newClass.id,
      userId: newClass.user_id,
      name: newClass.name,
      teacherName: newClass.teacher_name,
      period: newClass.period,
      color: newClass.color,
      subject: newClass.subject,
      currentGrade: newClass.current_grade,
      gradePercent: newClass.grade_percent,
      createdAt: newClass.created_at,
      updatedAt: newClass.updated_at
    };
  }

  /**
   * Get all classes for a user
   */
  public async getUserClasses(userId: string) {
    const { data: classes, error } = await this.supabase
      .from('classes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get user classes error:', error);
      throw new Error('Failed to retrieve classes');
    }

    return classes.map(cls => ({
      id: cls.id,
      userId: cls.user_id,
      name: cls.name,
      teacherName: cls.teacher_name,
      period: cls.period,
      color: cls.color,
      subject: cls.subject,
      currentGrade: cls.current_grade,
      gradePercent: cls.grade_percent,
      createdAt: cls.created_at,
      updatedAt: cls.updated_at
    }));
  }

  /**
   * Get a specific class by ID
   */
  public async getClassById(classId: string, userId: string) {
    const { data: cls, error } = await this.supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .eq('user_id', userId)
      .single();

    if (error || !cls) {
      throw new Error('Class not found or access denied');
    }

    return {
      id: cls.id,
      userId: cls.user_id,
      name: cls.name,
      teacherName: cls.teacher_name,
      period: cls.period,
      color: cls.color,
      subject: cls.subject,
      currentGrade: cls.current_grade,
      gradePercent: cls.grade_percent,
      createdAt: cls.created_at,
      updatedAt: cls.updated_at
    };
  }

  /**
   * Update a class
   */
  public async updateClass(classId: string, userId: string, data: UpdateClassData) {
    // Verify ownership
    const { data: existingClass } = await this.supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('user_id', userId)
      .single();

    if (!existingClass) {
      throw new Error('Class not found or access denied');
    }

    // If name is being changed, check for duplicates
    if (data.name) {
      const { data: duplicateClass } = await this.supabase
        .from('classes')
        .select('id')
        .eq('user_id', userId)
        .eq('name', data.name)
        .neq('id', classId)
        .single();

      if (duplicateClass) {
        throw new Error('A class with this name already exists');
      }
    }

    // Update class
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.teacherName !== undefined) updateData.teacher_name = data.teacherName;
    if (data.period !== undefined) updateData.period = data.period;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.subject !== undefined) updateData.subject = data.subject;
    if (data.currentGrade !== undefined) updateData.current_grade = data.currentGrade;
    if (data.gradePercent !== undefined) updateData.grade_percent = data.gradePercent;

    const { data: updatedClass, error } = await this.supabase
      .from('classes')
      .update(updateData)
      .eq('id', classId)
      .select()
      .single();

    if (error) {
      console.error('Update class error:', error);
      throw new Error('Failed to update class');
    }

    return {
      id: updatedClass.id,
      userId: updatedClass.user_id,
      name: updatedClass.name,
      teacherName: updatedClass.teacher_name,
      period: updatedClass.period,
      color: updatedClass.color,
      subject: updatedClass.subject,
      currentGrade: updatedClass.current_grade,
      gradePercent: updatedClass.grade_percent,
      createdAt: updatedClass.created_at,
      updatedAt: updatedClass.updated_at
    };
  }

  /**
   * Delete a class
   */
  public async deleteClass(classId: string, userId: string) {
    // Verify ownership
    const { data: existingClass } = await this.supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('user_id', userId)
      .single();

    if (!existingClass) {
      throw new Error('Class not found or access denied');
    }

    // Delete class (cascade will handle related records)
    const { error } = await this.supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (error) {
      console.error('Delete class error:', error);
      throw new Error('Failed to delete class');
    }

    return { success: true, message: 'Class deleted successfully' };
  }
}
