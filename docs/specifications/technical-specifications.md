# Little Monster (LM) - Technical Specifications
## GPA Study Platform Application

**Version**: 1.3+  
**Last Updated**: October 30, 2025  
**Document Type**: Technical Implementation Guide  
**Derived From**: LM v1.3+ System Design Document

---

## 1. Technology Stack Overview

### 1.1 Frontend Stack
```
Core Framework: React 18+ with TypeScript
Build Tool: Vite (fast dev server, optimized bundling)
Styling: TailwindCSS (utility-first, consistent design system)
Routing: React Router v6 (code-split routes)
State Management: 
  - Zustand (lightweight app state)
  - React Query (server state, caching, sync)
UI Components: Custom component library built on Tailwind
Icons: Lucide React (tree-shakable, lightweight)
```

### 1.2 Backend Stack
```
Primary: Firebase Suite
  - Auth: Firebase Authentication
  - Database: Firestore (NoSQL document store)
  - Storage: Firebase Storage (videos, thumbnails)
  - Functions: Firebase Cloud Functions (serverless API)
  - Hosting: Firebase Hosting (static site deployment)

Alternative: Supabase (maintain API parity)
  - Auth: Supabase Auth
  - Database: PostgreSQL with realtime subscriptions
  - Storage: Supabase Storage
  - Functions: Supabase Edge Functions (Deno runtime)
```

### 1.3 AI & External Services
```
Content Generation: OpenAI GPT-4 / Claude API
Text-to-Speech: Web Speech API / ElevenLabs API
Content Moderation: OpenAI Moderation API + Custom filters
Video Processing: FFmpeg (Cloud Functions) / Placeholder system
Analytics: Firebase Analytics / Custom event tracking
```

## 2. Application Architecture

### 2.1 Frontend Architecture Pattern
**Client-Heavy Single Page Application (SPA)**
- Component-based React architecture
- Route-level code splitting for performance
- Offline-first approach with service worker caching
- Progressive enhancement for degraded connectivity

### 2.2 Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, Modal)
│   ├── video/           # Video-specific components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── forms/           # Form components and validation
├── pages/               # Route-level page components
│   ├── Home/
│   ├── Subjects/
│   ├── Planner/
│   ├── Videos/
│   ├── Play/
│   └── Customize/
├── hooks/               # Custom React hooks
├── stores/              # Zustand state stores
├── services/            # API clients and external services
├── utils/               # Helper functions and utilities
├── types/               # TypeScript type definitions
└── assets/              # Static assets (images, icons)
```

### 2.3 State Management Architecture
```typescript
// Zustand Stores
interface UserStore {
  user: User | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface VideoStore {
  filters: VideoFilters;
  sort: SortOption;
  updateFilters: (filters: Partial<VideoFilters>) => void;
  updateSort: (sort: SortOption) => void;
}

interface PlannerStore {
  events: PlannerEvent[];
  addEvent: (event: NewPlannerEvent) => void;
  updateEvent: (id: string, updates: Partial<PlannerEvent>) => void;
  deleteEvent: (id: string) => void;
}
```

## 3. Database Design

### 3.1 Firestore Collections Schema
```typescript
// Core Collections
interface User {
  id: string;
  email: string;
  displayName: string;
  avatarColor: string;
  subjects: Subject[];
  preferences: UserPreferences;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
}

interface Video {
  id: string;
  title: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  topic: string;
  createdBy: string; // user ID
  status: 'PENDING' | 'PUBLIC' | 'REJECTED';
  
