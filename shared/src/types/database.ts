/**
 * Little Monster GPA Platform - Database Type Definitions
 * Supabase database schema types
 */

import {
  User,
  Video,
  Comment,
  Rating,
  PlannerEvent,
  UserRole,
  Subject,
  DifficultyLevel,
  VideoStatus,
  CommentStatus,
  EventType,
  EventStatus
} from './index';

// =============================================================================
// DATABASE TABLE TYPES
// =============================================================================

export interface DbUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      videoReady: boolean;
      comments: boolean;
      plannerReminders: boolean;
    };
    defaultSubject: Subject | null;
    defaultDifficulty: DifficultyLevel;
    language: string;
    timezone: string;
  };
  stats: {
    videosGenerated: number;
    videosWatched: number;
    commentsPosted: number;
    studyHours: number;
    streak: number;
    lastActive: string;
  };
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  is_active: boolean;
}

export interface DbVideo {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  topic: string;
  video_url: string | null;
  thumbnail_url: string | null;
  script: string | null;
  metadata: {
    duration: number;
    resolution: string;
    format: string;
    size: number;
    thumbnailUrl: string;
  } | null;
  status: VideoStatus;
  user_id: string;
  view_count: number;
  average_rating: number;
  rating_count: number;
  comment_count: number;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface DbComment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  reply_count: number;
  status: CommentStatus;
  moderation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRating {
  id: string;
  video_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface DbPlannerEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  subject: Subject | null;
  start_time: string;
  end_time: string;
  duration: number;
  status: EventStatus;
  reminder_minutes: number | null;
  video_id: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// DATABASE CONVERSION UTILITIES
// =============================================================================

export function dbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
    fullName: dbUser.full_name,
    role: dbUser.role,
    avatarUrl: dbUser.avatar_url,
    preferences: dbUser.preferences,
    stats: dbUser.stats,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
    emailVerified: dbUser.email_verified,
    isActive: dbUser.is_active
  };
}

export function dbVideoToVideo(dbVideo: DbVideo): Video {
  return {
    id: dbVideo.id,
    title: dbVideo.title,
    description: dbVideo.description,
    subject: dbVideo.subject,
    difficulty: dbVideo.difficulty,
    topic: dbVideo.topic,
    videoUrl: dbVideo.video_url,
    thumbnailUrl: dbVideo.thumbnail_url,
    script: dbVideo.script,
    metadata: dbVideo.metadata,
    status: dbVideo.status,
    userId: dbVideo.user_id,
    viewCount: dbVideo.view_count,
    averageRating: dbVideo.average_rating,
    ratingCount: dbVideo.rating_count,
    commentCount: dbVideo.comment_count,
    generatedAt: dbVideo.generated_at,
    createdAt: dbVideo.created_at,
    updatedAt: dbVideo.updated_at,
    isPublic: dbVideo.is_public
  };
}

export function dbCommentToComment(dbComment: DbComment): Comment {
  return {
    id: dbComment.id,
    videoId: dbComment.video_id,
    userId: dbComment.user_id,
    content: dbComment.content,
    parentId: dbComment.parent_id,
    replyCount: dbComment.reply_count,
    status: dbComment.status,
    moderationReason: dbComment.moderation_reason,
    createdAt: dbComment.created_at,
    updatedAt: dbComment.updated_at
  };
}

export function dbRatingToRating(dbRating: DbRating): Rating {
  return {
    id: dbRating.id,
    videoId: dbRating.video_id,
    userId: dbRating.user_id,
    rating: dbRating.rating,
    createdAt: dbRating.created_at,
    updatedAt: dbRating.updated_at
  };
}

export function dbEventToPlannerEvent(dbEvent: DbPlannerEvent): PlannerEvent {
  return {
    id: dbEvent.id,
    userId: dbEvent.user_id,
    title: dbEvent.title,
    description: dbEvent.description,
    eventType: dbEvent.event_type,
    subject: dbEvent.subject,
    startTime: dbEvent.start_time,
    endTime: dbEvent.end_time,
    duration: dbEvent.duration,
    status: dbEvent.status,
    reminderMinutes: dbEvent.reminder_minutes,
    videoId: dbEvent.video_id,
    isRecurring: dbEvent.is_recurring,
    recurrenceRule: dbEvent.recurrence_rule,
    completedAt: dbEvent.completed_at,
    notes: dbEvent.notes,
    createdAt: dbEvent.created_at,
    updatedAt: dbEvent.updated_at
  };
}

// =============================================================================
// SUPABASE TYPES
// =============================================================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface DatabaseError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbUser, 'id' | 'created_at'>>;
      };
      videos: {
        Row: DbVideo;
        Insert: Omit<DbVideo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbVideo, 'id' | 'created_at'>>;
      };
      comments: {
        Row: DbComment;
        Insert: Omit<DbComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbComment, 'id' | 'created_at'>>;
      };
      ratings: {
        Row: DbRating;
        Insert: Omit<DbRating, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbRating, 'id' | 'created_at'>>;
      };
      planner_events: {
        Row: DbPlannerEvent;
        Insert: Omit<DbPlannerEvent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbPlannerEvent, 'id' | 'created_at'>>;
      };
    };
  };
};
