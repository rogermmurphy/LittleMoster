# Little Monster (LM) - Technical Architecture Document
## Multi-Platform GPA Study Platform

**Version**: 1.0  
**Last Updated**: October 30, 2025  
**Document Type**: Technical Architecture & System Design  
**Status**: Living Document

---

## 1. Architecture Overview

The Little Monster platform employs a modern, cloud-native architecture designed for scalability, maintainability, and cross-platform compatibility. The system follows a microservices-inspired approach with clear separation of concerns across frontend applications, backend services, and AI processing infrastructure.

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Mobile App  │  │ Desktop App  │         │
│  │  (React)     │  │ (React Native)│  │  (Electron)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express API Server (Node.js + TypeScript)               │  │
│  │  - Authentication Middleware                             │  │
│  │  - Rate Limiting                                         │  │
│  │  - Request Validation                                    │  │
│  │  - CORS Configuration                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │  Videos  │  │ Comments │  │  Planner │       │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Repository Pattern                                       │  │
│  │  - UserRepository                                         │  │
│  │  - VideoRepository                                        │  │
│  │  - CommentRepository                                      │  │
│  │  - RatingRepository                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Storage Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Supabase   │  │    Redis     │  │  Supabase    │         │
│  │  PostgreSQL  │  │   Cache      │  │   Storage    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI Processing Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Self-Hosted LLM Service                                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │  Llama 2   │  │  Mistral   │  │ Moderator  │         │  │
│  │  │   Model    │  │   Model    │  │   Model    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. System Components Architecture

### 2.1 Frontend Architecture

**Multi-Platform Strategy:**
```
Shared Core Logic
├── React (Web)
│   ├── Desktop-first responsive design
│   ├── Progressive Web App capabilities
│   └── Browser-specific optimizations
├── React Native (Mobile)
│   ├── iOS native components
│   ├── Android native components
│   └── Platform-specific features
└── Electron (Desktop)
    ├── Windows integration
    ├── macOS integration
    └── Linux integration
```

**Component Architecture Pattern:**
```typescript
// Atomic Design Hierarchy
src/
├── components/
│   ├── atoms/           // Button, Input, Icon, Avatar
│   ├── molecules/       // SearchBox, VideoCard, CommentItem
│   ├── organisms/       // VideoFeed, NavigationHeader, PlannerCalendar
│   ├── templates/       // PageLayout, ModalLayout, SidebarLayout
│   └── pages/           // HomePage, VideoDetailPage, PlannerPage
├── hooks/               // Custom React hooks
├── stores/              // State management (Zustand)
├── services/            // API clients and external services
└── utils/               // Helper functions
```

### 2.2 Backend Architecture

**Service-Oriented Architecture:**
```
Backend Services
├── API Server (Express + TypeScript)
│   ├── REST endpoints
│   ├── WebSocket connections
│   └── GraphQL (future)
├── Authentication Service
│   ├── User registration
│   ├── JWT token management
│   └── Session handling
├── Content Service
│   ├── Video management
│   ├── Comment system
│   └── Rating aggregation
├── Planner Service
│   ├── Event management
│   ├── Calendar integration
│   └── Reminder system
└── AI Service
    ├── Content generation
    ├── Moderation
    └── Personalization
```

**API Layer Structure:**
```
API Routes
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh-token
│   └── POST /verify-email
├── /users
│   ├── GET /users/:id
│   ├── PATCH /users/:id
│   ├── DELETE /users/:id
│   └── GET /users/:id/stats
├── /videos
│   ├── GET /videos (feed with filters)
│   ├── GET /videos/:id
│   ├── POST /videos (generate request)
│   ├── PATCH /videos/:id
│   └── DELETE /videos/:id
├── /comments
│   ├── GET /comments?videoId=:id
│   ├── POST /comments
│   ├── PATCH /comments/:id
│   └── DELETE /comments/:id
├── /ratings
│   ├── POST /ratings
│   ├── GET /ratings?videoId=:id
│   └── GET /ratings/user/:userId/video/:videoId
├── /planner
│   ├── GET /planner/events
│   ├── POST /planner/events
│   ├── PATCH /planner/events/:id
│   └── DELETE /planner/events/:id
├── /chat
│   ├── POST /chat/conversations (start new conversation)
│   ├── GET /chat/conversations (list user's conversations)
│   ├── GET /chat/conversations/:id (get conversation with messages)
│   ├── POST /chat/conversations/:id/messages (send message, streaming)
│   ├── DELETE /chat/conversations/:id (delete conversation)
│   └── PATCH /chat/conversations/:id (update conversation title)
└── /documents
    ├── POST /documents/upload (upload study material)
    ├── GET /documents (list user's documents)
    ├── GET /documents/:id (get document details)
    ├── DELETE /documents/:id (delete document + embeddings)
    ├── POST /documents/search (semantic search across documents)
    └── GET /documents/:id/chunks (get document chunks)
```