  // Content
  scriptSummary: string;
  keyPoints: string[];
  timestamps: Timestamp[];
  
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Comment {
  id: string;
  videoId: string;
  userId: string;
  text: string;
  isHidden: boolean;
  createdAt: Timestamp;
  
  // Moderation
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderationReason?: string;
}

interface Rating {
  id: string;
  videoId: string;
  userId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface PlannerEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: Subject;
  type: 'assignment' | 'study' | 'exam' | 'project';
  startDate: Timestamp;
  endDate?: Timestamp;
  isCompleted: boolean;
  createdAt: Timestamp;
}
```

### 3.2 Firestore Indexes
```javascript
// Required Composite Indexes
[
  { collection: 'videos', fields: ['subject', 'createdAt'] },
  { collection: 'videos', fields: ['status', 'createdAt'] },
  { collection: 'videos', fields: ['createdBy', 'createdAt'] },
  { collection: 'videos', fields: ['ratingAvg', 'createdAt'] },
  { collection: 'comments', fields: ['videoId', 'createdAt'] },
  { collection: 'ratings', fields: ['videoId', 'userId'] },
  { collection: 'plannerEvents', fields: ['userId', 'startDate'] }
]
```

### 3.3 Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authentication helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidUser();
    }

    // Videos collection (public read, authenticated write)
    match /videos/{videoId} {
      allow read: if resource.data.status == 'PUBLIC';
      allow create: if isAuthenticated() && isValidVideo();
      allow update: if isAuthenticated() && 
        (isOwner(resource.data.createdBy) || isSystemUpdate());
    }

    // Comments collection
    match /comments/{commentId} {
      allow read: if resource.data.isHidden != true;
      allow create: if isAuthenticated() && isValidComment();
      allow update: if false; // Immutable, moderation via functions
    }

    // Ratings collection
    match /ratings/{ratingId} {
      allow read: if true;
      allow write: if isAuthenticated() && isValidRating();
    }

    // Planner events (private to user)
    match /plannerEvents/{eventId} {
      allow read, write: if isAuthenticated() && 
        isOwner(resource.data.userId);
    }
  }
}
```

## 4. API Design

### 4.1 RESTful Endpoints (Cloud Functions)
```typescript
// Video Generation API
POST /api/ai/generateVideo
Request: {
  topic: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  userId: string;
}
Response: {
  videoId: string;
  status: 'PENDING' | 'PROCESSING';
}

// Content Moderation API
POST /api/ai/moderate
Request: {
  type: 'prompt' | 'comment';
  content: string;
  context?: { subject?: Subject; videoId?: string; }
}
Response: {
  approved: boolean;
  confidence: number;
  reasons?: string[];
}

// Video Feed API
GET /api/videos/feed?subject=Math&sort=recent&cursor=abc123
Response: {
  videos: Video[];
  nextCursor?: string;
  hasMore: boolean;
}

// Analytics API
POST /api/analytics/event
Request: {
  eventType: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
}
Response: { success: boolean; }
```

### 4.2 Real-time Subscriptions
```typescript
// Firestore real-time listeners
const useVideoComments = (videoId: string) => {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => subscribeToComments(videoId),
    staleTime: 30000, // 30 seconds
  });
};

const usePlannerEvents = (userId: string) => {
  return useQuery({
    queryKey: ['plannerEvents', userId],
    queryFn: () => subscribeToPlannerEvents(userId),
    enabled: !!userId,
  });
};
```

## 5. Frontend Implementation Details

### 5.1 Component Architecture
```typescript
// Base Component Pattern
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Compound Component Pattern for Complex UI
const VideoCard = {
  Root: VideoCardRoot,
  Thumbnail: VideoCardThumbnail,
  Content: VideoCardContent,
  Actions: VideoCardActions,
};

// Custom Hooks Pattern
const useVideoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateVideo = useCallback(async (data: VideoGenerationData) => {
    setIsGenerating(true);
    try {
      const result = await videoApi.generate(data);
      return result;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  return { generateVideo, isGenerating };
};
```

### 5.2 Route Configuration
```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { 
        path: 'subjects', 
        element: <SubjectsLayout />,
        children: [
          { index: true, element: <SubjectsOverview /> },
          { path: ':subject', element: <SubjectWorkspace /> },
        ]
      },
      { path: 'planner', element: <PlannerPage /> },
      { path: 'videos', element: <VideoFeedPage /> },
      { path: 'videos/:id', element: <VideoDetailPage /> },
      { path: 'play', element: <GameHubPage /> },
      { path: 'customize', element: <CustomizePage /> },
      { path: 'users/:id', element: <CreatorProfilePage /> },
    ],
  },
]);
```

### 5.3 Performance Optimization
```typescript
// Code Splitting
const VideoDetailPage = lazy(() => import('./pages/VideoDetail'));
const GameHubPage = lazy(() => import('./pages/GameHub'));

// Image Optimization
const OptimizedImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageSrc(src);
  }, [src]);
  
  return (
    <img 
      src={imageSrc}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};

// Virtual Scrolling for Large Lists
const VirtualizedVideoFeed: React.FC = () => {
  const rowVirtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
  });
  
  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <VideoCard
            key={virtualItem.key}
            video={videos[virtualItem.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

## 6. Backend Implementation

### 6.1 Cloud Functions Architecture
```typescript
// Video Generation Function
export const generateVideo = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to generate videos'
    );
  }
  
  // Input validation
  const { topic, subject, difficulty } = data;
  if (!topic || !subject) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }
  
  // Moderation check
  const moderationResult = await moderateContent(topic, subject);
  if (!moderationResult.approved) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      `Content rejected: ${moderationResult.reasons?.join(', ')}`
    );
  }
  
  // Create pending video document
  const videoRef = admin.firestore().collection('videos').doc();
  await videoRef.set({
    id: videoRef.id,
    title: topic,
    subject,
    difficulty,
    createdBy: context.auth.uid,
    status: 'PENDING',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Trigger async generation
  await generateVideoContent(videoRef.id, { topic, subject, difficulty });
  
  return { videoId: videoRef.id };
});

