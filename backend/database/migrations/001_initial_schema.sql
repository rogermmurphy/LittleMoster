-- Little Monster GPA Platform - Initial Database Schema
-- Migration: 001_initial_schema
-- Created: October 30, 2025
-- Tables: 16 core tables for student-centric features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE USER & CLASS TABLES
-- ============================================================================

-- 1. USERS (Students)
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
  grade_percent INTEGER CHECK (grade_percent >= 0 AND grade_percent <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX idx_classes_user ON classes(user_id);

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

-- ============================================================================
-- CONTENT CAPTURE TABLES
-- ============================================================================

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

-- ============================================================================
-- NOTES & GENERATED CONTENT TABLES
-- ============================================================================

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

-- 8. NOTE_SOURCES (links notes to recordings/photos/transcripts)
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

-- ============================================================================
-- CHAT & COLLABORATION TABLES
-- ============================================================================

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
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sources JSONB,
  token_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at);

-- 15. CLASSMATE_CONNECTIONS
CREATE TABLE classmate_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  classmate_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
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

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE classmate_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_content ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Classes belong to user
CREATE POLICY "Users can access own classes" ON classes
  FOR ALL USING (auth.uid() = user_id);

-- All other tables follow similar pattern: user_id or class ownership
CREATE POLICY "Users can access own assignments" ON assignments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own recordings" ON audio_recordings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own photos" ON photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own textbooks" ON textbook_downloads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access note sources for own notes" ON note_sources
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM notes WHERE notes.id = note_sources.note_id AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can access own tests" ON generated_tests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view questions from own tests" ON test_questions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM generated_tests WHERE generated_tests.id = test_questions.test_id AND generated_tests.user_id = auth.uid()
  ));

CREATE POLICY "Users can access own flashcard decks" ON flashcard_decks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view cards from own decks" ON flashcards
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM flashcard_decks WHERE flashcard_decks.id = flashcards.deck_id AND flashcard_decks.user_id = auth.uid()
  ));

CREATE POLICY "Users can access own conversations" ON chat_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages from own conversations" ON chat_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own connections" ON classmate_connections
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = classmate_user_id);

CREATE POLICY "Users can view content shared with them" ON shared_content
  FOR SELECT USING (auth.uid() = shared_with_user_id OR auth.uid() = shared_by_user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_recordings_updated_at BEFORE UPDATE ON audio_recordings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_textbooks_updated_at BEFORE UPDATE ON textbook_downloads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON generated_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON flashcard_decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON flashcards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