### 2.3 Database Architecture

**PostgreSQL Schema Design:**
```sql
-- Core Tables
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── display_name (VARCHAR)
├── avatar_color (VARCHAR)
├── subjects (TEXT[])
├── preferences (JSONB)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── last_active_at (TIMESTAMP)

videos
├── id (UUID, PK)
├── title (VARCHAR)
├── subject (ENUM)
├── difficulty (ENUM)
├── topic (VARCHAR)
├── created_by (UUID, FK → users.id)
├── status (ENUM)
├── script_summary (TEXT)
├── key_points (TEXT[])
├── timestamps (INTEGER[])
├── video_url (VARCHAR)
├── thumbnail_url (VARCHAR)
├── duration (INTEGER)
├── rating_avg (DECIMAL)
├── rating_count (INTEGER)
├── view_count (INTEGER)
├── comment_count (INTEGER)
├── tags (TEXT[])
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

comments
├── id (UUID, PK)
├── video_id (UUID, FK → videos.id)
├── user_id (UUID, FK → users.id)
├── text (TEXT)
├── is_hidden (BOOLEAN)
├── moderation_status (ENUM)
├── moderation_reason (TEXT)
└── created_at (TIMESTAMP)

ratings
├── id (UUID, PK)
├── video_id (UUID, FK → videos.id)
├── user_id (UUID, FK → users.id)
├── stars (INTEGER CHECK 1-5)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── UNIQUE(video_id, user_id)

planner_events
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── title (VARCHAR)
├── description (TEXT)
├── subject (ENUM)
├── type (ENUM)
├── start_date (TIMESTAMP)
├── end_date (TIMESTAMP)
├── is_completed (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

chat_conversations
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── title (VARCHAR)
├── context_type (ENUM: 'general', 'video', 'document', 'research')
├── metadata (JSONB)
├── message_count (INTEGER)
├── last_message_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

chat_messages
├── id (UUID, PK)
├── conversation_id (UUID, FK → chat_conversations.id)
├── role (ENUM: 'user', 'assistant', 'system')
├── content (TEXT)
├── token_count (INTEGER)
├── sources (JSONB[])
├── function_calls (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

user_documents
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── title (VARCHAR)
├── file_type (ENUM: 'pdf', 'docx', 'txt', 'markdown')
├── subject (ENUM)
├── file_url (VARCHAR)
├── file_size (INTEGER)
├── page_count (INTEGER)
├── chunk_count (INTEGER)
├── embedding_status (ENUM: 'pending', 'processing', 'completed', 'failed')
├── metadata (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

document_chunks
├── id (UUID, PK)
├── document_id (UUID, FK → user_documents.id)
├── chunk_index (INTEGER)
├── content (TEXT)
├── token_count (INTEGER)
├── embedding_id (VARCHAR)
├── metadata (JSONB)
└── created_at (TIMESTAMP)
```

**Database Indexes:**
```sql
-- Performance-critical indexes (Original tables)
CREATE INDEX idx_videos_subject_created ON videos(subject, created_at DESC);
CREATE INDEX idx_videos_status_created ON videos(status, created_at DESC);
CREATE INDEX idx_videos_created_by ON videos(created_by);
CREATE INDEX idx_videos_rating_avg ON videos(rating_avg DESC);
CREATE INDEX idx_comments_video_id ON comments(video_id, created_at DESC);
CREATE INDEX idx_ratings_video_user ON ratings(video_id, user_id);
CREATE INDEX idx_planner_user_date ON planner_events(user_id, start_date);
CREATE INDEX idx_videos_search ON videos USING GIN(to_tsvector('english', title || ' ' || topic));

-- Chat & Document indexes (New tables)
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id, last_message_at DESC);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id, created_at DESC);
CREATE INDEX idx_user_documents_user ON user_documents(user_id, created_at DESC);
CREATE INDEX idx_user_documents_status ON user_documents(embedding_status, created_at DESC);
CREATE INDEX idx_document_chunks_document ON document_chunks(document_id, chunk_index);
CREATE INDEX idx_documents_search ON user_documents USING GIN(to_tsvector('english', title));
```