// Comment Moderation Trigger
export const moderateComment = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snap, context) => {
    const comment = snap.data();
    
    const moderationResult = await moderateContent(comment.text, 'comment');
    
    if (!moderationResult.approved) {
      await snap.ref.update({
        isHidden: true,
        moderationStatus: 'REJECTED',
        moderationReason: moderationResult.reasons?.join(', '),
      });
    } else {
      await snap.ref.update({
        moderationStatus: 'APPROVED',
      });
    }
  });

// Rating Aggregation Trigger
export const updateRatingAverage = functions.firestore
  .document('ratings/{ratingId}')
  .onWrite(async (change, context) => {
    const rating = change.after.exists ? change.after.data() : null;
    const previousRating = change.before.exists ? change.before.data() : null;
    
    if (!rating) return; // Document deleted
    
    const videoRef = admin.firestore().collection('videos').doc(rating.videoId);
    
    return admin.firestore().runTransaction(async (transaction) => {
      const videoDoc = await transaction.get(videoRef);
      const video = videoDoc.data();
      
      if (!video) return;
      
      // Recalculate rating average
      const ratingsSnapshot = await admin.firestore()
        .collection('ratings')
        .where('videoId', '==', rating.videoId)
        .get();
      
      const ratings = ratingsSnapshot.docs.map(doc => doc.data().stars);
      const average = ratings.reduce((sum, stars) => sum + stars, 0) / ratings.length;
      
      transaction.update(videoRef, {
        ratingAvg: average,
        ratingCount: ratings.length,
      });
    });
  });
```

### 6.2 AI Service Integration
```typescript
interface AIService {
  generateScript(prompt: GenerationPrompt): Promise<VideoScript>;
  moderateContent(content: string, type: ContentType): Promise<ModerationResult>;
  generateThumbnail(script: VideoScript): Promise<string>;
}

