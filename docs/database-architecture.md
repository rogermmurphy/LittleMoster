# Database Architecture
## Little Monster GPA Platform - Hybrid Tabular + Vector Database Design

**Created**: October 30, 2025  
**Version**: 1.0 (Student-Only, Teacher Features in Backlog)  
**Status**: Design Complete, Ready for Implementation

---

## Architecture Overview

**Hybrid Database Strategy:**
- **PostgreSQL (Supabase)** - Structured/relational data
- **ChromaDB** - Vector embeddings for dev/debugging + MCP access
- **Qdrant** - Vector embeddings for production RAG

---

## PostgreSQL Schema (Tabular Data)

### Core User & Class Tables

```sql
-- 1. USERS (Students only for now)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  state VARCHAR(50),
  grade_level VARCHAR(20),
  school_name VARCHAR(200),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 2. CLASSES
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  teacher_name VARCHAR(100),
  period VARCHAR(20),
  color VARCHAR(20),
  subject VARCHAR(50),
  current_grade VARCHAR(5),
  grade_percent INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 3. ASSIGNMENTS
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50),
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_class ON assignments(class_id, due_date);
CREATE INDEX idx_assignments_user_status ON assignments(user_id, status, due_date);
```

### Content Capture Tables

```sql
-- 4. AUDIO_RECORDINGS
CREATE TABLE audio_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  transcript_text TEXT,
  transcript_status VARCHAR(20) DEFAULT 'pending',
  vector_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recordings_class ON audio_recordings(class_id, created_at DESC);
CREATE INDEX idx_recordings_transcript_status ON audio_recordings(transcript_status);

-- 5. PHOTOS
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  extracted_text TEXT,
  extraction_status VARCHAR(20) DEFAULT 'pending',
  vector_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_photos_class ON photos(class_id, created_at DESC);
CREATE INDEX idx_photos_extraction_status ON photos(extraction_status);

-- 6. TEXTBOOK_DOWNLOADS
CREATE TABLE textbook_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(200),
  isbn VARCHAR(20),
  file_url TEXT NOT NULL,
  file_type VARCHAR(20),
  file_size_bytes INTEGER,
  page_count INTEGER,
  total_chunks INTEGER,
  embedding_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_textbooks_class ON textbook_downloads(class_id);
CREATE INDEX idx_textbooks_user ON textbook_downloads(user_id);
CREATE INDEX idx_textbooks_status ON textbook_downloads(embedding_status);
```

### Notes & Generated Content Tables

```sql
-- 7. NOTES
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  note_type VARCHAR(50),
  is_ai_generated BOOLEAN DEFAULT false,
  vector_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_class ON notes(class_id, created_at DESC);
CREATE INDEX idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || content));

-- 8. NOTE_SOURCES (links notes to source content)
CREATE TABLE note_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL,
  source_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_note_sources_note ON note_sources(note_id);
CREATE INDEX idx_note_sources_source ON note_sources(source_type, source_id);

-- 9. GENERATED_TESTS
CREATE TABLE generated_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20),
  question_count INTEGER DEFAULT 0,
  time_limit_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tests_class ON generated_tests(class_id, created_at DESC);

-- 10. TEST_QUESTIONS
CREATE TABLE test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES generated_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  correct_answer TEXT,
  options JSONB,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_test ON test_questions(test_id, order_index);

-- 11. FLASHCARD_DECKS
CREATE TABLE flashcard_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_decks_class ON flashcard_decks(class_id, created_at DESC);

-- 12. FLASHCARDS
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cards_deck ON flashcards(deck_id, order_index);
```

### AI & Chat Tables

```sql
-- 13. CHAT_CONVERSATIONS
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_class ON chat_conversations(class_id, last_message_at DESC);

-- 14. CHAT_MESSAGES
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  sources JSONB,
  token_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at);
```

### Sharing & Collaboration Tables