### 2.4 AI Infrastructure Architecture (GPT-OSS + RAG)

**Conversational AI with GPT-OSS:**
```
AI Infrastructure
├── GPT-OSS Integration
│   ├── OpenAI API client
│   ├── Streaming response handling
│   ├── Function calling support
│   └── Context window management (128K tokens)
├── RAG Pipeline
│   ├── Document ingestion & chunking
│   ├── Embedding generation (text-embedding-3)
│   ├── Vector search (semantic similarity)
│   └── Context retrieval & ranking
├── Vector Database
│   ├── Pinecone/Weaviate integration
│   ├── Index management per user
│   ├── Metadata filtering
│   └── Similarity search optimization
├── Chat Management
│   ├── Conversation history tracking
│   ├── Multi-turn dialogue support
│   ├── Context pruning (token limits)
│   └── Session management
├── Research Integration
│   ├── Web search (Tavily/Serp API)
│   ├── Academic database access
│   ├── Source citation & verification
│   └── Fact-checking pipeline
└── Monitoring
    ├── Token usage tracking
    ├── Response quality metrics
    ├── Cost monitoring per user
    └── Latency tracking
```

**Conversational AI Flow:**
```
User Query
    ↓
[Intent Classification]
    ├─ Video Generation Request
    ├─ Question about Study Material
    ├─ General Study Help
    └─ External Research Query
    ↓
[RAG Pipeline - if relevant]
    ├─ Semantic search user's documents
    ├─ Retrieve top-k relevant chunks
    ├─ Rank by relevance score
    └─ Format as context
    ↓
[Research Pipeline - if needed]
    ├─ Web search for current info
    ├─ Academic paper search
    └─ Extract relevant passages
    ↓
[Context Assembly]
    ├─ Conversation history (last N turns)
    ├─ Retrieved document context
    ├─ External research results
    ├─ User profile & preferences
    └─ System instructions
    ↓
[GPT-OSS Inference]
    ├─ Streaming response generation
    ├─ Function calling (if needed)
    └─ Citation insertion
    ↓
[Response Post-Processing]
    ├─ Markdown formatting
    ├─ Source attribution
    ├─ Link validation
    └─ Safety check
    ↓
[Store & Return]
    ├─ Save to conversation history
    ├─ Update usage metrics
    └─ Stream to client
```

**RAG Document Processing Flow:**
```
User Uploads Document
    ↓
[Document Parsing]
    ├─ Extract text from PDF/DOCX/TXT
    ├─ Identify structure (headings, sections)
    └─ Extract metadata (title, author, date)
    ↓
[Text Chunking]
    ├─ Split into semantic chunks (512 tokens)
    ├─ Preserve paragraph boundaries
    ├─ Add overlap between chunks (50 tokens)
    └─ Maintain document hierarchy
    ↓
[Embedding Generation]
    ├─ Generate embeddings via OpenAI API
    ├─ Use text-embedding-3-large model
    └─ Store 3072-dimensional vectors
    ↓
[Vector Database Storage]
    ├─ Store embeddings in Pinecone/Weaviate
    ├─ Index by user_id + document_id
    ├─ Add metadata filters (subject, type, date)
    └─ Enable hybrid search (vector + keyword)
    ↓
[Ready for Retrieval]
    └─ User can query their knowledge base
```

## 3. Data Flow Architecture

### 3.1 Video Generation Data Flow

```
[User Input] → [Web/Mobile/Desktop Client]
    ↓
[Validation & Sanitization]
    ↓
[Content Moderation API] → {Approved/Rejected}
    ↓ (if approved)
[Video Generation Queue]
    ↓
[LLM Content Generation]
    ├─ Script Generation
    ├─ Key Points Extraction
    └─ Summary Creation
    ↓
[Media Processing]
    ├─ Thumbnail Generation
    ├─ Video Compilation (Future)
    └─ Audio Synthesis (Future)
    ↓
[Store in Database + Storage]
    ↓
[Real-time Update to Client]
    ↓
[Display in Video Feed]
```

