<!--
  Little Monster GPA Study Platform
  Master Implementation Plan
  
  Author: Ella K. Murphy (ella.k.murphy@gmail.com)
  Created: October 30, 2025
  Last Updated: October 31, 2025 9:15 AM CST
  Version: 2.0
  Status: Phase 1.1 Complete ✅ | Phase 1.2 In Progress 🚀
  
  This is a LIVING DOCUMENT - Update as implementation progresses
-->

# Implementation Plan

## Progress Summary (October 31, 2025)

**✅ Phase 1.1 COMPLETE:**
- Database: 16 tables deployed to Supabase
- Authentication API: 4 endpoints tested ✅
- Classes CRUD API: 5 endpoints tested ✅
- Test Results: 8/8 passed (100%)
- Git Commit: c60e3f4

**🚀 Phase 1.2 IN PROGRESS (Week 1 Day 1):**
- Audio API: 5 endpoints built (ready to test)
- Next: Photo API, Whisper, Vector DB, AI Chat

## [Overview]
Create the foundational infrastructure for the Little Monster GPA study platform Phase 1, including Supabase backend, authentication system, core database schema, and self-hosted LLM integration framework.

This implementation establishes the complete backend architecture using Supabase (PostgreSQL), authentication services, real-time data synchronization, and the foundation for AI-powered video generation. The scope covers the entire Phase 1 deliverables from the project plan: backend infrastructure setup, user authentication system, core database schema deployment, API framework establishment, and security protocols implementation. This foundation will support 100+ concurrent users and provide the scalable architecture needed for the subsequent web, mobile, and desktop application development phases.

The implementation follows an open-source, privacy-first approach using Supabase for backend services and prepares infrastructure for self-hosted LLM deployment. All systems are designed with cross-platform compatibility in mind, supporting the future development of React web applications, React Native mobile apps, and Electron desktop applications.

## [Types]
Define comprehensive TypeScript interfaces and types for the entire application data model and API contracts.

```typescript
// Core Domain Types
export type Subject = 'Math' | 'Chemistry' | 'History' | 'English';
export type DifficultyLevel = 'Intro' | 'Standard' | 'Honors';
export type VideoStatus = 'PENDING' | 'PROCESSING' | 'PUBLIC' | 'REJECTED';
export type EventType = 'assignment' | 'study' | 'exam' | 'project';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// User Management Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarColor: string;
  subjects: Subject[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

export interface UserPreferences {
  themeAccent: string;
  lmColor: string;
  notificationsEnabled: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
  language: string;
}

// Content Types
export interface Video {
  id: string;
  title: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  topic: string;
  createdBy: string; // user ID
  status: VideoStatus;
  
  // Content
  scriptSummary: string;
  keyPoints: string[];
  timestamps: number[];
  
  // Media
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // seconds
  
  // Engagement
  ratingAvg: number;
  ratingCount: number;
  viewCount: number;
  commentCount: number;
  
  // Metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  text: string;
  isHidden: boolean;
  createdAt: string;
  moderationStatus: ModerationStatus;
  moderationReason?: string;
}

export interface Rating {
  id: string;
  videoId: string;
  userId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: Subject;
  type: EventType;
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response Types
export interface VideoGenerationRequest {
  topic: string;
  subject: Subject;
  difficulty?: DifficultyLevel;
  userId: string;
}

export interface VideoGenerationResponse {
  videoId: string;
  status: 'PENDING' | 'PROCESSING';
  estimatedCompletionTime?: number;
}

export interface ModerationRequest {
  type: 'prompt' | 'comment';
  content: string;
  context?: {
    subject?: Subject;
    videoId?: string;
  };
}

export interface ModerationResponse {
  approved: boolean;
  confidence: number;
  reasons?: string[];
}

export interface VideoFeedFilters {
  subject?: Subject;
  difficulty?: DifficultyLevel;
  sort: 'recent' | 'popular' | 'rating';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// Database Row Types (Supabase specific)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<User, 'id' | 'createdAt'>>;
      };
      videos: {
        Row: Video;
        Insert: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Video, 'id' | 'createdAt'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'createdAt'>;
        Update: Partial<Omit<Comment, 'id' | 'createdAt'>>;
      };
      ratings: {
        Row: Rating;
        Insert: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Rating, 'id' | 'createdAt'>>;
      };
      planner_events: {
        Row: PlannerEvent;
        Insert: Omit<PlannerEvent, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<PlannerEvent, 'id' | 'createdAt'>>;
      };
    };
  };
}
```

