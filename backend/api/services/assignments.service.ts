/**
 * Assignments Service
 * Handles CRUD operations for student assignments
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:38 AM CST
 * Last Updated: October 31, 2025 10:38 AM CST
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface CreateAssignmentData {
  userId: string;
  classId: string;
  title: string;
  type?: string;
  description?: string;
  dueDate: string;
  status?: string;
}

interface UpdateAssignmentData {
  title?: string;
  type?: string;
  description?: string;
  dueDate?: string;
  status?: string;
}

export class AssignmentsService {
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

  public async createAssignment(data: CreateAssignmentData) {
    const { data: classData, error: classError } = await this.supabase
      .from('classes')
      .select('id')
      .eq('id', data.classId)
      .eq('user_id', data.userId)
      .single();

    if (classError || !classData) {
      throw new Error('Class not found or access denied');
    }

    const { data: newAssignment, error } = await this.supabase
      .from('assignments')
      .insert({
        user_id: data.userId,
        class_id: data.classId,
        title: data.title,
        type: data.type || null,
        description: data.description || null,
        due_date: data.dueDate,
        status: data.status || 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Create assignment error:', error);
      throw new Error('Failed to create assignment');
    }

    return {
      id: newAssignment.id,
      userId: newAssignment.user_id,
      classId: newAssignment.class_id,
      title: newAssignment.title,
      type: newAssignment.type,
      description: newAssignment.description,
      dueDate: newAssignment.due_date,
      status: newAssignment.status,
      createdAt: newAssignment.created_at,
      updatedAt: newAssignment.updated_at
    };
  }

  public async getClassAssignments(classId: string, userId: string) {
    const { data: classData } = await this.supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('user_id', userId)
      .single();

    if (!classData) {
      throw new Error('Class not found or access denied');
    }

    const { data: assignments, error } = await this.supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Get assignments error:', error);
      throw new Error('Failed to retrieve assignments');
    }

    return assignments.map(a => ({
      id: a.id,
      userId: a.user_id,
      classId: a.class_id,
      title: a.title,
      type: a.type,
      description: a.description,
      dueDate: a.due_date,
      status: a.status,
      createdAt: a.created_at,
      updatedAt: a.updated_at
    }));
  }

  public async getAssignmentById(assignmentId: string, userId: string) {
    const { data: assignment, error } = await this.supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .eq('user_id', userId)
      .single();

    if (error || !assignment) {
      throw new Error('Assignment not found or access denied');
    }

    return {
      id: assignment.id,
      userId: assignment.user_id,
      classId: assignment.class_id,
      title: assignment.title,
      type: assignment.type,
      description: assignment.description,
      dueDate: assignment.due_date,
      status: assignment.status,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at
    };
  }

  public async updateAssignment(assignmentId: string, userId: string, data: UpdateAssignmentData) {
    const { data: existing } = await this.supabase
      .from('assignments')
      .select('id')
      .eq('id', assignmentId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Assignment not found or access denied');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
    if (data.status !== undefined) updateData.status = data.status;

    const { data: updated, error } = await this.supabase
      .from('assignments')
      .update(updateData)
      .eq('id', assignmentId)
      .select()
      .single();

    if (error) {
      console.error('Update assignment error:', error);
      throw new Error('Failed to update assignment');
    }

    return {
      id: updated.id,
      userId: updated.user_id,
      classId: updated.class_id,
      title: updated.title,
      type: updated.type,
      description: updated.description,
      dueDate: updated.due_date,
      status: updated.status,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }

  public async deleteAssignment(assignmentId: string, userId: string) {
    const { data: existing } = await this.supabase
      .from('assignments')
      .select('id')
      .eq('id', assignmentId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      throw new Error('Assignment not found or access denied');
    }

    const { error } = await this.supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) {
      console.error('Delete assignment error:', error);
      throw new Error('Failed to delete assignment');
    }

    return { success: true, message: 'Assignment deleted successfully' };
  }
}
