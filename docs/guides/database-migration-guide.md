# Database Migration Guide

## Quick Start (5 minutes)

The database migration **must** be run manually in the Supabase SQL Editor. This is the standard approach for Supabase projects.

### Step 1: Open SQL Editor

Navigate to: https://supabase.com/dashboard/project/itqymuvrqciabsnaitnw/sql/new

Or in your dashboard:
1. Click "SQL Editor" in the left sidebar
2. Click "New query"

### Step 2: Copy the Migration SQL

Open this file: `backend/database/migrations/001_initial_schema.sql`

Or copy from VS Code:
- File location: `backend/database/migrations/001_initial_schema.sql`
- Select all (Ctrl+A / Cmd+A)
- Copy (Ctrl+C / Cmd+C)

### Step 3: Paste and Run

1. Paste the SQL into the Supabase SQL Editor
2. Click the green "Run" button (or press Ctrl+Enter / Cmd+Enter)
3. Wait for completion (should take 2-5 seconds)

### Step 4: Verify Success

You should see: **"Success. No rows returned"**

This means:
- ✅ 16 tables created
- ✅ All indexes created
- ✅ RLS policies enabled
- ✅ Triggers set up

### What Gets Created

**16 Tables:**
1. users - Student accounts
2. classes - Student's classes
3. assignments - Homework/projects
4. audio_recordings - Lecture recordings with transcripts
5. photos - Whiteboard/notes photos with OCR
6. textbook_downloads - PDF textbooks with embeddings
7. notes - Student notes (AI or manual)
8. note_sources - Links notes to source material
9. generated_tests - AI-generated practice tests
10. test_questions - Questions for tests
11. flashcard_decks - Study card collections
12. flashcards - Individual flashcards
13. chat_conversations - AI tutor conversations
14. chat_messages - Chat history
15. classmate_connections - Friend connections
16. shared_content - Content sharing between students

**Security:**
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Service role key bypasses RLS for backend operations

## Troubleshooting

### "Permission denied"
- Ensure you're logged into the correct Supabase account
- Check that you have admin access to the project

### "Already exists" errors
- Tables may already be created
- You can skip this or drop tables first if needed

### Need to reset database?
Run this first to drop all tables:
```sql
DROP TABLE IF EXISTS shared_content CASCADE;
DROP TABLE IF EXISTS classmate_connections CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS flashcard_decks CASCADE;
DROP TABLE IF EXISTS test_questions CASCADE;
DROP TABLE IF EXISTS generated_tests CASCADE;
DROP TABLE IF EXISTS note_sources CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS textbook_downloads CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS audio_recordings CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

## Next Steps After Migration

Once migration is complete, we can:
1. Test database connections from the backend
2. Build authentication API
3. Build classes CRUD API
4. Connect frontend to backend

---

**Questions?** Let me know if you encounter any issues!