class OpenAIService implements AIService {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async generateScript(prompt: GenerationPrompt): Promise<VideoScript> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Generate an educational video script for ${prompt.subject} 
                   at ${prompt.difficulty} level. Target duration: 90-150 seconds.
                   Include: title, key points with timestamps, and summary.`
        },
        {
          role: 'user',
          content: `Topic: ${prompt.topic}`
        }
      ],
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  }
  
  async moderateContent(content: string, type: ContentType): Promise<ModerationResult> {
    const moderation = await this.client.moderations.create({
      input: content,
    });
    
    const result = moderation.results[0];
    
    return {
      approved: !result.flagged,
      confidence: Math.max(...Object.values(result.category_scores)),
      reasons: result.flagged 
        ? Object.entries(result.categories)
            .filter(([_, flagged]) => flagged)
            .map(([category, _]) => category)
        : undefined,
    };
  }
}
```

## 7. Development Workflow

### 7.1 Development Environment Setup
```bash
# Project initialization
npm create vite@latest lm-gpa-app -- --template react-ts
cd lm-gpa-app

# Install dependencies
npm install react-router-dom @tanstack/react-query zustand
npm install firebase @firebase/app @firebase/firestore
npm install tailwindcss @tailwindcss/forms lucide-react
npm install -D @types/node @typescript-eslint/eslint-plugin
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Firebase setup
npm install -g firebase-tools
firebase init
```

### 7.2 Build & Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run type-check
      - run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: lm-gpa-app
```

### 7.3 Testing Strategy
```typescript
// Unit Tests (Vitest + React Testing Library)
describe('VideoCard Component', () => {
  it('displays video information correctly', () => {
    const mockVideo = {
      id: '1',
      title: 'Calculus Basics',
      subject: 'Math',
      ratingAvg: 4.5,
      createdBy: 'user1',
    };
    
    render(<VideoCard video={mockVideo} />);
    
    expect(screen.getByText('Calculus Basics')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });
});

// Integration Tests
describe('Video Generation Flow', () => {
  it('generates video successfully', async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: TestProviders });
    
    // Navigate to generation modal
    await user.click(screen.getByText('Generate Video'));
    
    // Fill form
    await user.type(screen.getByLabelText('Topic'), 'Quadratic Equations');
    await user.selectOptions(screen.getByLabelText('Subject'), 'Math');
    
    // Submit
    await user.click(screen.getByText('Generate'));
    
    // Assert success
    await waitFor(() => {
      expect(screen.getByText('Video generation started')).toBeInTheDocument();
    });
  });
});
```

## 8. Monitoring & Analytics

### 8.1 Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: Metric) => {
  analytics.track('web_vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 8.2 Error Tracking
```typescript
// Global error boundary
class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error);
    
    // Send to error tracking service
    analytics.track('error', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

## 9. Security Implementation

### 9.1 Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.firebase.googleapis.com https://api.openai.com;">
```

### 9.2 Input Validation & Sanitization
```typescript
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Schema validation
const VideoGenerationSchema = z.object({
  topic: z.string().min(3).max(200).regex(/^[a-zA-Z0-9\s\-_.,!?]+$/),
  subject: z.enum(['Math', 'Chemistry', 'History', 'English']),
  difficulty: z.enum(['Intro', 'Standard', 'Honors']).optional(),
});

// Sanitization utility
export const sanitizeUserInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
};

// Rate limiting (client-side)
export const useRateLimit = (maxRequests: number, windowMs: number) => {
  const [requests, setRequests] = useState<number[]>([]);
  
  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    setRequests([...recentRequests, now]);
    return true;
  }, [requests, maxRequests, windowMs]);
  
  return canMakeRequest;
};
```

## 10. Performance Benchmarks

### 10.1 Target Metrics
- **First Contentful Paint (FCP)**: < 1.2s
- **Time to Interactive (TTI)**: < 1.5s (desktop), < 2.5s (mobile)
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **API Response Time**: < 200ms (P95)
- **Bundle Size**: < 500KB (initial), < 100KB (route chunks)

### 10.2 Optimization Techniques
```typescript
// Bundle optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
});

// Image optimization
const useImageOptimization = (src: string, options?: ImageOptions) => {
  return useMemo(() => {
    if (!src) return '';
    
    const url = new URL(src);
    url.searchParams.set('w', String(options?.width || 400));
    url.searchParams.set('h', String(options?.height || 300));
    url.searchParams.set('q', String(options?.quality || 80));
    url.searchParams.set('f', 'webp');
    
    return url.toString();
  }, [src, options]);
};
```

---

This technical specification provides a comprehensive implementation guide for building the Little Monster GPA study platform, ensuring scalability, maintainability, and performance while meeting all functional requirements.
