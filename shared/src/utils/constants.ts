/**
 * Little Monster GPA Platform - Application Constants
 * Shared constants used across the application
 */

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const REQUEST_TIMEOUT = 30000; // 30 seconds

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const TOKEN_EXPIRATION = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const PASSWORD_REQUIREMENTS = {
  minLength: MIN_PASSWORD_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
} as const;

// =============================================================================
// RATE LIMITING
// =============================================================================

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  VIDEO_GENERATION_DAILY: 5,
  COMMENTS_PER_HOUR: 20,
  LOGIN_ATTEMPTS: 5,
} as const;

// =============================================================================
// VIDEO GENERATION
// =============================================================================

export const VIDEO_GENERATION = {
  MIN_SCRIPT_LENGTH: 100,
  MAX_SCRIPT_LENGTH: 4000,
  TARGET_DURATION: 120, // 2 minutes in seconds
  MIN_DURATION: 60,
  MAX_DURATION: 300,
  ESTIMATED_GENERATION_TIME: 180, // 3 minutes
} as const;

export const VIDEO_FORMATS = ['mp4', 'webm'] as const;
export const VIDEO_RESOLUTIONS = ['720p', '1080p'] as const;

// =============================================================================
// CONTENT LIMITS
// =============================================================================

export const CONTENT_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  FULLNAME_MIN: 2,
  FULLNAME_MAX: 100,
  EMAIL_MAX: 255,
  VIDEO_TITLE_MIN: 5,
  VIDEO_TITLE_MAX: 200,
  VIDEO_DESCRIPTION_MAX: 2000,
  COMMENT_MIN: 1,
  COMMENT_MAX: 1000,
  EVENT_TITLE_MIN: 3,
  EVENT_TITLE_MAX: 200,
  EVENT_DESCRIPTION_MAX: 1000,
  EVENT_NOTES_MAX: 2000,
} as const;

// =============================================================================
// SUBJECTS AND DIFFICULTIES
// =============================================================================

export const SUBJECTS = [
  'mathematics',
  'chemistry',
  'history',
  'english',
] as const;

export const SUBJECT_LABELS: Record<string, string> = {
  mathematics: 'Mathematics',
  chemistry: 'Chemistry',
  history: 'History',
  english: 'English',
};

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// =============================================================================
// VIDEO STATUS
// =============================================================================

export const VIDEO_STATUSES = ['pending', 'generating', 'ready', 'failed'] as const;

export const VIDEO_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  generating: 'Generating',
  ready: 'Ready',
  failed: 'Failed',
};

// =============================================================================
// COMMENT STATUS
// =============================================================================

export const COMMENT_STATUSES = [
  'pending',
  'approved',
  'flagged',
  'removed',
] as const;

export const COMMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  flagged: 'Flagged',
  removed: 'Removed',
};

// =============================================================================
// EVENT TYPES
// =============================================================================

export const EVENT_TYPES = [
  'study_session',
  'quiz',
  'homework',
  'exam',
  'custom',
] as const;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  study_session: 'Study Session',
  quiz: 'Quiz',
  homework: 'Homework',
  exam: 'Exam',
  custom: 'Custom Event',
};

export const EVENT_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const EVENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// =============================================================================
// USER ROLES
// =============================================================================

export const USER_ROLES = ['student', 'teacher', 'admin'] as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  teacher: 'Teacher',
  admin: 'Administrator',
};

// =============================================================================
// AI CONFIGURATION
// =============================================================================

export const AI_CONFIG = {
  DEFAULT_MODEL: 'llama2-7b',
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  MODERATION_CONFIDENCE_THRESHOLD: 0.85,
} as const;

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

export const CACHE_TTL = {
  USER_SESSION: 3600, // 1 hour
  VIDEO_FEED: 300, // 5 minutes
  VIDEO_DETAIL: 600, // 10 minutes
  USER_STATS: 900, // 15 minutes
  RATING_STATS: 300, // 5 minutes
} as const;

// =============================================================================
// ERROR CODES
// =============================================================================

export const ERROR_CODES = {
  // Authentication Errors (1000-1099)
  UNAUTHORIZED: 'AUTH_1001',
  INVALID_CREDENTIALS: 'AUTH_1002',
  TOKEN_EXPIRED: 'AUTH_1003',
  TOKEN_INVALID: 'AUTH_1004',
  EMAIL_NOT_VERIFIED: 'AUTH_1005',
  ACCOUNT_DISABLED: 'AUTH_1006',

  // Validation Errors (2000-2099)
  VALIDATION_ERROR: 'VAL_2001',
  INVALID_INPUT: 'VAL_2002',
  MISSING_REQUIRED_FIELD: 'VAL_2003',
  INVALID_FORMAT: 'VAL_2004',

  // Resource Errors (3000-3099)
  NOT_FOUND: 'RES_3001',
  ALREADY_EXISTS: 'RES_3002',
  FORBIDDEN: 'RES_3003',
  CONFLICT: 'RES_3004',

  // Rate Limit Errors (4000-4099)
  RATE_LIMIT_EXCEEDED: 'RATE_4001',
  DAILY_LIMIT_EXCEEDED: 'RATE_4002',

  // Server Errors (5000-5099)
  INTERNAL_ERROR: 'SRV_5001',
  DATABASE_ERROR: 'SRV_5002',
  EXTERNAL_SERVICE_ERROR: 'SRV_5003',

  // AI Service Errors (6000-6099)
  AI_GENERATION_FAILED: 'AI_6001',
  AI_MODERATION_FAILED: 'AI_6002',
  AI_SERVICE_UNAVAILABLE: 'AI_6003',
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to email',
  PASSWORD_UPDATED: 'Password updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PREFERENCES_UPDATED: 'Preferences updated successfully',
  VIDEO_CREATED: 'Video generation started',
  VIDEO_UPDATED: 'Video updated successfully',
  VIDEO_DELETED: 'Video deleted successfully',
  COMMENT_CREATED: 'Comment posted successfully',
  COMMENT_UPDATED: 'Comment updated successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  RATING_SUBMITTED: 'Rating submitted successfully',
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
  EVENT_COMPLETED: 'Event marked as completed',
} as const;

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/.+/,
} as const;

// =============================================================================
// DATE FORMATS
// =============================================================================

export const DATE_FORMATS = {
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
} as const;
