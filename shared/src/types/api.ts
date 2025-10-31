/**
 * Little Monster GPA Platform - API Type Definitions
 * Request and response types for all API endpoints
 */

import {
  User,
  UserPreferences,
  UserStats,
  Video,
  VideoGenerationRequest,
  VideoFeedFilters,
  Comment,
  Rating,
  VideoRatingStats,
  PlannerEvent,
  EventFilters,
  PaginatedResponse
} from './index';

// =============================================================================
// AUTHENTICATION API TYPES
// =============================================================================

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// =============================================================================
// USER API TYPES
// =============================================================================

export interface UpdateUserProfileRequest {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}

export interface GetUserStatsResponse {
  stats: UserStats;
  recentActivity: {
    videosWatched: Video[];
    commentsPosted: Comment[];
    plannerEvents: PlannerEvent[];
  };
}

// =============================================================================
// VIDEO API TYPES
// =============================================================================

export interface CreateVideoRequest extends VideoGenerationRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface CreateVideoResponse {
  video: Video;
  estimatedCompletionTime: number;
}

export interface UpdateVideoRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface GetVideoFeedRequest extends VideoFeedFilters {
  page?: number;
  pageSize?: number;
}

export interface GetVideoFeedResponse extends PaginatedResponse<Video> {
  filters: VideoFeedFilters;
}

export interface SearchVideosRequest {
  query: string;
  filters?: VideoFeedFilters;
  page?: number;
  pageSize?: number;
}

export interface SearchVideosResponse extends PaginatedResponse<Video> {
  query: string;
  filters?: VideoFeedFilters;
}

// =============================================================================
// COMMENT API TYPES
// =============================================================================

export interface CreateCommentRequest {
  videoId: string;
  content: string;
  parentId?: string;
}

export interface CreateCommentResponse {
  comment: Comment;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface GetCommentsRequest {
  videoId: string;
  parentId?: string;
  page?: number;
  pageSize?: number;
}

export interface GetCommentsResponse extends PaginatedResponse<Comment> {
  videoId: string;
  parentId?: string;
}

export interface ReportCommentRequest {
  reason: string;
  details?: string;
}

export interface ReportCommentResponse {
  message: string;
  reportId: string;
}

// =============================================================================
// RATING API TYPES
// =============================================================================

export interface SubmitRatingRequest {
  videoId: string;
  rating: number;
}

export interface SubmitRatingResponse {
  rating: Rating;
  updatedStats: VideoRatingStats;
}

export interface GetVideoRatingStatsRequest {
  videoId: string;
}

export interface GetVideoRatingStatsResponse {
  stats: VideoRatingStats;
}

export interface GetUserRatingRequest {
  videoId: string;
  userId: string;
}

export interface GetUserRatingResponse {
  rating: Rating | null;
}

// =============================================================================
// PLANNER API TYPES
// =============================================================================

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventType: string;
  subject?: string;
  startTime: string;
  endTime: string;
  reminderMinutes?: number;
  videoId?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  notes?: string;
}

export interface CreateEventResponse {
  event: PlannerEvent;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventType?: string;
  subject?: string;
  startTime?: string;
  endTime?: string;
  reminderMinutes?: number;
  videoId?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  notes?: string;
  status?: string;
}

export interface GetEventsRequest extends EventFilters {
  page?: number;
  pageSize?: number;
}

export interface GetEventsResponse extends PaginatedResponse<PlannerEvent> {
  filters: EventFilters;
}

export interface MarkEventCompleteRequest {
  notes?: string;
}

export interface MarkEventCompleteResponse {
  event: PlannerEvent;
}

// =============================================================================
// AI SERVICE API TYPES
// =============================================================================

export interface GenerateContentRequest {
  subject: string;
  difficulty: string;
  topic: string;
  additionalContext?: string;
}

export interface GenerateContentResponse {
  script: string;
  metadata: {
    generationTime: number;
    modelUsed: string;
    tokensUsed: number;
  };
}

export interface ModerateContentRequest {
  content: string;
  contentType: 'prompt' | 'comment' | 'general';
}

export interface ModerateContentResponse {
  isApproved: boolean;
  confidence: number;
  flags: string[];
  reason: string | null;
}

// =============================================================================
// ERROR RESPONSE TYPES
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationError[] | unknown;
  };
  timestamp: string;
}

// =============================================================================
// HEALTH CHECK TYPES
// =============================================================================

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  services: {
    database: 'ok' | 'down';
    redis: 'ok' | 'down';
    ai: 'ok' | 'down';
  };
  version: string;
}
