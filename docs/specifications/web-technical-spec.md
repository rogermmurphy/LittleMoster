# Little Monster (LM) - Web Application Technical Specifications
## GPA Study Platform - Web Component

**Version**: 1.3+  
**Last Updated**: October 30, 2025  
**Document Type**: Web Platform Technical Implementation Guide  
**Target Platform**: Modern Web Browsers with Progressive Enhancement

---

## 1. Web Technology Stack

### 1.1 Core Frontend Technologies
```typescript
// Primary Framework Stack
React: 18.2+ with concurrent features and Suspense
TypeScript: 5.0+ with strict mode and advanced type features
Vite: 4.5+ for development server and optimized production builds
TailwindCSS: 3.3+ with JIT compilation and custom design system

// State Management
Zustand: 4.4+ for lightweight global state management
React Query: 4.0+ (TanStack Query) for server state and caching
Jotai: 2.0+ for atomic state management of complex UI state

// Routing and Navigation
React Router: 6.8+ with data loading and error boundaries
Wouter: 2.8+ as lightweight alternative for simple routing needs
```

### 1.2 Web-Specific Libraries and Tools
```typescript
// Audio Processing
Web Audio API: Native browser audio processing
MediaRecorder API: For voice recording functionality
WebRTC: Real-time audio/video communication
Tone.js: Advanced audio synthesis and effects
WaveSurfer.js: Audio waveform visualization

// Video Processing
Video.js: Advanced HTML5 video player
HLS.js: HTTP Live Streaming support
MediaSource Extensions: Adaptive streaming implementation
WebCodecs API: Hardware-accelerated video processing (when available)

// Performance and PWA
Workbox: Service worker management and caching strategies
Web Vitals: Core Web Vitals measurement and optimization
Intersection Observer: Efficient scroll-based interactions
ResizeObserver: Dynamic layout adjustments
```

### 1.3 Build and Development Tools
```json
{
  "build": {
    "bundler": "Vite 4.5+",
    "transpiler": "SWC (Speedy Web Compiler)",
    "cssProcessor": "PostCSS with Tailwind",
    "bundleAnalysis": "Rollup Bundle Analyzer",
    "optimization": "Tree shaking, code splitting, minification"
  },
  "development": {
    "devServer": "Vite dev server with HMR",
    "testing": "Vitest + React Testing Library",
    "e2e": "Playwright for cross-browser testing",
    "linting": "ESLint + Prettier + TypeScript ESLint",
    "debugging": "React DevTools + React Query DevTools"
  }
}
```

## 2. Web Architecture Implementation

### 2.1 Component Architecture Pattern
```typescript
// Atomic Design Pattern Implementation
interface ComponentHierarchy {
  atoms: 'Button' | 'Input' | 'Icon' | 'Avatar' | 'Badge';
  molecules: 'SearchBox' | 'VideoCard' | 'CommentItem' | 'RatingStars';
  organisms: 'VideoFeed' | 'NavigationHeader' | 'PlannerCalendar';
  templates: 'PageLayout' | 'ModalLayout' | 'SidebarLayout';
  pages: 'HomePage' | 'VideoDetailPage' | 'PlannerPage';
}

// Compound Component Pattern for Complex UI
const VideoPlayer = {
  Root: VideoPlayerRoot,
  Video: VideoPlayerVideo,
  Controls: VideoPlayerControls,
  Timeline: VideoPlayerTimeline,
  VolumeControl: VideoPlayerVolumeControl,
  FullscreenButton: VideoPlayerFullscreenButton,
  SettingsMenu: VideoPlayerSettingsMenu,
} as const;

// Usage Pattern
<VideoPlayer.Root>
  <VideoPlayer.Video src={videoUrl} />
  <VideoPlayer.Controls>
    <VideoPlayer.Timeline />
    <VideoPlayer.VolumeControl />
    <VideoPlayer.FullscreenButton />
    <VideoPlayer.SettingsMenu />
  </VideoPlayer.Controls>
</VideoPlayer.Root>
```

### 2.2 State Management Architecture
```typescript
// Zustand Store Pattern
interface AppStore {
  // User state
  user: UserState;
  setUser: (user: User) => void;
  clearUser: () => void;
  
  // UI state
  theme: ThemeState;
  sidebar: SidebarState;
  modals: ModalState;
  
  // Feature-specific state
  video: VideoPlayerState;
  planner: PlannerState;
  
  // Actions
  actions: {
    updateTheme: (theme: Partial<ThemeState>) => void;
    toggleSidebar: () => void;
    openModal: (modalId: string, props?: any) => void;
  };
}

// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Custom Hooks for Data Fetching
const useVideoFeed = (filters: VideoFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['videos', 'feed', filters],
    queryFn: ({ signal }) => videoApi.getFeed(filters, { signal }),
    keepPreviousData: true,
    staleTime: 30000,
    ...options,
  });
};

const useVideoGeneration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VideoGenerationRequest) => videoApi.generate(data),
    onSuccess: (newVideo) => {
      queryClient.invalidateQueries(['videos', 'feed']);
      queryClient.setQueryData(['videos', newVideo.id], newVideo);
    },
  });
};
```

