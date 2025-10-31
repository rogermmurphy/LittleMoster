<!--
  Little Monster GPA Study Platform
  Phase 1.3 Implementation Plan: Frontend-Backend Integration
  
  Author: Ella K. Murphy (ella.k.murphy@gmail.com)
  Created: October 31, 2025 10:44 AM CST
  Last Updated: October 31, 2025 10:44 AM CST
  Version: 1.0
  Status: Ready to Begin
  
  This is a LIVING DOCUMENT - Update as integration progresses
-->

# Phase 1.3: Frontend-Backend Integration
## Little Monster GPA Study Platform

**Version**: 1.0  
**Created**: October 31, 2025 10:44 AM CST  
**Author**: Ella K. Murphy (ella.k.murphy@gmail.com)  
**Duration**: 1-2 weeks (7-14 days)  
**Status**: Ready to Begin  
**Prerequisites**: Phase 1.1 & 1.2 Complete ✅

---

## Phase 1.3 Overview

Phase 1.3 connects the React web application frontend (built in Phase 1.x) to the backend API (built in Phases 1.1 & 1.2). This phase replaces all mock data with real API calls, implements authentication flows, and tests complete end-to-end user workflows.

**Phase 1.3 Objectives:**
- Connect all React pages to backend APIs
- Implement authentication state management
- Replace mock data with API responses
- Test all upload workflows (audio, photos, PDFs)
- Test AI chat with RAG
- Verify source citations display correctly
- Complete end-to-end user testing
- Deploy to staging environment

---

## Prerequisites Summary

**Phase 1.1 Complete:**
- Backend API running on http://localhost:3000
- Auth + Classes endpoints tested (100% pass rate)
- Database deployed with 16 tables
- Git: commits c60e3f4 through 127df2b pushed to GitHub

**Phase 1.2 Complete:**
- 38 API endpoints operational
- 15 backend services
- Local AI stack (GPT-OSS via Ollama)
- Vector database (ChromaDB)
- Background job processing (Bull + Redis)

**Phase 1.x Complete:**
- React web app with TailwindCSS
- All UI pages built (Onboarding, Dashboard, ClassDetail, etc.)
- Currently using mock data
- Global AI chatbot component

---

## Week 1: Authentication & Core Features (Days 1-7)

### Day 1: Authentication State Management

**Tasks:**
1. Install React dependencies: `react-query`, `zustand`
2. Create `web-app/src/stores/auth.store.ts` - Auth state with Zustand
3. Create `web-app/src/api/client.ts` - Axios instance with interceptors
4. Create `web-app/src/api/auth.api.ts` - Auth API calls
5. Create `web-app/src/hooks/useAuth.ts` - Auth hook
6. Test authentication flow

**Deliverables:**
- Auth store managing user state and tokens
- API client with automatic token injection
- Login/register working with backend
- Token refresh mechanism
- Protected routes

---

### Day 2-3: Class Dashboard Integration

**Tasks:**
1. Create `web-app/src/api/classes.api.ts`
2. Update `ClassDashboardPage.tsx` to call real API
3. Replace mock class data with API responses
4. Test class creation, update, delete
5. Add loading states and error handling
6. Test with multiple classes

**Deliverables:**
- ClassDashboardPage connected to backend
- Real classes displaying from database
- CRUD operations working
- Error states handled gracefully

---

### Day 4-5: Audio Upload Integration

**Tasks:**
1. Create `web-app/src/api/audio.api.ts`
2. Update audio upload component
3. Implement file upload with progress
4. Display transcription status (pending/processing/complete)
5. Show transcript when available
6. Test with sample audio files

**Deliverables:**
- Audio upload working end-to-end
- File upload progress indicator
- Transcription status tracking
- Transcript viewer functional

---

### Day 6-7: Photo & Textbook Upload

**Tasks:**
1. Create `web-app/src/api/photos.api.ts`
2. Create `web-app/src/api/textbooks.api.ts`
3. Update photo upload component
4. Update textbook upload component
5. Display OCR status and extracted text
6. Display PDF processing status
7. Test complete upload workflows

**Deliverables:**
- Photo upload with OCR working
- Textbook PDF upload working
- Processing status indicators
- Extracted content display

---

## Week 2: AI Features & Testing (Days 8-14)

### Day 8-9: AI Chat Integration

**Tasks:**
1. Create `web-app/src/api/chat.api.ts`
2. Update AI chat component
3. Connect to backend RAG endpoint
4. Display source citations
5. Show conversation history
6. Test with real class content

