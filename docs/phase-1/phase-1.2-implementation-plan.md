<!--
  Little Monster GPA Study Platform
  Phase 1.2 Implementation Plan: Content Upload & AI Integration
  
  Author: Ella K. Murphy (ella.k.murphy@gmail.com)
  Created: October 31, 2025 9:06 AM CST
  Last Updated: October 31, 2025 9:06 AM CST
  Version: 1.0
  Status: Ready to Begin
  
  This is a LIVING DOCUMENT - Update as requirements evolve
-->

# Phase 1.2: Content Upload & AI Integration APIs
## Little Monster GPA Study Platform

**Version**: 1.0  
**Created**: October 31, 2025 9:06 AM CST  
**Last Updated**: October 31, 2025 9:06 AM CST  
**Author**: Ella K. Murphy (ella.k.murphy@gmail.com)  
**Duration**: 3 weeks (21 days)  
**Status**: Ready to Begin  
**Prerequisites**: Phase 1.1 Complete ✅

---

## Phase 1.2 Overview

Phase 1.2 builds upon the authentication and classes foundation to implement the core content capture and AI-powered features. This phase enables students to upload audio recordings, photos, and textbooks, with automatic processing (transcription, OCR, embedding generation) and AI-powered chat with RAG-based source citations.

**Phase 1.2 Objectives:**
- Implement audio upload with Whisper transcription
- Implement photo upload with OCR text extraction
- Implement textbook (PDF) upload with chunking and embedding
- Integrate vector database (ChromaDB/Qdrant) for RAG
- Build AI chat endpoint with streaming responses
- Implement source citation system
- Generate AI-powered study materials (notes, tests, flashcards)
- Achieve 80%+ test coverage on all new features

**Key Success Metrics:**
- Audio transcription < 2 minutes for 30-min recording
- OCR extraction < 10 seconds per photo
- PDF chunking < 1 minute per 100 pages
- Chat response time < 3 seconds
- Vector search < 200ms
- 95%+ accuracy on source citations

---

## Phase 1.1 Completion Summary (October 31, 2025)

**✅ Completed:**
- Database: 16 tables deployed to Supabase with RLS
- Authentication API: 4 endpoints (register, login, refresh, profile)
- Classes CRUD API: 5 endpoints (create, list, get, update, delete)
- Express server with middleware (CORS, Helmet, Compression, Morgan)
- JWT authentication with refresh tokens
- Zod validation on all inputs
- Zero tolerance testing: All 8 endpoints tested end-to-end

**Verified Working:**
- User registration creates database records
- JWT tokens authenticate API calls
- Class CRUD operations persist to database
- Ownership verification prevents unauthorized access
- Cascade delete removes related content

---

## Week 1: Audio & Photo Upload APIs (Days 1-7)

### Day 1-2: Audio Upload & Storage

**Tasks:**
1. Install dependencies: `multer`, `@google-cloud/speech` (or Whisper API)
2. Create `backend/api/services/audio.service.ts`
3. Implement file upload with multer
4. Store audio files in Supabase Storage
5. Create `POST /api/audio/upload` endpoint
6. Test audio upload with sample file

**Implementation Details:**
```typescript
// Audio upload endpoint
POST /api/audio/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data
  - audioFile: File (mp3, wav, m4a)
  - classId: UUID
  - title: string

Response:
{
  id: UUID,
  fileUrl: string,
  duration: number,
  transcriptStatus: 'pending'
}
```

**Deliverables:**
- `backend/api/services/audio.service.ts` (audio storage logic)
- `backend/api/routes/audio.routes.ts` (upload endpoint)
- Audio files stored in Supabase Storage bucket: `audio-recordings`
- Upload endpoint tested with curl and test script

---

### Day 3-4: Audio Transcription Integration