```sql
-- 15. CLASSMATE_CONNECTIONS
CREATE TABLE classmate_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  classmate_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, classmate_user_id)
);

CREATE INDEX idx_connections_user ON classmate_connections(user_id, status);

-- 16. SHARED_CONTENT
CREATE TABLE shared_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL,
  content_id UUID NOT NULL,
  shared_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shared_content_recipient ON shared_content(shared_with_user_id, content_type);
CREATE INDEX idx_shared_content_sender ON shared_content(shared_by_user_id);
```

---

## Vector Database Structure

### ChromaDB Collections (Dev + MCP Access)

```python
# Collection per class per content type
collection_name = f"{user_id}_{class_id}_{content_type}"

# Example collections:
- "user123_calc1_textbooks"
- "user123_calc1_transcripts"
- "user123_calc1_notes"
- "user123_calc1_photos"
```

**Document Structure:**
```json
{
  "id": "recording_abc123",
  "embedding": [0.123, 0.456, ...],
  "metadata": {
    "user_id": "uuid",
    "class_id": "uuid",
    "content_type": "transcript",
    "source_id": "recording_id",
    "title": "Lecture: Derivatives",
    "date": "2025-10-29",
    "chunk_index": 0
  },
  "document": "Today we're discussing derivatives..."
}
```

### Qdrant Collections (Production)

Same structure but optimized for:
- Larger scale
- Better performance
- More complex filtering

---

## Content Flow: Backend → ChromaDB → MCP → AI Agent

### 1. Student Records Audio
```
Backend Code:
1. Save audio file to storage
2. Insert record to audio_recordings table
3. Call transcription service (Whisper)
4. Update transcript_text in database
5. Generate embeddings (OpenAI API)
6. Insert to ChromaDB with metadata
7. Store vector_id back to audio_recordings table
```

### 2. AI Agent Helps Debug (via MCP)
```
MCP Tools Available:
- chroma_search(class_id, query, content_type)
- chroma_get_collection_info(collection_name)
- chroma_peek_documents(collection_name, limit)
- chroma_count_documents(collection_name)

Example Use:
User: "Why isn't the AI finding my calculus notes?"
Me: *uses MCP to query ChromaDB*
    "I can see 12 documents in calc1_notes collection,
     but none have embeddings for 'derivatives' - 
     let's check if the embedding generation is working..."
```

---

## Summary

### PostgreSQL Tables: 16 Total
1. users
2. classes  
3. assignments
4. audio_recordings
5. photos
6. textbook_downloads
7. notes
8. note_sources
9. generated_tests
10. test_questions
11. flashcard_decks
12. flashcards
13. chat_conversations
14. chat_messages
15. classmate_connections
16. shared_content

### Vector Databases: 2
- **ChromaDB** (port 8000) - Dev/debugging + MCP
- **Qdrant** (port 6333) - Production

### Key Features Supported:
✅ Full textbook downloads
✅ Custom notes with source linking
✅ Transcripts → notes conversion
✅ AI-generated tests with questions
✅ AI-generated flashcard decks
✅ Class-specific AI chat with RAG
✅ Classmate sharing

---

## Backlog (Future Features)

### Teacher Accounts (Phase 2+)
```sql
-- Future tables:
CREATE TABLE teachers (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  school_id UUID REFERENCES schools(id),
  ...
);

CREATE TABLE teacher_classes (
  teacher_id UUID REFERENCES teachers(id),
  class_id UUID REFERENCES classes(id),
  ...
);

CREATE TABLE class_rosters (
  class_id UUID,
  student_user_id UUID,
  enrollment_code VARCHAR(20),
  ...
);
```

**Teacher Features:**
- Create classrooms
- Invite students via code
- Share resources with whole class
- View student progress
- Assign homework

---

## Next Steps

1. Start Docker services (includes ChromaDB now)
2. Create PostgreSQL tables in Supabase
3. (Optional) Create ChromaDB MCP server for dev help
4. Build backend API endpoints
5. Connect frontend to real backend

---

**Last Updated**: October 31, 2025
