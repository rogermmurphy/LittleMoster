# Database Schema
## Little Monster GPA Study Platform

**Created**: October 30, 2025  
**Status**: Ready for Implementation

---

## Overview

This document defines the database schema for the Little Monster GPA platform. The schema supports student accounts, class management, content capture (audio/photos/textbooks), AI-generated study materials, and collaboration features.

---

## Core Database Tables

### 1. users
**Purpose**: Student accounts and profile data

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  state VARCHAR(50),
  grade_level VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

---

### 2. classes
**Purpose**: Individual classes/courses the student is enrolled in

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  teacher_name VARCHAR(100),
  period VARCHAR(20),
  color VARCHAR(20),
  current_grade VARCHAR(5),
  grade_percent INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classes_user ON classes(user_id);
```

---

### 3. assignments
**Purpose**: Track upcoming homework, tests, essays

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50),
  due_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_class ON assignments(class_id, due_date);
CREATE INDEX idx_assignments_user ON assignments(user_id, due_date);
```

---

### 4. audio_recordings
**Purpose**: Lecture recordings with transcription

```sql
CREATE TABLE audio_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  file_url TEXT NOT NULL,
  duration INTEGER,
  transcript_text TEXT,
  transcript_status VARCHAR(20) DEFAULT 'pending',
  notes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recordings_class ON audio_recordings(class_id, created_at DESC);
```

---

### 5. photos
**Purpose**: Captured images (whiteboards, homework, etc.)

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  extracted_text TEXT,
  extraction_status VARCHAR(20) DEFAULT 'pending',
  notes_linked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_photos_class ON photos(class_id, created_at DESC);
CREATE INDEX idx_photos_search ON photos USING GIN(to_tsvector('english', extracted_text));
```

---

### 6. notes
**Purpose**: Student-created or AI-generated notes

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  source_type VARCHAR(50),
  source_description TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_class ON notes(class_id, created_at DESC);
CREATE INDEX idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || content));
```

---

### 7. chat_conversations
**Purpose**: AI chat sessions per class

```sql
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
```

---

### 8. chat_messages
**Purpose**: Individual messages in AI conversations

```sql
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

---

### 9. document_uploads
**Purpose**: Textbooks and study materials uploaded by user

```sql
CREATE TABLE document_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  file_type VARCHAR(20),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  page_count INTEGER,
  embedding_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_class ON document_uploads(class_id);
CREATE INDEX idx_documents_user ON document_uploads(user_id);
```

---

### 10. document_chunks
**Purpose**: Text chunks for RAG (Retrieval Augmented Generation)

```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES document_uploads(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  embedding_vector VECTOR(3072),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chunks_document ON document_chunks(document_id, chunk_index);
```

---

### 11. classmate_shares
**Purpose**: Sharing notes with other students

```sql
CREATE TABLE classmate_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  shared_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shares_recipient ON classmate_shares(shared_with_user_id);
```

---

## Summary

**Total Tables**: 11 core tables
**Foreign Keys**: Multiple (all with CASCADE delete)
**Full-Text Search**: 2 tables (photos, notes)
**Vector Search**: 1 table (document_chunks for RAG)

---

**Last Updated**: October 31, 2025
