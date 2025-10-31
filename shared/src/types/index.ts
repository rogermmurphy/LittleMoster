/**
 * Little Monster GPA Platform - Shared Type Definitions
 * Core domain models and interfaces
 */

// =============================================================================
// ENUMS
// =============================================================================

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export enum Subject {
  MATHEMATICS = 'mathematics',
  CHEMISTRY = 'chemistry',
  HISTORY = 'history',
  ENGLISH = 'english'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum VideoStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed'
}

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FLAGGED = 'flagged',
  REMOVED = 'removed'
}

export enum EventType {
  STUDY_SESSION = 'study_session',
  QUIZ = 'quiz',
  HOMEWORK = 'homework',
  EXAM = 'exam',
  CUSTOM = 'custom'
}

export enum EventStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// =============================================================================
// USER TYPES
// =============================================================================

export interface UserPreferences {
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
}

export interface UserStats {
  videosGenerated: number;
  videosWatched: number;
  commentsPosted: number;
  studyHours: number;
  streak: number;
  lastActive: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  stats: UserStats;
}

// =============================================================================
// VIDEO TYPES
// =============================================================================

export interface VideoMetadata {
  duration: number;
  resolution: string;
  format: string;
  size: number;
  thumbnailUrl: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  topic: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  script: string | null;
  metadata: VideoMetadata | null;
  status: VideoStatus;
  userId: string;
  user?: UserProfile;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface VideoGenerationRequest {
  subject: Subject;
  difficulty: DifficultyLevel;
  topic: string;
  additionalContext?: string;
}

export interface VideoFeedFilters {
  subject?: Subject;
  difficulty?: DifficultyLevel;
  sortBy?: 'recent' | 'popular' | 'rating';
  limit?: number;
  cursor?: string;
}

// =============================================================================
// COMMENT TYPES
// =============================================================================

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user?: UserProfile;
  content: string;
  parentId: string | null;
  replies?: Comment[];
  replyCount: number;
  status: CommentStatus;
  moderationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentThread {
  parent: Comment;
  replies: Comment[];
  totalReplies: number;
}

// =============================================================================
// RATING TYPES
// =============================================================================

export interface Rating {
  id: string;
  videoId: string;
  userId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoRatingStats {
  videoId: string;
  averageRating: number;
  ratingCount: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// =============================================================================
// PLANNER TYPES
// =============================================================================

export interface PlannerEvent {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  eventType: EventType;
  subject: Subject | null;
  startTime: string;
  endTime: string;
  duration: number;
  status: EventStatus;
  reminderMinutes: number | null;
  videoId: string | null;
  video?: Video;
  isRecurring: boolean;
  recurrenceRule: string | null;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  startDate?: string;
  endDate?: string;
  status?: EventStatus;
  eventType?: EventType;
  subject?: Subject;
}

// =============================================================================
// AI TYPES
// =============================================================================

export interface AIGenerationConfig {
  modelName: string;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export interface ContentModerationResult {
  isApproved: boolean;
  confidence: number;
  flags: string[];
  reason: string | null;
}

export interface VideoScriptSection {
  type: 'intro' | 'explanation' | 'example' | 'summary';
  content: string;
  duration: number;
}

export interface GeneratedScript {
  title: string;
  sections: VideoScriptSection[];
  totalDuration: number;
  metadata: {
    subject: Subject;
    difficulty: DifficultyLevel;
    topic: string;
    keywords: string[];
  };
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'username' in obj
  );
}

export function isVideo(obj: unknown): obj is Video {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'subject' in obj
  );
}

export function isComment(obj: unknown): obj is Comment {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'videoId' in obj &&
    'content' in obj
  );
}