## [Files]
Establish complete project structure with backend services, shared types, and infrastructure configuration files.

**New Files to Create:**

**Backend Infrastructure:**
- `backend/supabase/config.toml` - Supabase project configuration
- `backend/supabase/seed.sql` - Database initialization and seed data
- `backend/database/schema.sql` - Complete database schema definitions
- `backend/database/migrations/001_initial_schema.sql` - Initial migration
- `backend/database/migrations/002_rls_policies.sql` - Row Level Security policies
- `backend/database/functions/update_video_rating.sql` - Database function for rating aggregation
- `backend/database/functions/moderate_content.sql` - Content moderation triggers

**API Services:**
- `backend/api/index.ts` - Main API server entry point
- `backend/api/routes/auth.ts` - Authentication endpoints
- `backend/api/routes/videos.ts` - Video management endpoints
- `backend/api/routes/users.ts` - User management endpoints
- `backend/api/routes/comments.ts` - Comment system endpoints
- `backend/api/routes/ratings.ts` - Rating system endpoints
- `backend/api/routes/planner.ts` - Study planner endpoints
- `backend/api/middleware/auth.ts` - Authentication middleware
- `backend/api/middleware/validation.ts` - Request validation middleware
- `backend/api/middleware/rateLimit.ts` - Rate limiting middleware

**AI Services:**
- `backend/ai-services/llm-manager.ts` - LLM instance management
- `backend/ai-services/content-generator.ts` - Video content generation
- `backend/ai-services/moderator.ts` - Content moderation service
- `backend/ai-services/models/llama-config.ts` - Llama model configuration
- `backend/ai-services/models/mistral-config.ts` - Mistral model configuration
- `backend/ai-services/utils/prompt-templates.ts` - AI prompt templates

**Shared Types and Utilities:**
- `shared/types/index.ts` - All TypeScript type definitions
- `shared/types/database.ts` - Database-specific types
- `shared/types/api.ts` - API request/response types
- `shared/utils/validation.ts` - Data validation utilities
- `shared/utils/constants.ts` - Application constants
- `shared/api-client/index.ts` - Shared API client
- `shared/api-client/supabase.ts` - Supabase client configuration

**Configuration Files:**
- `backend/package.json` - Node.js dependencies and scripts
- `backend/tsconfig.json` - TypeScript configuration
- `backend/.env.example` - Environment variable template
- `backend/docker-compose.yml` - Local development environment
- `backend/Dockerfile` - API container configuration
- `ai-infrastructure/docker-compose.yml` - LLM services container setup
- `ai-infrastructure/models/download-models.sh` - Model download script
- `ai-infrastructure/config/llama-server.conf` - Llama server configuration

**Testing Infrastructure:**
- `backend/tests/setup.ts` - Test environment setup
- `backend/tests/auth.test.ts` - Authentication tests
- `backend/tests/videos.test.ts` - Video management tests
- `backend/tests/database.test.ts` - Database operation tests
- `backend/tests/ai-services.test.ts` - AI service integration tests

**DevOps and Monitoring:**
- `devops/docker-compose.prod.yml` - Production environment setup
- `devops/nginx.conf` - Reverse proxy configuration
- `devops/monitoring/prometheus.yml` - Metrics configuration
- `devops/scripts/deploy.sh` - Deployment automation script
- `devops/scripts/backup-db.sh` - Database backup script

**Documentation:**
- `docs/api-documentation.md` - Complete API endpoint documentation
- `docs/database-schema.md` - Database design documentation
- `docs/deployment-guide.md` - Infrastructure deployment guide
- `docs/ai-integration-guide.md` - LLM setup and configuration guide

**Files to Modify:**
- Update existing `docs/project-plan-wbs.md` to add Phase 1 completion checkpoints
- Update `.clinerules/lm-gpa-project-standards.md` to include backend development standards

**No Files to Delete:**
All existing documentation files remain as reference material.

## [Functions]
Implement comprehensive backend API functions and database operations for user management, content handling, and AI integration.

**New Functions to Create:**