**Deliverables:**
- AI chat connected to GPT-OSS
- RAG context retrieval working
- Source citations displaying
- Conversation management functional

---

### Day 10-11: Notes & Assignments

**Tasks:**
1. Create `web-app/src/api/notes.api.ts`
2. Create `web-app/src/api/assignments.api.ts`
3. Update notes components
4. Update assignments components
5. Test note creation with sources
6. Test assignment tracking

**Deliverables:**
- Notes CRUD connected
- Source indicators showing
- Assignments CRUD connected
- Due date tracking working

---

### Day 12-13: End-to-End Testing

**Tasks:**
1. Complete user flow testing:
   - Register → Login → Create Class
   - Upload Audio → View Transcript
   - Upload Photo → View OCR Text
   - Upload Textbook → View Content
   - Chat with AI → Get Answer with Sources
   - Create Note → Link to Sources
   - Create Assignment → Track Status
2. Fix any issues found
3. Performance optimization
4. Error handling improvements

**Deliverables:**
- All workflows tested
- Issues documented and fixed
- Performance acceptable
- Error states handled

---

### Day 14: Staging Deployment

**Tasks:**
1. Set up staging environment
2. Configure environment variables
3. Deploy backend API
4. Deploy frontend app
5. Test in staging
6. Document deployment process

**Deliverables:**
- Staging environment live
- All features working in staging
- Deployment documented
- Phase 1.3 complete

---

## Technical Implementation Details

### API Client Setup

```typescript
// web-app/src/api/client.ts
import axios from 'axios';
import { authStore } from '../stores/auth.store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      await authStore.getState().refreshToken();
      // Retry original request
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Auth Store (Zustand)

```typescript
// web-app/src/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (data.success) {
          set({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            isAuthenticated: true
          });
        }
      },
      
      // ... other methods
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken
      })
    }
  )
);
```

---

## API Endpoints Reference

**Base URL:** http://localhost:3000/api

**Auth (4 endpoints):**
- POST /auth/register
- POST /auth/login
- POST /auth/refresh-token
- GET /auth/me

**Classes (5):**
- POST /classes
- GET /classes
- GET /classes/:id
- PATCH /classes/:id
- DELETE /classes/:id

**Audio (5):**
- POST /audio/upload
- GET /audio?classId=xxx
- GET /audio/:id
- PATCH /audio/:id
- DELETE /audio/:id

**Photos (5):**
- POST /photos/upload
- GET /photos?classId=xxx
- GET /photos/:id
- PATCH /photos/:id
- DELETE /photos/:id

**Textbooks (5):**
- POST /textbooks/upload
- GET /textbooks?classId=xxx
- GET /textbooks/:id
- PATCH /textbooks/:id
- DELETE /textbooks/:id

**Chat (4):**
- POST /chat
- GET /chat/conversations?classId=xxx
- GET /chat/:conversationId
- DELETE /chat/:conversationId

**Notes (5):**
- POST /notes
- GET /notes?classId=xxx
- GET /notes/:id
- PATCH /notes/:id
- DELETE /notes/:id

**Assignments (5):**
- POST /assignments
- GET /assignments?classId=xxx
- GET /assignments/:id
- PATCH /assignments/:id
- DELETE /assignments/:id

---

## Testing Strategy

### Unit Tests
- API client functions
- Store actions
- Component rendering

### Integration Tests
- API call flows
- State management
- Error handling

### E2E Tests (Playwright)
- Complete user workflows
- Authentication flows
- Content upload workflows
- AI chat interactions

---

## Phase 1.3 Completion Criteria

**Technical:**
- ✅ All UI pages connected to backend
- ✅ No mock data remaining
- ✅ Authentication working
- ✅ All upload workflows functional
- ✅ AI chat working with RAG
- ✅ Error states handled
- ✅ Loading states implemented

**Testing:**
- ✅ All workflows tested manually
- ✅ E2E tests passing
- ✅ No critical bugs
- ✅ Performance acceptable

**Documentation:**
- ✅ API integration documented
- ✅ Deployment guide updated
- ✅ User testing notes

**Deployment:**
- ✅ Staging environment live
- ✅ All features working
- ✅ Ready for Phase 2

---

**Document Status**: Living Document  
**Last Updated**: October 31, 2025 10:44 AM CST  
**Next Review**: End of Week 1 (Day 7)  
**Current Status**: Plan Complete - Ready to Begin