**Tasks:**
1. Set up Whisper API or Google Speech-to-Text
2. Create `backend/ai-services/transcription.service.ts`
3. Implement background job for transcription
4. Store transcript text in `audio_recordings.transcript_text`
5. Update `transcript_status` (pending → processing → complete → error)
6. Test transcription with sample audio

**Implementation Details:**
```typescript
// Transcription workflow
1. Audio uploaded → status: 'pending'
2. Background job picks up audio → status: 'processing'
3. Call Whisper API with audio file
4. Save transcript → status: 'complete'
5. Generate embeddings (Phase 1.2 Day 5-6)
```

**Deliverables:**
- `backend/ai-services/transcription.service.ts`
- Background job processing with Bull queue
- Transcription tested with 5-minute audio sample
- Transcript viewable in database

---

### Day 5-6: Photo Upload & OCR

**Tasks:**
1. Install dependencies: `tesseract.js` or Google Vision API
2. Create `backend/api/services/photo.service.ts`
3. Implement file upload for images
4. Store photos in Supabase Storage bucket: `photos`
5. Create `POST /api/photos/upload` endpoint
6. Integrate OCR for text extraction
7. Store extracted text in `photos.extracted_text`
8. Update `extraction_status`
9. Test photo upload and OCR

**Implementation Details:**
```typescript
// Photo upload endpoint
POST /api/photos/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data
  - photoFile: File (jpg, png, heic)
  - classId: UUID
  - title: string

Response:
{
  id: UUID,
  imageUrl: string,
  extractionStatus: 'pending'
}
```

**Deliverables:**
- `backend/api/services/photo.service.ts`
- `backend/ai-services/ocr.service.ts`
- Photo upload endpoint tested
- OCR extraction working (tested with whiteboard photo)
- Extracted text stored in database

---

### Day 7: Audio/Photo Testing & Verification

**Tasks:**
1. Create `backend/tests/content-upload.test.ts`
2. Test audio upload with various file formats
3. Test transcription accuracy
4. Test photo upload with various image formats
5. Test OCR accuracy with different text styles
6. Verify storage cleanup on delete
7. Test error handling (large files, corrupt files, etc.)

**Deliverables:**
- Comprehensive test suite for uploads
- All formats tested (mp3, wav, jpg, png)
- Error handling verified
- Performance benchmarks documented

---

## Week 2: Textbook Upload & Vector Database (Days 8-14)

### Day 8-9: Textbook Upload & PDF Processing

**Tasks:**
1. Install dependencies: `pdf-parse`, `pdf-lib`
2. Create `backend/api/services/textbook.service.ts`
3. Implement PDF upload and storage
4. Extract text from PDF pages
5. Store textbook metadata in `textbook_downloads`
6. Create `POST /api/textbooks/upload` endpoint
7. Test PDF upload

**Implementation Details:**
```typescript
// Textbook upload endpoint
POST /api/textbooks/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data
  - pdfFile: File (pdf)
  - classId: UUID
  - title: string
  - author: string (optional)
  - isbn: string (optional)

Response:
{
  id: UUID,
  fileUrl: string,
  pageCount: number,
  embeddingStatus: 'pending'
}
```

**Deliverables:**
- `backend/api/services/textbook.service.ts`
- PDF parsing and text extraction working
- Textbook metadata stored
- Upload endpoint tested with sample PDF

---

### Day 10-11: Text Chunking & Embedding Generation

**Tasks:**
1. Install dependencies: `langchain`, `openai`
2. Create `backend/ai-services/embedding.service.ts`
3. Implement text chunking (512 tokens with overlap)
4. Generate embeddings with OpenAI `text-embedding-3-small`
5. Create background job for embedding generation
6. Test chunking with sample textbook

**Implementation Details:**
```typescript
// Chunking strategy
- Chunk size: 512 tokens
- Overlap: 50 tokens
- Preserve sentence boundaries
- Include chapter/section metadata

// Embedding model
- Model: text-embedding-3-small (OpenAI)
- Dimensions: 1536
- Cost: $0.00002 per 1K tokens
```