**Authentication Service (backend/api/routes/auth.ts):**
- `registerUser(email: string, password: string, displayName: string): Promise<AuthResponse>` - User registration with email verification
- `loginUser(email: string, password: string): Promise<AuthResponse>` - User authentication and token generation
- `logoutUser(token: string): Promise<void>` - Session invalidation
- `refreshToken(refreshToken: string): Promise<AuthResponse>` - Token refresh mechanism
- `verifyEmail(token: string): Promise<boolean>` - Email verification process
- `resetPassword(email: string): Promise<void>` - Password reset initiation
- `updatePassword(token: string, newPassword: string): Promise<boolean>` - Password update with token

**User Management (backend/api/routes/users.ts):**
- `getUserProfile(userId: string): Promise<User>` - Retrieve user profile information
- `updateUserProfile(userId: string, updates: Partial<User>): Promise<User>` - Update user profile data
- `getUserPreferences(userId: string): Promise<UserPreferences>` - Get user preferences
- `updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences>` - Update preferences
- `deleteUser(userId: string): Promise<void>` - Account deletion with data cleanup
- `getUserStats(userId: string): Promise<UserStats>` - User activity and progress statistics

**Video Management (backend/api/routes/videos.ts):**
- `createVideoRequest(request: VideoGenerationRequest): Promise<VideoGenerationResponse>` - Initiate video generation
- `getVideoById(videoId: string): Promise<Video>` - Retrieve single video details
- `getVideoFeed(filters: VideoFeedFilters, pagination: PaginationParams): Promise<PaginatedResponse<Video>>` - Get filtered video list
- `updateVideoStatus(videoId: string, status: VideoStatus): Promise<Video>` - Update video processing status
- `incrementViewCount(videoId: string): Promise<void>` - Track video views
- `deleteVideo(videoId: string, userId: string): Promise<void>` - Video deletion with ownership check
- `searchVideos(query: string, filters: VideoFeedFilters): Promise<Video[]>` - Video search functionality

**Comment System (backend/api/routes/comments.ts):**
- `createComment(videoId: string, userId: string, text: string): Promise<Comment>` - Add comment with moderation
- `getVideoComments(videoId: string, pagination: PaginationParams): Promise<PaginatedResponse<Comment>>` - Retrieve video comments
- `updateComment(commentId: string, userId: string, text: string): Promise<Comment>` - Edit existing comment
- `deleteComment(commentId: string, userId: string): Promise<void>` - Comment deletion with ownership check
- `reportComment(commentId: string, userId: string, reason: string): Promise<void>` - Report inappropriate comment
- `moderateComment(commentId: string, action: ModerationAction): Promise<Comment>` - Admin moderation action

**Rating System (backend/api/routes/ratings.ts):**
- `submitRating(videoId: string, userId: string, stars: number): Promise<Rating>` - Submit or update video rating
- `getUserRating(videoId: string, userId: string): Promise<Rating | null>` - Get user's rating for video
- `getVideoRatingStats(videoId: string): Promise<RatingStats>` - Get aggregated rating statistics
- `deleteRating(videoId: string, userId: string): Promise<void>` - Remove user rating

**Study Planner (backend/api/routes/planner.ts):**
- `createEvent(userId: string, event: Omit<PlannerEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<PlannerEvent>` - Create planner event
- `getUserEvents(userId: string, startDate: string, endDate: string): Promise<PlannerEvent[]>` - Get user events in date range
- `updateEvent(eventId: string, userId: string, updates: Partial<PlannerEvent>): Promise<PlannerEvent>` - Update event with ownership check
- `deleteEvent(eventId: string, userId: string): Promise<void>` - Delete event with ownership check
- `markEventComplete(eventId: string, userId: string, completed: boolean): Promise<PlannerEvent>` - Toggle event completion

**AI Content Generation (backend/ai-services/content-generator.ts):**
- `generateVideoScript(topic: string, subject: Subject, difficulty: DifficultyLevel): Promise<VideoScript>` - Generate educational content
- `generateThumbnail(script: VideoScript): Promise<string>` - Create video thumbnail
- `processVideoGeneration(request: VideoGenerationRequest): Promise<Video>` - Complete video generation pipeline
- `validateTopic(topic: string, subject: Subject): Promise<boolean>` - Topic relevance validation