### 3.2 Authentication & Authorization Flow

```
[User Login Request]
    ↓
[Supabase Auth Service]
    ↓
[Validate Credentials]
    ↓
{Success} → [Generate JWT Token]
          → [Create Session]
          → [Return Auth Response]
    ↓
[Client Stores Token]
    ↓
[Subsequent Requests Include Token]
    ↓
[Auth Middleware Validates]
    ├─ Token signature verification
    ├─ Expiration check
    └─ Permission verification
    ↓
{Valid} → [Process Request]
{Invalid} → [Return 401 Unauthorized]
```

### 3.3 Real-Time Synchronization Flow

```
[Client A] ──────┐
[Client B] ──────┼──→ [Supabase Realtime]
[Client C] ──────┘         ↓
                    [PostgreSQL Change]
                           ↓
                    [Change Data Capture]
                           ↓
                    [Filter by Subscription]
                           ↓
                    [Broadcast to Clients]
                           ↓
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
       [Client A]     [Client B]     [Client C]
       (Update UI)    (Update UI)    (Update UI)
```

## 4. Security Architecture

### 4.1 Security Layers

```
Defense in Depth Strategy
├── Layer 1: Transport Security
│   ├── HTTPS enforcement
│   ├── TLS 1.3
│   └── Certificate pinning (mobile/desktop)
├── Layer 2: Authentication
│   ├── JWT tokens with expiration
│   ├── Refresh token rotation
│   └── Multi-factor authentication (future)
├── Layer 3: Authorization
│   ├── Row Level Security (Supabase)
│   ├── Role-based access control
│   └── Resource ownership verification
├── Layer 4: Data Protection
│   ├── Encryption at rest
│   ├── Encryption in transit
│   └── PII masking in logs
├── Layer 5: Input Validation
│   ├── Schema validation (Zod)
│   ├── Sanitization (DOMPurify)
│   └── Rate limiting
└── Layer 6: Monitoring & Detection
    ├── Security event logging
    ├── Anomaly detection
    └── Intrusion detection
```

### 4.2 Row Level Security (RLS) Policies

```sql
-- Users can only read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Videos are public for reading
CREATE POLICY "Videos are public"
  ON videos FOR SELECT
  USING (status = 'PUBLIC');

-- Only creator can update their videos
CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = created_by);

-- Comments visible if not hidden
CREATE POLICY "Comments are public if not hidden"
  ON comments FOR SELECT
  USING (is_hidden = false);

-- Users can create comments
CREATE POLICY "Authenticated users can comment"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ratings one per user per video
CREATE POLICY "Users can rate videos"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Planner events private to user
CREATE POLICY "Users can access own events"
  ON planner_events
  USING (auth.uid() = user_id);

-- Chat conversations private to user
CREATE POLICY "Users can access own conversations"
  ON chat_conversations
  USING (auth.uid() = user_id);

-- Chat messages visible if user owns conversation
CREATE POLICY "Users can access messages in own conversations"
  ON chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  ));

-- User documents private to owner
CREATE POLICY "Users can access own documents"
  ON user_documents
  USING (auth.uid() = user_id);

-- Document chunks visible if user owns document
CREATE POLICY "Users can access chunks from own documents"
  ON document_chunks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_documents
    WHERE user_documents.id = document_chunks.document_id
    AND user_documents.user_id = auth.uid()
  ));
```

## 5. Scalability Architecture

### 5.1 Horizontal Scaling Strategy

```
Load Balancer (Nginx)
    ↓
┌───────────────────────────────┐
│   API Server Pool             │
│  ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ API 1│ │ API 2│ │ API 3│  │
│  └──────┘ └──────┘ └──────┘  │
└───────────────────────────────┘
    ↓
┌───────────────────────────────┐
│   Database Layer              │
│  ┌────────────┐  ┌─────────┐ │
│  │ Primary DB │→ │Replica 1│ │
│  │ (Read/Write│  │(Read)   │ │
│  └────────────┘  └─────────┘ │
└───────────────────────────────┘
```