**Deliverables:**
- `backend/ai-services/embedding.service.ts`
- Chunking algorithm implemented
- Embeddings generated successfully
- Background job processing tested

---

### Day 12-13: Vector Database Integration

**Tasks:**
1. Install ChromaDB client: `chromadb`
2. Create `backend/ai-services/vector-db.service.ts`
3. Implement collection creation for each class
4. Store embeddings in ChromaDB with metadata
5. Store `vector_id` in PostgreSQL records
6. Implement vector search function
7. Test embedding storage and retrieval

**Implementation Details:**
```typescript
// ChromaDB collections
- Collection per class: `class_{classId}_content`
- Metadata stored with each vector:
  {
    sourceType: 'audio' | 'photo' | 'textbook',
    sourceId: UUID,
    timestamp: string (for audio/lectures),
    pageNumber: number (for textbooks),
    className: string,
    chunkIndex: number
  }

// Vector search
- Query: Student question
- Top K: 5 most relevant chunks
- Threshold: 0.7 similarity
```

**Deliverables:**
- `backend/ai-services/vector-db.service.ts`
- ChromaDB collections created
- Embeddings stored successfully
- Vector search returning relevant results
- Search tested with sample queries

---

### Day 14: Content Processing Testing

**Tasks:**
1. Test complete audio pipeline (upload → transcribe → embed → store)
2. Test complete photo pipeline (upload → OCR → embed → store)
3. Test complete textbook pipeline (upload → chunk → embed → store)
4. Verify all `vector_id` fields populated
5. Test vector search accuracy
6. Document processing times for benchmarks

**Deliverables:**
- End-to-end pipeline tests passing
- Performance benchmarks documented
- All content types searchable via vectors
- Processing errors handled gracefully

---

## Week 3: AI Chat & Study Materials (Days 15-21)

### Day 15-16: AI Chat with RAG

**Tasks:**
1. Install dependencies: `openai`
2. Create `backend/ai-services/chat.service.ts`
3. Implement RAG retrieval (query → vector search → context)
4. Build prompt with retrieved context
5. Call OpenAI GPT-4 with context
6. Track source citations
7. Create `POST /api/chat` endpoint
8. Test chat with sample questions

**Implementation Details:**
```typescript
// Chat endpoint
POST /api/chat
Headers: Authorization: Bearer <token>
Body: {
  conversationId: UUID (optional, for continuing conversation),
  classId: UUID,
  message: string,
  includeAudio: boolean (optional),
  includePhotos: boolean (optional),
  includeTextbooks: boolean (optional)
}

Response: {
  conversationId: UUID,
  messageId: UUID,
  content: string,
  sources: [
    {
      type: 'audio' | 'photo' | 'textbook',
      id: UUID,
      title: string,
      timestamp: string (for audio),
      pageNumber: number (for textbooks)
    }
  ]
}

// RAG workflow
1. Receive student question
2. Generate embedding for question
3. Search ChromaDB for relevant chunks
4. Retrieve top 5 chunks
5. Build context with sources
6. Prompt: "Based on these sources: [context], answer: [question]"
7. Get GPT-4 response
8. Extract which sources were used
9. Return answer with citations
```

**Deliverables:**
- `backend/ai-services/chat.service.ts`
- `backend/api/routes/chat.routes.ts`
- RAG retrieval working
- Source citations accurate
- Chat endpoint tested with sample questions
- Responses include proper source references

---

### Day 17-18: AI Note Generation

**Tasks:**
1. Create `backend/api/services/notes.service.ts`
2. Implement `POST /api/notes/generate` endpoint
3. Allow selection of multiple sources (audio, photos, textbooks)
4. Generate comprehensive notes from selected sources
5. Store in `notes` table with `is_ai_generated = true`
6. Link sources in `note_sources` table
7. Test note generation