**Content Moderation (backend/ai-services/moderator.ts):**
- `moderatePrompt(content: string, context?: ModerationContext): Promise<ModerationResponse>` - Content safety check
- `moderateComment(text: string): Promise<ModerationResponse>` - Comment moderation
- `classifySubject(content: string): Promise<Subject | null>` - Subject classification
- `detectLanguage(text: string): Promise<string>` - Language detection

**Database Utilities (backend/database/operations.ts):**
- `initializeDatabase(): Promise<void>` - Database setup and migration
- `runMigrations(): Promise<void>` - Execute pending migrations
- `createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>` - Database user creation
- `updateVideoRatingAverage(videoId: string): Promise<number>` - Recalculate video rating
- `cleanupExpiredSessions(): Promise<number>` - Session cleanup cron job
- `backupDatabase(): Promise<string>` - Database backup operation

**Modified Functions:**
None - this is a new implementation with no existing codebase to modify.

**Removed Functions:**
None - no existing functions to remove.

## [Classes]
Design robust service classes for API management, database operations, AI integration, and system monitoring.

**New Classes to Create:**

**API Server Infrastructure:**
```typescript
// backend/api/server.ts
class ApiServer {
  private app: Express;
  private supabase: SupabaseClient;
  
  constructor(config: ServerConfig);
  async initialize(): Promise<void>;
  async start(port: number): Promise<void>;
  async stop(): Promise<void>;
  private setupMiddleware(): void;
  private setupRoutes(): void;
  private setupErrorHandling(): void;
}

// backend/api/middleware/auth.ts
class AuthMiddleware {
  private supabase: SupabaseClient;
  
  constructor(supabaseClient: SupabaseClient);
  authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
  requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  checkPermissions(permissions: string[]): MiddlewareFunction;
}

// backend/api/middleware/validation.ts
class ValidationMiddleware {
  static validateVideoRequest(req: Request, res: Response, next: NextFunction): void;
  static validateUserUpdate(req: Request, res: Response, next: NextFunction): void;
  static validateComment(req: Request, res: Response, next: NextFunction): void;
  static validateRating(req: Request, res: Response, next: NextFunction): void;
  private static handleValidationError(errors: ValidationError[]): Response;
}
```

**Database Management:**
```typescript
// backend/database/connection.ts
class DatabaseManager {
  private supabase: SupabaseClient<Database>;
  private config: DatabaseConfig;
  
  constructor(config: DatabaseConfig);
  async connect(): Promise<void>;
  async disconnect(): Promise<void>;
  async runMigration(migrationFile: string): Promise<void>;
  async executeQuery<T>(query: string, params?: any[]): Promise<T[]>;
  async transaction<T>(callback: (client: SupabaseClient) => Promise<T>): Promise<T>;
}

// backend/database/repositories/user-repository.ts
class UserRepository {
  private supabase: SupabaseClient<Database>;
  
  constructor(supabase: SupabaseClient<Database>);
  async create(user: Database['public']['Tables']['users']['Insert']): Promise<User>;
  async findById(id: string): Promise<User | null>;
  async findByEmail(email: string): Promise<User | null>;
  async update(id: string, updates: Database['public']['Tables']['users']['Update']): Promise<User>;
  async delete(id: string): Promise<void>;
  async updateLastActive(id: string): Promise<void>;
}

// backend/database/repositories/video-repository.ts
class VideoRepository {
  private supabase: SupabaseClient<Database>;
  
  constructor(supabase: SupabaseClient<Database>);
  async create(video: Database['public']['Tables']['videos']['Insert']): Promise<Video>;
  async findById(id: string): Promise<Video | null>;
  async findByFilters(filters: VideoFeedFilters, pagination: PaginationParams): Promise<PaginatedResponse<Video>>;
  async update(id: string, updates: Database['public']['Tables']['videos']['Update']): Promise<Video>;
  async delete(id: string): Promise<void>;
  async incrementViewCount(id: string): Promise<void>;
  async updateRatingAverage(id: string): Promise<number>;
}
```