**Scaling Targets:**
- Initial: 100 concurrent users
- Phase 2: 1,000 concurrent users
- Phase 3: 10,000 concurrent users

**Scaling Mechanisms:**
- Stateless API servers (easy horizontal scaling)
- Database connection pooling
- Redis caching layer
- CDN for static assets
- Read replicas for database
- Asynchronous job processing

### 5.2 Caching Strategy

```
Cache Layers
├── Level 1: Browser Cache
│   ├── Static assets (images, CSS, JS)
│   ├── Service Worker cache
│   └── IndexedDB for offline data
├── Level 2: CDN Cache
│   ├── Video thumbnails
│   ├── Static resources
│   └── Public video content
├── Level 3: Redis Cache
│   ├── User sessions
│   ├── Video feed results
│   ├── API response cache
│   └── Rate limit counters
└── Level 4: Database Query Cache
    ├── Prepared statements
    └── Materialized views
```

## 6. Performance Architecture

### 6.1 Performance Optimization Strategy

**Frontend Performance:**
- Code splitting by route (React.lazy)
- Image optimization (WebP, lazy loading)
- Bundle size optimization (< 500KB initial)
- Virtual scrolling for long lists
- Debounced search and input
- Optimistic UI updates

**Backend Performance:**
- Connection pooling (Supabase: 20 connections)
- Query optimization with proper indexes
- N+1 query prevention
- Response compression (gzip/brotli)
- HTTP/2 multiplexing
- API response caching (5min TTL)

**Database Performance:**
- Indexed queries (< 50ms P95)
- Pagination for large datasets
- Denormalized counters (view_count, rating_avg)
- Partitioning by date (future scaling)
- Read replicas for heavy queries
- Connection pooling

### 6.2 Performance Monitoring

```
Monitoring Stack
├── Application Metrics
│   ├── Response times (P50, P95, P99)
│   ├── Error rates
│   ├── Request throughput
│   └── Active connections
├── Infrastructure Metrics
│   ├── CPU utilization
│   ├── Memory usage
│   ├── Disk I/O
│   └── Network bandwidth
├── Database Metrics
│   ├── Query execution time
│   ├── Connection pool usage
│   ├── Cache hit ratios
│   └── Table sizes
└── AI Model Metrics
    ├── Inference time
    ├── Token usage
    ├── Model temperature
    └── Quality scores
```

## 7. Integration Architecture

### 7.1 External Service Integration

```
Integration Layer
├── Supabase Services
│   ├── Auth
│   ├── Database (PostgreSQL)
│   ├── Storage
│   └── Realtime
├── Self-Hosted Services
│   ├── LLM Models (Llama/Mistral)
│   ├── Redis Cache
│   └── Monitoring (Prometheus/Grafana)
├── Optional External Services
│   ├── Email (SMTP or Supabase)
│   ├── Analytics (Optional)
│   └── Error tracking (Optional)
└── Future Integrations
    ├── Calendar systems
    ├── LMS platforms
    └── Payment processors
```

### 7.2 API Integration Patterns

**RESTful API Design:**
- Resource-based URLs
- HTTP verbs for operations
- JSON request/response bodies
- Consistent error responses
- HATEOAS for discoverability

**Real-Time Integration:**
- Supabase Realtime for live updates
- WebSocket connections for chat/collaboration
- Server-Sent Events for notifications
- Optimistic updates with rollback

## 8. Deployment Architecture

### 8.1 Development Environment

```
Local Development
├── Docker Compose
│   ├── PostgreSQL (port 5432)
│   ├── Redis (port 6379)
│   └── Adminer (port 8080)
├── API Server (port 3000)
├── Web Dev Server (port 5173)
├── Mobile Dev (Expo on port 8081)
└── Desktop Dev (Electron hot reload)
```

### 8.2 Production Environment

```
Production Architecture
├── Frontend
│   ├── Web → Vercel/Firebase Hosting
│   ├── Mobile → App Stores (iOS/Android)
│   └── Desktop → Direct download/update server
├── Backend
│   ├── API Servers → Docker containers
│   ├── Load Balancer → Nginx
│   └── Auto-scaling groups
├── Database
│   ├── Supabase Cloud (Primary)
│   └── Automated backups
├── AI Infrastructure
│   ├── Dedicated GPU servers
│   ├── Model caching
│   └── Queue processing
└── Monitoring
    ├── Prometheus + Grafana
    ├── Error tracking
    └── Log aggregation
```