### 2.3 Routing and Code Splitting
```typescript
// Route-based Code Splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const VideoFeedPage = lazy(() => import('../pages/VideoFeedPage'));
const VideoDetailPage = lazy(() => import('../pages/VideoDetailPage'));
const PlannerPage = lazy(() => import('../pages/PlannerPage'));
const SubjectWorkspacePage = lazy(() => import('../pages/SubjectWorkspacePage'));

// Router Configuration with Data Loading
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homePageLoader,
      },
      {
        path: 'videos',
        element: <VideoFeedPage />,
        loader: videoFeedLoader,
      },
      {
        path: 'videos/:id',
        element: <VideoDetailPage />,
        loader: videoDetailLoader,
        errorElement: <VideoNotFound />,
      },
      {
        path: 'planner',
        element: <PlannerPage />,
        loader: plannerLoader,
      },
      {
        path: 'subjects/:subject',
        element: <SubjectWorkspacePage />,
        loader: subjectWorkspaceLoader,
      },
    ],
  },
]);

// Data Loaders with React Query Integration
const videoDetailLoader: LoaderFunction = async ({ params }) => {
  const videoId = params.id!;
  
  return queryClient.ensureQueryData({
    queryKey: ['videos', videoId],
    queryFn: () => videoApi.getById(videoId),
  });
};
```

## 3. Web-Specific Performance Optimizations

### 3.1 Bundle Optimization Strategy
```typescript
// Vite Configuration for Optimal Bundling
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          
          // Feature chunks
          video: ['video.js', 'hls.js'],
          audio: ['tone', 'wavesurfer.js'],
          charts: ['recharts', 'd3'],
          
          // UI chunks
          ui: ['@radix-ui/react-dialog', '@headlessui/react'],
        },
        
        // Optimize chunk size
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '') 
            : 'chunk';
          return `${facadeModuleId}-[hash].js`;
        },
      },
    },
    
    // Optimization settings
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true,
  },
  
  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env'],
  },
});
```

### 3.2 Progressive Web App Implementation
```typescript
// Service Worker with Workbox
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache strategies for different resource types
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [{
      cacheMaxEntries: 100,
      cacheMaxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    }],
  })
);

registerRoute(
  ({ request }) => request.destination === 'video',
  new CacheFirst({
    cacheName: 'video-cache',
    plugins: [{
      cacheMaxEntries: 20,
      cacheMaxAgeSeconds: 24 * 60 * 60, // 1 day
    }],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [{
      cacheMaxAgeSeconds: 5 * 60, // 5 minutes
    }],
  })
);

// Web App Manifest
const webAppManifest = {
  name: 'Little Monster - GPA Study Platform',
  short_name: 'LM Study',
  description: 'AI-powered study platform for academic success',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#3b82f6',
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
  categories: ['education', 'productivity'],
  shortcuts: [
    {
      name: 'Generate Video',
      url: '/videos/generate',
      description: 'Create a new AI study video',
    },
    {
      name: 'Study Planner',
      url: '/planner',
      description: 'View and manage your study schedule',
    },
  ],
};
```

### 3.3 Audio Processing Implementation
```typescript
// Web Audio API Integration for Advanced Audio Features
class AudioProcessor {
  private audioContext: AudioContext;
  private mediaRecorder: MediaRecorder;
  private audioAnalyzer: AnalyserNode;
  
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.setupAudioPipeline();
  }
  
  private setupAudioPipeline() {
    // Create audio nodes for processing
    this.audioAnalyzer = this.audioContext.createAnalyser();
    this.audioAnalyzer.fftSize = 2048;
    
    // Connect to destination for monitoring
    this.audioAnalyzer.connect(this.audioContext.destination);
  }
  
  async startRecording(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      },
    });
    
    // Connect stream to analyzer
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.audioAnalyzer);
    
    // Setup MediaRecorder for high-quality recording
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 128000,
    });
    
    return stream;
  }
  
  // Real-time audio visualization
  getAudioData(): Uint8Array {
    const bufferLength = this.audioAnalyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.audioAnalyzer.getByteFrequencyData(dataArray);
    return dataArray;
  }
  
  // Audio transcription using Web Speech API
  startTranscription(language = 'en-US'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      let finalTranscript = '';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Emit interim results for real-time feedback
        this.onTranscriptionUpdate?.(interimTranscript, finalTranscript);
      };
      
      recognition.onend = () => {
        resolve(finalTranscript);
      };
      
      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };
      
      recognition.start();
    });
  }
}
```

## 4. Web Security and Performance Implementation