**AI Service Management:**
```typescript
// backend/ai-services/llm-manager.ts
class LLMManager {
  private models: Map<string, LLMInstance>;
  private config: LLMConfig;
  
  constructor(config: LLMConfig);
  async initialize(): Promise<void>;
  async loadModel(modelName: string): Promise<void>;
  async generateResponse(prompt: string, modelName?: string): Promise<string>;
  async getAvailableModels(): Promise<string[]>;
  async shutdown(): Promise<void>;
  private selectOptimalModel(task: string): string;
}

// backend/ai-services/content-generator.ts
class ContentGenerator {
  private llmManager: LLMManager;
  private promptTemplates: PromptTemplateManager;
  
  constructor(llmManager: LLMManager);
  async generateVideoScript(request: VideoGenerationRequest): Promise<VideoScript>;
  async generateSummary(script: string): Promise<string>;
  async generateKeyPoints(script: string): Promise<string[]>;
  async validateContent(content: string, subject: Subject): Promise<boolean>;
  private formatPrompt(topic: string, subject: Subject, difficulty: DifficultyLevel): string;
}

// backend/ai-services/moderator.ts
class ContentModerator {
  private llmManager: LLMManager;
  private policyRules: ModerationRule[];
  
  constructor(llmManager: LLMManager, rules: ModerationRule[]);
  async moderateContent(request: ModerationRequest): Promise<ModerationResponse>;
  async classifySubject(content: string): Promise<Subject | null>;
  async detectInappropriateContent(text: string): Promise<boolean>;
  async assignModerationScore(content: string): Promise<number>;
  private checkPolicyViolations(content: string): string[];
}
```

**Caching and Performance:**
```typescript
// backend/services/cache-manager.ts
class CacheManager {
  private redis: Redis;
  private localCache: Map<string, CacheEntry>;
  
  constructor(redisConfig: RedisConfig);
  async set(key: string, value: any, ttl?: number): Promise<void>;
  async get<T>(key: string): Promise<T | null>;
  async delete(key: string): Promise<void>;
  async invalidatePattern(pattern: string): Promise<number>;
  async flush(): Promise<void>;
  private generateKey(prefix: string, ...parts: string[]): string;
}

// backend/services/rate-limiter.ts
class RateLimiter {
  private cache: CacheManager;
  private rules: Map<string, RateLimitRule>;
  
  constructor(cache: CacheManager, rules: RateLimitRule[]);
  async checkLimit(identifier: string, action: string): Promise<RateLimitResult>;
  async incrementCounter(identifier: string, action: string): Promise<void>;
  async resetCounter(identifier: string, action: string): Promise<void>;
  private getRuleForAction(action: string): RateLimitRule;
}
```

**System Monitoring:**
```typescript
// backend/services/monitoring.ts
class SystemMonitor {
  private metrics: MetricsCollector;
  private alerts: AlertManager;
  
  constructor(config: MonitoringConfig);
  async recordMetric(name: string, value: number, tags?: Record<string, string>): Promise<void>;
  async recordAPICall(endpoint: string, method: string, duration: number, status: number): Promise<void>;
  async checkSystemHealth(): Promise<HealthStatus>;
  async triggerAlert(alert: AlertConfig): Promise<void>;
  private collectSystemMetrics(): SystemMetrics;
}

// backend/services/logger.ts
class Logger {
  private winston: Winston.Logger;
  private context: LogContext;
  
  constructor(config: LoggerConfig);
  info(message: string, meta?: any): void;
  error(message: string, error?: Error, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  audit(action: string, userId: string, resource: string, meta?: any): void;
}
```

**Modified Classes:**
None - this is a new implementation.

**Removed Classes:**
None - no existing classes to remove.

## [Dependencies]
Install comprehensive package ecosystem for backend services, AI integration, and development tooling.