## 9. Disaster Recovery & Business Continuity

### 9.1 Backup Strategy

```
Backup Schedule
├── Database
│   ├── Continuous replication (Supabase)
│   ├── Daily full backups (retained 30 days)
│   └── Hourly incremental backups (retained 7 days)
├── File Storage
│   ├── Multi-region replication
│   └── Versioning enabled
├── Configuration
│   ├── Git version control
│   └── Infrastructure as Code
└── AI Models
    ├── Model versioning
    └── Checkpoint storage
```

### 9.2 Recovery Procedures

**Recovery Time Objectives (RTO):**
- Critical systems (Auth, DB): < 1 hour
- Content delivery: < 4 hours
- Full system recovery: < 24 hours

**Recovery Point Objectives (RPO):**
- User data: < 1 hour (continuous replication)
- Generated content: < 24 hours (daily backups)
- Analytics data: < 7 days (acceptable loss)

## 10. Technology Stack Summary

### 10.1 Complete Technology Inventory

**Frontend Technologies:**
- React 18+ with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Zustand for state management
- React Query for server state
- React Router for navigation

**Backend Technologies:**
- Node.js 18+ LTS
- Express.js framework
- TypeScript 5+
- Supabase Client SDK
- Redis for caching
- Winston for logging

**Database Technologies:**
- PostgreSQL 15+ (via Supabase)
- Redis 7+ for caching
- Supabase Storage for files

**AI Technologies:**
- GPT-OSS (OpenAI) - Primary conversational AI
- OpenAI text-embedding-3-large - Document embeddings
- **Qdrant** - Open-source vector database for RAG (primary choice)
- Weaviate - Alternative open-source vector DB
- LangChain - RAG orchestration
- Llama 2 / Mistral - Backup/alternative models
- Tavily / Serp API - Web search integration
- PDF.js / Mammoth.js - Document parsing

**DevOps Technologies:**
- Docker & Docker Compose
- GitHub Actions for CI/CD
- Nginx for reverse proxy
- Prometheus for metrics
- Grafana for dashboards

### 10.2 Architecture Decision Records (ADRs)

**ADR-001: Chose Supabase over Firebase**
- Reason: Open-source, PostgreSQL power, better pricing
- Impact: More control, potential self-hosting
- Trade-off: Smaller ecosystem than Firebase

**ADR-002: Self-hosted LLM vs API services**
- Reason: Cost reduction, data privacy, no rate limits
- Impact: Higher infrastructure complexity
- Trade-off: Operational overhead vs API simplicity

**ADR-003: Monorepo vs Multi-repo**
- Reason: Monorepo for shared code and atomic changes
- Impact: Easier cross-platform development
- Trade-off: Larger repository size

**ADR-004: REST over GraphQL (Phase 1)**
- Reason: Simpler implementation, better caching
- Impact: Multiple endpoints vs single endpoint
- Trade-off: Over-fetching vs complexity

**ADR-005: GPT-OSS with RAG over Self-Hosted LLM Only**
- Date: October 30, 2025
- Reason: GPT-OSS provides superior conversational AI capabilities with 128K context window, function calling, and streaming. RAG architecture enables grounding responses in user's personal study materials and external research sources, creating a more powerful and contextually relevant learning assistant.
- Impact: 
  - Requires OpenAI API integration (cost per token)
  - Need vector database (Pinecone/Weaviate) for embeddings
  - Additional database tables for chat conversations and documents
  - More complex AI pipeline (document parsing, chunking, embedding, retrieval)
- Trade-off: Higher API costs vs significantly better user experience and AI capabilities. Cost-benefit analysis: Enhanced learning through personalized, context-aware AI assistance justifies API expenses.
- Alternatives Considered: Pure self-hosted Llama 2 (rejected due to limited context window and conversational abilities)

---

This technical architecture document serves as the definitive reference for system design decisions, component interactions, and implementation patterns across the Little Monster platform.

**Last Updated**: October 30, 2025 - Updated with GPT-OSS + RAG Architecture
**Next Review**: After Phase 1 completion or as architecture evolves