**Implementation Details:**
```typescript
// Generate notes endpoint
POST /api/notes/generate
Headers: Authorization: Bearer <token>
Body: {
  classId: UUID,
  title: string,
  sources: {
    audioIds: UUID[],
    photoIds: UUID[],
    textbookIds: UUID[]
  },
  style: 'summary' | 'detailed' | 'outline'
}

Response: {
  noteId: UUID,
  title: string,
  content: string (markdown),
  sourceCount: number,
  sources: [...]
}
```

**Deliverables:**
- `backend/api/services/notes.service.ts`
- `backend/api/routes/notes.routes.ts`
- Note generation from multiple sources working
- Source tracking in `note_sources` table
- Notes viewable with source indicators

---

### Day 19-20: Study Material Generation (Tests & Flashcards)

**Tasks:**
1. Create `backend/api/services/study-materials.service.ts`
2. Implement `POST /api/tests/generate` endpoint
3. Implement `POST /api/flashcards/generate` endpoint
4. Generate practice tests from class content
5. Generate flashcard decks from class content
6. Store in `generated_tests` and `flashcard_decks` tables
7. Test generation quality

**Implementation Details:**
```typescript
// Generate test endpoint
POST /api/tests/generate
Headers: Authorization: Bearer <token>
Body: {
  classId: UUID,
  title: string,
  difficulty: 'easy' | 'medium' | 'hard',
  questionCount: number,
  questionTypes: ['multiple-choice', 'true-false', 'short-answer'],
  sourceContent: {
    audioIds: UUID[],
    photoIds: UUID[],
    textbookIds: UUID[]
  }
}

Response: {
  testId: UUID,
  questions: [
    {
      questionText: string,
      type: string,
      options: string[] (for MC),
      correctAnswer: string,
      explanation: string
    }
  ]
}

// Generate flashcards endpoint
POST /api/flashcards/generate
Headers: Authorization: Bearer <token>
Body: {
  classId: UUID,
  title: string,
  cardCount: number,
  difficulty: 'easy' | 'medium' | 'hard',
  sourceContent: { ... }
}

Response: {
  deckId: UUID,
  cards: [
    {
      frontText: string,
      backText: string
    }
  ]
}
```

**Deliverables:**
- `backend/api/services/study-materials.service.ts`
- `backend/api/routes/study-materials.routes.ts`
- Test generation working
- Flashcard generation working
- Quality validation passed

---

### Day 21: Integration Testing & Documentation

**Tasks:**
1. Create comprehensive test suite for Phase 1.2
2. Test complete workflow: Upload → Process → Chat → Generate
3. Create API documentation for all new endpoints
4. Update database architecture documentation
5. Update technical specifications
6. Create Phase 1.2 completion report
7. Git commit and push all changes

**Deliverables:**
- `backend/tests/phase-1.2.test.js` - Complete test suite
- All workflows tested end-to-end
- API documentation updated
- Living documents updated
- Git history current
- Phase 1.2 completion marker: `.phase1.2-complete`

---

## Detailed API Specifications

### Audio Recording API

**Endpoints:**
```
POST   /api/audio/upload          - Upload audio file
GET    /api/audio                 - List user's recordings (by class)
GET    /api/audio/:id             - Get recording details + transcript
PATCH  /api/audio/:id             - Update title/metadata
DELETE /api/audio/:id             - Delete recording + transcript
GET    /api/audio/:id/transcript  - Get full transcript with timestamps
```

**Database Tables Used:**
- `audio_recordings` - Metadata and transcript
- Vector DB (ChromaDB) - Embedded transcript chunks

---

### Photo API

**Endpoints:**
```
POST   /api/photos/upload         - Upload photo
GET    /api/photos                - List user's photos (by class)
GET    /api/photos/:id            - Get photo details + extracted text
PATCH  /api/photos/:id            - Update title/metadata
DELETE /api/photos/:id            - Delete photo + text
GET    /api/photos/:id/text       - Get extracted OCR text
```