**Backend API Dependencies (backend/package.json):**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@supabase/supabase-js": "^2.38.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "winston": "^3.11.0",
    "redis": "^4.6.10",
    "node-cron": "^3.0.3",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "axios": "^1.5.1",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.7",
    "@types/express": "^4.17.20",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/multer": "^1.4.11",
    "@types/compression": "^1.7.5",
    "@types/morgan": "^1.9.9",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.16",
    "eslint": "^8.52.0",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
    "prettier": "^3.0.3"
  }
}
```

**AI Services Dependencies:**
```json
{
  "dependencies": {
    "@huggingface/inference": "^2.6.4",
    "llamaindex": "^0.1.12",
    "langchain": "^0.0.190",
    "openai": "^4.15.4",
    "transformers": "^2.6.0",
    "sentence-transformers": "^1.0.2",
    "torch": "^2.1.0",
    "python-shell": "^5.0.0"
  }
}
```

**Shared Types Package (shared/package.json):**
```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "@supabase/supabase-js": "^2.38.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
```

**Infrastructure Dependencies:**
- **Docker**: Latest stable version for containerization
- **PostgreSQL**: 15+ for Supabase database
- **Redis**: 7+ for caching and session management
- **Nginx**: Latest for reverse proxy and load balancing
- **Node.js**: 18+ LTS for backend services
- **Python**: 3.11+ for AI model integration

**AI Model Dependencies:**
- **Llama 2 7B/13B**: Primary content generation model
- **Mistral 7B**: Alternative lightweight model
- **sentence-transformers**: Text embeddings for semantic search
- **torch**: PyTorch for model inference
- **CUDA**: GPU acceleration (optional but recommended)

**Development Tools:**
- **Supabase CLI**: Database management and migrations
- **Docker Compose**: Local development environment
- **Jest**: Unit and integration testing
- **Playwright**: End-to-end testing
- **ESLint/Prettier**: Code formatting and linting
- **Husky**: Git hooks for code quality
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards

## [Testing]
Implement comprehensive testing strategy covering unit tests, integration tests, API testing, and AI service validation.

**Testing Framework Setup:**
- **Unit Testing**: Jest with TypeScript support for individual function testing
- **Integration Testing**: Supertest for API endpoint testing with test database
- **Database Testing**: Supabase test environment with isolated test schemas
- **AI Service Testing**: Mock LLM responses and validate content generation pipeline
- **Performance Testing**: Load testing with Artillery for 100+ concurrent users
- **Security Testing**: Automated vulnerability scanning and penetration testing

**Test File Structure:**
```
backend/tests/
├── unit/
│   ├── auth.test.ts
│   ├── validation.test.ts
│   ├── user-repository.test.ts
│   ├── video-repository.test.ts
│   └── content-generator.test.ts
├── integration/
│   ├── api-auth.test.ts
│   ├── api-videos.test.ts
│   ├── api-users.test.ts
│   ├── database-operations.test.ts
│   └── ai-services.test.ts
├── e2e/
│   ├── user-registration-flow.test.ts
│   ├── video-generation-flow.test.ts
│   └── comment-moderation-flow.test.ts
├── performance/
│   ├── load-test-config.yml
│   └── stress-test-scenarios.ts
└── setup/
    ├── test-database.ts
    ├── mock-ai-services.ts
    └── test-helpers.ts