### 4.1 Content Security Policy Configuration
```typescript
// CSP Header Configuration
const cspConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for some React features
    'https://apis.google.com',
    'https://www.google-analytics.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
  ],
  'media-src': [
    "'self'",
    'blob:',
    'https://*.firebase.googleapis.com',
  ],
  'connect-src': [
    "'self'",
    'https://*.firebase.googleapis.com',
    'https://api.openai.com',
    'wss://*.firebase.googleapis.com',
  ],
  'worker-src': [
    "'self'",
    'blob:',
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

// Implement CSP in Vite build
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'csp-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const cspHeader = Object.entries(cspConfig)
            .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
            .join('; ');
          
          res.setHeader('Content-Security-Policy', cspHeader);
          next();
        });
      },
    },
  ],
});
```

### 4.2 Performance Monitoring Implementation
```typescript
// Web Vitals Monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

class PerformanceMonitor {
  private metrics: Map<string, Metric> = new Map();
  
  initialize() {
    // Core Web Vitals
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
    
    // Custom performance observers
    this.observeNavigationTiming();
    this.observeResourceTiming();
    this.observeLongTasks();
  }
  
  private handleMetric(metric: Metric) {
    this.metrics.set(metric.name, metric);
    
    // Send to analytics
    this.sendToAnalytics(metric);
    
    // Alert if performance thresholds are exceeded
    this.checkPerformanceThresholds(metric);
  }
  
  private observeNavigationTiming() {
    if ('navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        tls: navigation.connectEnd - navigation.secureConnectionStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
        onLoad: navigation.loadEventEnd - navigation.loadEventStart,
      };
      
      Object.entries(metrics).forEach(([name, value]) => {
        this.sendCustomMetric(`navigation.${name}`, value);
      });
    }
  }
  
  private observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.sendCustomMetric('longTask', entry.duration, {
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }
  
  private sendToAnalytics(metric: Metric) {
    // Integration with analytics service
    analytics.track('web_vital', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: this.getRating(metric),
      id: metric.id,
      navigationType: metric.navigationType,
    });
  }
  
  private getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };
    
    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (!threshold) return 'good';
    
    if (metric.value <= threshold.good) return 'good';
    if (metric.value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }
}
```

## 5. Testing Strategy Implementation

### 5.1 Unit and Integration Testing Setup
```typescript
// Vitest Configuration
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});

// Test Setup File
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web APIs
beforeAll(() => {
  // Mock Web Audio API
  global.AudioContext = vi.fn(() => ({
    createAnalyser: vi.fn(),
    createMediaStreamSource: vi.fn(),
    destination: {},
  }));
  
  // Mock MediaRecorder
  global.MediaRecorder = vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    addEventListener: vi.fn(),
  }));
  
  // Mock getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn(() => Promise.resolve(new MediaStream())),
    },
  });
});

// Component Testing Example
describe('VideoPlayer Component', () => {
  const mockVideo: Video = {
    id: '1',
    title: 'Test Video',
    videoUrl: 'https://example.com/video.mp4',
    duration: 120,
    ratingAvg: 4.5,
  };

  it('renders video player with controls', () => {
    render(<VideoPlayer video={mockVideo} />);
    
    expect(screen.getByRole('video')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /timeline/i })).toBeInTheDocument();
  });

  it('handles play/pause interactions', async () => {
    const user = userEvent.setup();
    render(<VideoPlayer video={mockVideo} />);
    
    const playButton = screen.getByRole('button', { name: /play/i });
    
    await user.click(playButton);
    
    expect(playButton).toHaveAttribute('aria-label', 'Pause');
  });
});
```

### 5.2 End-to-End Testing with Playwright
```typescript
// Playwright Configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});

// E2E Test Example
import { test, expect } from '@playwright/test';

test.describe('Video Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-token');
    });
  });

  test('should generate video successfully', async ({ page }) => {
    // Navigate to video generation
    await page.getByRole('button', { name: /generate video/i }).click();
    
    // Fill generation form
    await page.getByLabel('Topic').fill('Quadratic Equations');
    await page.getByLabel('Subject').selectOption('Math');
    await page.getByLabel('Difficulty').selectOption('Standard');
    
    // Submit generation request
    await page.getByRole('button', { name: /generate/i }).click();
    
    // Verify success state
    await expect(page.getByText('Video generation started')).toBeVisible();
    
    // Verify navigation to video feed
    await expect(page).toHaveURL(/\/videos/);
  });
  
  test('should handle voice input', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Voice input only works in Chromium');
    
    await page.goto('/videos/generate');
    
    // Grant microphone permission
    await page.context().grantPermissions(['microphone']);
    
    // Start voice input
    await page.getByRole('button', { name: /voice input/i }).click();
    
    // Verify microphone access
    await expect(page.getByText('Listening...')).toBeVisible();
    
    // Stop recording
    await page.getByRole('button', { name: /stop/i }).click();
    
    // Verify transcription appears
    await expect(page.getByLabel('Topic')).not.toHaveValue('');
  });
});
```

---

This web technical specification provides comprehensive implementation guidance for building a high-performance, secure, and accessible web application that serves as the foundation for the Little Monster GPA study platform's multi-platform ecosystem.