**Database Tables Used:**
- `photos` - Metadata and extracted text
- Vector DB (ChromaDB) - Embedded text chunks

---

### Textbook API

**Endpoints:**
```
POST   /api/textbooks/upload      - Upload PDF textbook
GET    /api/textbooks             - List user's textbooks (by class)
GET    /api/textbooks/:id         - Get textbook details
PATCH  /api/textbooks/:id         - Update metadata
DELETE /api/textbooks/:id         - Delete textbook + chunks
GET    /api/textbooks/:id/search  - Search within textbook
```

**Database Tables Used:**
- `textbook_downloads` - Metadata
- Vector DB (ChromaDB) - Embedded page chunks

---

### AI Chat API

**Endpoints:**
```
POST   /api/chat                  - Send message to AI
GET    /api/chat/conversations    - List user's conversations (by class)
GET    /api/chat/:conversationId  - Get conversation history
DELETE /api/chat/:conversationId  - Delete conversation
POST   /api/chat/stream           - Streaming chat responses (SSE)
```

**Database Tables Used:**
- `chat_conversations` - Conversation metadata
- `chat_messages` - Message history with sources
- Vector DB (ChromaDB) - RAG context retrieval

---

### Notes API

**Endpoints:**
```
POST   /api/notes                 - Create note (manual or AI)
POST   /api/notes/generate        - Generate AI notes from sources
GET    /api/notes                 - List user's notes (by class)
GET    /api/notes/:id             - Get note with sources
PATCH  /api/notes/:id             - Update note content
DELETE /api/notes/:id             - Delete note
```

**Database Tables Used:**
- `notes` - Note content
- `note_sources` - Source tracking
- Vector DB (ChromaDB) - Embedded note content

---

### Study Materials API

**Endpoints:**
```
POST   /api/tests/generate        - Generate practice test
GET    /api/tests                 - List user's tests (by class)
GET    /api/tests/:id             - Get test with questions
DELETE /api/tests/:id             - Delete test

POST   /api/flashcards/generate   - Generate flashcard deck
GET    /api/flashcards            - List user's decks (by class)
GET    /api/flashcards/:id        - Get deck with cards
PATCH  /api/flashcards/:id/cards  - Update cards in deck
DELETE /api/flashcards/:id        - Delete deck
```

**Database Tables Used:**
- `generated_tests` - Test metadata
- `test_questions` - Individual questions
- `flashcard_decks` - Deck metadata
- `flashcards` - Individual cards

---

## Technical Architecture

### File Upload Architecture

```
Client → Express → Multer → Supabase Storage → Database Record
                                    ↓
                            Background Queue (Bull)
                                    ↓
                     Processing (Transcription/OCR/Chunking)
                                    ↓
                          Embedding Generation (OpenAI)
                                    ↓
                          Vector Storage (ChromaDB)
                                    ↓
                        Update Database (vector_id, status)
```

### RAG Chat Architecture

```
User Question → Generate Embedding → Vector Search (ChromaDB)
                                            ↓
                                    Top K Relevant Chunks
                                            ↓
                                    Build Context Prompt
                                            ↓
                                    OpenAI GPT-4 Call
                                            ↓
                                    Extract Source Citations
                                            ↓
                                    Return Answer + Sources
                                            ↓
                                Store in chat_messages
```

### Background Job Processing

```
Redis Queue (Bull) → Workers → Processing Tasks → Status Updates
  
Job Types:
1. Audio transcription
2. Photo OCR extraction
3. Textbook chunking
4. Embedding generation
5. Vector storage
```

---

## Dependencies to Install

### Backend Dependencies
```bash
npm install multer @types/multer
npm install openai
npm install chromadb
npm install pdf-parse @types/pdf-parse
npm install tesseract.js
npm install bull @types/bull
npm install ioredis @types/ioredis
npm install langchain
```