```

**Key Testing Strategies:**
- Database operations tested with transaction rollbacks for isolation
- AI services mocked for consistent testing with real integration tests in separate suite
- Authentication tested with JWT token validation and expiration scenarios  
- Rate limiting tested with concurrent request simulation
- Content moderation tested with known safe/unsafe content samples
- Real-time features tested with WebSocket connection simulation

**Test Coverage Targets:**
- Minimum 80% code coverage for all backend services
- 100% coverage for authentication and security functions
- All API endpoints covered with success and failure scenarios
- Database migrations tested with up/down operations
- AI model integration tested with sample prompts and expected outputs

## [Implementation Order]
Execute development in carefully sequenced phases to minimize dependencies and ensure stable integration points.

**Prerequisites: Phase 0 Must Be Complete**
Before beginning Phase 1 implementation, ensure Phase 0 (Development Environment Setup) is fully complete:
- All required software installed (Git, Node.js 22+, Python 3.11+, Docker Desktop)
- Git configured with user information (rogermmurphy@gmail.com)
- Global npm packages installed (TypeScript, ESLint, Prettier, Supabase CLI)
- Docker services running (Redis, PostgreSQL, Adminer)
- Project structure initialized with all base folders
- .env file configured with local development values
- Verification scripts passing successfully

See `docs/phase-0/phase-0-environment-setup.md` for complete Phase 0 checklist.

---

1. **Setup Development Environment (Week 1)**
   - Initialize backend project structure with folder hierarchy from [Files] section
   - Configure TypeScript, ESLint, Prettier, and build tools in backend/package.json
   - Set up Supabase project and obtain API keys/connection strings
   - Create backend/.env.example with all required environment variables
   - Initialize shared types package with TypeScript interfaces from [Types] section
   - Set up Docker development environment with docker-compose.yml

2. **Database Schema Implementation (Week 2)**
   - Create backend/database/schema.sql with complete table definitions
   - Implement backend/database/migrations/001_initial_schema.sql
   - Set up Row Level Security policies in backend/database/migrations/002_rls_policies.sql
   - Create database functions: update_video_rating.sql, moderate_content.sql
   - Test database schema with Supabase CLI and verify all constraints
   - Create database seed data for development and testing

3. **Core API Infrastructure (Week 3)**
   - Implement ApiServer class in backend/api/server.ts with Express setup
   - Create DatabaseManager class with Supabase client configuration
   - Build AuthMiddleware class with JWT token validation and Supabase auth
   - Implement ValidationMiddleware class with Zod schema validation
   - Set up RateLimiter class with Redis-based rate limiting
   - Create comprehensive error handling and logging infrastructure

4. **User Authentication System (Week 4)**
   - Implement all authentication functions in backend/api/routes/auth.ts
   - Create UserRepository class with full CRUD operations
   - Build user registration flow with email verification
   - Implement JWT token generation, validation, and refresh mechanisms
   - Add password hashing with bcrypt and secure session management
   - Create comprehensive auth tests in backend/tests/auth.test.ts

5. **User Management API (Week 5)**
   - Implement user profile functions in backend/api/routes/users.ts
   - Create user preferences management with database persistence
   - Build user statistics and activity tracking
   - Implement account deletion with proper data cleanup
   - Add user profile validation and update mechanisms
   - Create unit tests for all user management functions

6. **Video Management System (Week 6)**
   - Implement VideoRepository class with advanced querying capabilities
   - Create video CRUD operations in backend/api/routes/videos.ts
   - Build video feed with pagination, filtering, and sorting
   - Implement video search functionality with PostgreSQL full-text search
   - Add view count tracking and video statistics
   - Create comprehensive video management tests

7. **Rating and Comment Systems (Week 7)**
   - Implement Rating system in backend/api/routes/ratings.ts
   - Create Comment system in backend/api/routes/comments.ts
   - Build rating aggregation with database triggers
   - Implement comment threading and moderation hooks
   - Add report system for inappropriate content
   - Create real-time comment updates with Supabase subscriptions

8. **Study Planner Implementation (Week 8)**
   - Implement PlannerEvent CRUD in backend/api/routes/planner.ts
   - Create calendar integration and event management
   - Build recurring event support and reminder system
   - Implement event completion tracking and progress analytics
   - Add calendar view queries with date range filtering
   - Create planner synchronization across devices

9. **AI Infrastructure Setup (Week 9)**
   - Implement LLMManager class for model loading and management
   - Set up Docker containers for AI model hosting
   - Create model download scripts and configuration management
   - Build ContentGenerator class with prompt template system
   - Implement ContentModerator class with safety filters
   - Test AI model integration with sample prompts and responses

10. **Content Generation Pipeline (Week 10)**
    - Implement complete video generation workflow
    - Create AI prompt templates for different subjects and difficulties
    - Build content validation and quality checking
    - Implement thumbnail generation and media processing
    - Add batch processing capabilities for video generation
    - Create monitoring and logging for AI operations

11. **Advanced Features and Optimization (Week 11)**
    - Implement CacheManager class with Redis integration
    - Add SystemMonitor class for health checking and metrics
    - Create comprehensive logging with Winston and audit trails
    - Implement background job processing with node-cron
    - Add performance monitoring and alerting system
    - Optimize database queries and add proper indexes

12. **Testing and Quality Assurance (Week 12)**
    - Complete unit test suite for all functions and classes
    - Implement integration tests for API endpoints
    - Create end-to-end tests for complete user workflows
    - Set up load testing with Artillery for 100+ concurrent users
    - Perform security testing and vulnerability assessment
    - Create test automation and CI/CD pipeline setup

**Phase 1 Completion Criteria:**
- All backend APIs functional and tested
- Database schema deployed and validated
- Authentication system secure and performant
- AI content generation working with self-hosted models
- System capable of handling 100+ concurrent users
- Comprehensive test coverage (80%+ for critical paths)
- Documentation complete for API endpoints and deployment
- Security audit passed with no critical vulnerabilities
- Performance targets met (API response < 200ms P95)
- Ready for Phase 2 web application development