### Environment Variables to Add
```env
# OpenAI API
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Whisper (or Google Speech)
WHISPER_API_URL=https://api.openai.com/v1/audio/transcriptions
WHISPER_MODEL=whisper-1

# OCR (Tesseract or Google Vision)
OCR_ENGINE=tesseract
# OCR_API_KEY=... (if using Google Vision)

# Vector DB
CHROMADB_URL=http://localhost:8000
QDRANT_URL=http://localhost:6333

# Background Jobs
REDIS_QUEUE_NAME=lm-content-processing
JOB_CONCURRENCY=3
```

---

## Testing Strategy

### Unit Tests (70% coverage target)
- Service layer functions
- Validation logic
- Error handling
- Edge cases

### Integration Tests (20% coverage target)
- API endpoint responses
- Database operations
- File upload/download
- Background job processing

### End-to-End Tests (10% coverage target)
- Complete workflows
- Upload → Process → Retrieve
- RAG chat with real content
- Study material generation

### Performance Tests
- Audio transcription speed
- OCR extraction speed
- PDF chunking speed
- Vector search latency
- Chat response time
- Concurrent upload handling

---

## Phase 1.2 Completion Criteria

**Technical Criteria:**
- ✅ Audio upload and transcription working
- ✅ Photo upload and OCR working
- ✅ Textbook upload and embedding working
- ✅ Vector database integration complete
- ✅ RAG-based chat functional
- ✅ Source citations accurate (95%+)
- ✅ Study material generation working
- ✅ All endpoints tested end-to-end
- ✅ 80%+ test coverage achieved
- ✅ Performance benchmarks met

**Documentation Criteria:**
- ✅ API documentation updated
- ✅ Architecture diagrams current
- ✅ Technical specifications updated
- ✅ Living documents maintained

**Readiness Criteria:**
- ✅ Content capture pipeline operational
- ✅ AI features functional
- ✅ Ready for frontend integration (Phase 1.3)

---

## Risk Assessment

**High Risk:**
- OpenAI API costs (mitigation: rate limiting, caching)
- Transcription accuracy for technical content (mitigation: GPT-4 for correction)
- OCR accuracy with handwriting (mitigation: set expectations, manual correction)

**Medium Risk:**
- Background job processing failures (mitigation: retry logic, error notifications)
- Vector search relevance (mitigation: tune similarity thresholds, hybrid search)
- Large file uploads (mitigation: chunked uploads, file size limits)

**Low Risk:**
- Storage costs (mitigation: compression, cleanup old files)
- Processing time for large textbooks (mitigation: background jobs, status updates)

---

## Success Metrics

**Functionality:**
- 100% of content upload workflows operational
- 95%+ accuracy on source citations
- <3 second chat response time
- <10% failed processing jobs

**Quality:**
- 80%+ test coverage
- Zero critical bugs in production
- All living docs current
- Git commits every 2-3 days

**Performance:**
- Audio transcription: <2 min for 30-min recording
- Photo OCR: <10 sec per image
- PDF chunking: <1 min per 100 pages
- Vector search: <200ms
- Chat response: <3 sec

---

## Timeline

**Week 1:** Audio & Photo APIs (Days 1-7)  
**Week 2:** Textbooks & Vector DB (Days 8-14)  
**Week 3:** AI Chat & Study Materials (Days 15-21)

**Total Duration:** 21 days (3 weeks)  
**Start Date:** TBD (after Phase 1.1 approval)  
**Expected Completion:** TBD + 3 weeks

---

## Next Phase Preview

**Phase 1.3: Frontend-Backend Integration (2 weeks)**
- Connect UI to real APIs
- Replace all mock data
- Implement authentication flow
- Test complete user workflows
- Deploy to staging environment

---

**Document Status**: Living Document - Update as implementation progresses  
**Last Updated**: October 31, 2025 9:06 AM CST  
**Next Review**: End of Week 1 (Day 7)  
**Current Status**: Planning Complete - Ready to Begin
