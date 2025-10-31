# Little Monster (LM) - Functional Architecture Document
## Multi-Platform GPA Study Platform

**Version**: 1.0  
**Last Updated**: October 30, 2025  
**Document Type**: Functional Architecture & User Experience Design  
**Status**: Living Document

---

## 1. Functional Architecture Overview

The Little Monster platform's functional architecture defines how users interact with the system, the workflows they follow, and the business logic that powers the educational experience. This document bridges business requirements with technical implementation, ensuring all stakeholders understand system capabilities and user journeys.

### 1.1 System Capabilities Map

```
Little Monster Platform Capabilities
├── User Management
│   ├── Account Creation & Authentication
│   ├── Profile Customization
│   ├── Preference Management
│   └── Activity Tracking
├── Content Generation
│   ├── AI-Powered Video Creation
│   ├── Subject-Specific Content
│   ├── Difficulty Adaptation
│   └── Batch Generation
├── Content Discovery
│   ├── Video Feed Browsing
│   ├── Search & Filtering
│   ├── Recommendations
│   └── Subject Workspaces
├── Social Learning
│   ├── Video Rating System
│   ├── Comment & Discussion
│   ├── Creator Profiles
│   └── Content Sharing
├── Study Planning
│   ├── Calendar Management
│   ├── Event Scheduling
│   ├── Reminder System
│   └── Progress Tracking
├── Personalization
│   ├── Learning Path Adaptation
│   ├── Content Recommendations
│   ├── UI Customization
│   └── Study Analytics
└── Gamification
    ├── Achievement System
    ├── Study Streaks
    ├── Mini-Games
    └── Social Challenges
```

## 2. User Journey Architecture

### 2.1 New User Onboarding Flow

```
Journey: First-Time User Experience
═══════════════════════════════════════════════════════════════

Step 1: Discovery & Landing
├── User discovers platform (web search, referral, ad)
├── Lands on homepage with value proposition
├── Views feature highlights and benefits
└── Clicks "Get Started" CTA

Step 2: Account Creation
├── Enters email address
├── Creates strong password (validated)
├── Chooses display name
├── Receives verification email
└── Clicks verification link

Step 3: Profile Setup
├── Selects academic subjects (1-6)
├── Chooses difficulty levels per subject
├── Sets study preferences
│   ├── Notification settings
│   ├── Theme preferences
│   └── Privacy settings
└── Uploads avatar or chooses color

Step 4: Interactive Tutorial
├── Welcome tour of key features
├── Demonstrates video generation
├── Shows planner functionality
├── Explains community features
└── Provides quick tips

Step 5: First Content Interaction
├── Suggests first video topic
├── Generates welcome video
├── Prompts to explore video feed
├── Encourages first planner event
└── Completes onboarding

Success Metrics:
- Time to first video generation < 5 minutes
- Tutorial completion rate > 80%
- First week retention > 60%
```

### 2.2 Core Study Session Flow

```
Journey: Daily Study Session
═══════════════════════════════════════════════════════════════

Step 1: Session Start
├── User opens app/website
├── Dashboard shows today's schedule
├── Displays study streak and goals
└── Suggests priority topics

Step 2: Content Discovery
├── Browse video feed by subject
├── Apply filters (difficulty, topic, rating)
├── Search for specific content
└── Select video to watch

Step 3: Active Learning
├── Watch AI-generated video
├── Take notes using audio transcription
├── Bookmark key timestamps
├── Adjust playback speed
└── Review key points summary

Step 4: Knowledge Validation
├── Rate video quality
├── Add comments/questions
├── Share with study group
└── Save to personal library

Step 5: Progress Tracking
├── Mark planner event complete
├── View progress dashboard
├── Receive achievement notification
└── Get next study recommendation

Success Metrics:
- Average session duration: 30-45 minutes
- Video completion rate > 70%
- Return within 24 hours > 50%
```

### 2.3 Content Creation Flow

```
Journey: Creating Educational Content
═══════════════════════════════════════════════════════════════

Step 1: Initiation
├── User identifies study need
├── Clicks "Generate Video" button
├── Selects subject category
└── Chooses difficulty level

Step 2: Topic Definition
├── Inputs topic/question
│   ├── Text input
│   └── Voice input (optional)
├── System suggests improvements
├── AI validates topic relevance
└── User confirms or refines

Step 3: Content Moderation
├── Automated safety check
├── Subject relevance validation
├── Academic appropriateness review
└── {Approved} → Continue
    {Rejected} → Show feedback & retry

Step 4: AI Generation
├── Display generation progress
├── Show estimated completion time
├── Allow cancellation if needed
└── Provide generation queue status

Step 5: Review & Publish
├── Preview generated content
├── Review script summary
├── Check key points
├── Confirm quality
└── Publish to community feed

Step 6: Engagement Monitoring
├── Track views and engagement
├── See ratings and comments
├── Monitor creator statistics
└── Earn creator badges

Success Metrics:
- Generation completion rate > 90%
- User satisfaction with content > 4.0/5.0
- Re-generation rate < 10%
```

## 3. Feature Architecture by Platform

### 3.1 Web Application Features

**Desktop-Optimized Experience:**
```
Web Platform Features
├── No-Scroll Core Surfaces
│   ├── Fixed viewport homepage
│   ├── Sidebar navigation
│   └── Multi-panel layouts
├── Advanced Keyboard Navigation
│   ├── Global shortcuts (Ctrl+K command palette)
│   ├── Focus management
│   └── Tab navigation
├── Multi-Window Support
│   ├── Open videos in new tabs
│   ├── Pop-out planner
│   └── Picture-in-picture video
├── Progressive Web App
│   ├── Offline functionality
│   ├── Install to desktop
│   └── Push notifications
└── Collaboration Tools
    ├── Screen sharing
    ├── Real-time co-viewing
    └── Shared planner
```

### 3.2 Mobile Application Features

**Touch-First Experience:**
```
Mobile Platform Features
├── Bottom Tab Navigation
│   ├── Home, Videos, Planner, Profile
│   └── Haptic feedback
├── Gesture Controls
│   ├── Swipe video navigation
│   ├── Pull-to-refresh
│   └── Long-press actions
├── Voice-First Interaction
│   ├── Voice commands
│   ├── Audio transcription
│   └── Hands-free generation
├── Location-Aware Features
│   ├── Study mode (library/campus)
│   ├── Location-based reminders
│   └── Nearby peer discovery
└── Offline-First Design
    ├── Downloaded content
    ├── Offline planner
    └── Queue sync when online
```

### 3.3 Desktop Application Features

**Power User Experience:**
```
Desktop Platform Features
├── Multi-Window Management
│   ├── Separate video player window
│   ├── Always-on-top planner
│   └── Content creation suite
├── Advanced Content Tools
│   ├── Rich text editor (LaTeX support)
│   ├── Diagram creation
│   ├── Mind mapping
│   └── Export capabilities
├── Local AI Processing
│   ├── On-device content generation
│   ├── Privacy-preserving AI
│   └── Offline AI capabilities
├── System Integration
│   ├── Native notifications
│   ├── System calendar sync
│   ├── File associations
│   └── Global hotkeys
└── Collaboration Platform
    ├── P2P file sharing
    ├── Local network discovery
    ├── Shared whiteboards
    └── Voice chat
```

## 4. Content Flow Architecture

### 4.1 Video Content Lifecycle

```
Content Lifecycle Stages
═══════════════════════════════════════════════════════════════

1. Request
   ├── User submits topic
   ├── System validates request
   └── Queue position assigned

2. Generation
   ├── AI processes topic
   ├── Script created
   ├── Key points extracted
   └── Summary generated

3. Processing
   ├── Thumbnail generation
   ├── Media compilation
   ├── Quality validation
   └── Metadata extraction

4. Publication
   ├── Published to feed
   ├── Indexed for search
   ├── Notifies user
   └── Available for engagement

5. Engagement
   ├── Views tracked
   ├── Ratings collected
   ├── Comments added
   └── Shares counted

6. Analytics
   ├── Performance metrics
   ├── Quality assessment
   ├── User feedback analysis
   └── Recommendation updates

7. Archival (Optional)
   ├── Low-engagement content
   ├── Outdated information
   ├── User deletion request
   └── Compliance requirements
```

### 4.2 Comment Moderation Flow

```
Comment Lifecycle
═══════════════════════════════════════════════════════════════

Submit Comment
    ↓
┌─────────────────────────────┐
│  Automated Moderation       │
│  ├─ Profanity detection     │
│  ├─ Spam classification     │
│  ├─ Subject relevance       │
│  └─ Safety assessment       │
└─────────────────────────────┘
    ↓
{PASS} ────────────┐
    ↓              │
Publish Immediately│
    ↓              │
Visible in Thread  │
                   │
{FLAG} ────────────┘
    ↓
Queue for Human Review
    ↓
┌─────────────────────────────┐
│  Moderator Review           │
│  ├─ Context analysis        │
│  ├─ Policy verification     │
│  └─ Decision recording      │
└─────────────────────────────┘
    ↓
{APPROVE} → Publish Comment
{REJECT}  → Hide + Notify User
{EDIT}    → Suggest Changes
```

## 5. User Experience Architecture

### 5.1 Information Architecture

```
Navigation Hierarchy
═══════════════════════════════════════════════════════════════

Level 1: Primary Navigation
├── Home (Dashboard)
├── Subjects (4 core subjects)
├── Videos (Community Feed)
├── Planner (Calendar)
├── Play (Games)
└── Profile (Settings)

Level 2: Subject Workspaces
├── Math
│   ├── Topics (Algebra, Calculus, etc.)
│   ├── My Videos
│   ├── Recommended Content
│   └── Study Resources
├── Chemistry
│   └── [Similar structure]
├── History
│   └── [Similar structure]
└── English
    └── [Similar structure]

Level 3: Content Details
├── Video Detail Page
│   ├── Video Player
│   ├── Script & Summaries
│   ├── Comments Section
│   ├── Rating Interface
│   └── Related Content
└── Planner Event Detail
    ├── Event Information
    ├── Linked Resources
    ├── Completion Status
    └── Reminder Settings
```

### 5.2 Interaction Patterns

**Primary User Actions:**
```
Core Interactions
├── Generate Content
│   ├── Trigger: "Generate Video" button
│   ├── Input: Text or voice
│   ├── Feedback: Progress indicator
│   └── Result: New video in feed
├── Consume Content
│   ├── Trigger: Video card click
│   ├── Input: Playback controls
│   ├── Feedback: Progress bar, notes
│   └── Result: Knowledge gained, video marked viewed
├── Engage Socially
│   ├── Trigger: Rate/comment buttons
│   ├── Input: Stars or text
│   ├── Feedback: Immediate UI update
│   └── Result: Community contribution
├── Plan Study
│   ├── Trigger: Calendar date click
│   ├── Input: Event details
│   ├── Feedback: Calendar update
│   └── Result: Organized schedule
└── Track Progress
    ├── Trigger: Automatic/manual check
    ├── Input: Completion marks
    ├── Feedback: Analytics dashboard
    └── Result: Insights and recommendations
```

### 5.3 Feedback Mechanisms

```
User Feedback Systems
├── Immediate Feedback
│   ├── Button states (loading, success, error)
│   ├── Toast notifications
│   ├── Progress indicators
│   └── Optimistic UI updates
├── Contextual Feedback
│   ├── Inline validation errors
│   ├── Helper text and tooltips
│   ├── Empty states with actions
│   └── Success confirmations
├── System Feedback
│   ├── Push notifications
│   ├── Email alerts
│   ├── In-app messages
│   └── Achievement celebrations
└── Analytics Feedback
    ├── Progress reports
    ├── Study insights
    ├── Performance trends
    └── Personalized recommendations
```

## 6. Business Logic Architecture

### 6.1 Content Generation Rules

**Topic Validation Logic:**
```
Topic Validation Rules
├── Must relate to one of 4 core subjects
├── Must be educational in nature
├── Minimum 3 words, maximum 200 characters
├── No profanity or inappropriate content
├── No personal information
└── Matches subject-specific patterns

Subject-Specific Rules:
├── Math: Contains mathematical concepts, formulas, or problems
├── Chemistry: References chemical elements, reactions, or principles
├── History: Discusses historical events, figures, or periods
├── English: Covers literature, writing, grammar, or analysis
```

**Content Generation Logic:**
```
Generation Business Rules
├── Rate Limiting
│   ├── Free tier: 5 videos per day
│   ├── Premium tier: 20 videos per day
│   └── Resets at midnight UTC
├── Priority Queue
│   ├── Premium users: High priority
│   ├── First-time users: Medium priority
│   └── Standard users: Normal priority
├── Quality Thresholds
│   ├── Minimum script length: 500 words
│   ├── Maximum generation time: 5 minutes
│   ├── Require 3+ key points
│   └── Target duration: 90-150 seconds
└── Retry Logic
    ├── Auto-retry on failure (max 3 attempts)
    ├── Different model on retry
    └── Human review if all fail
```

### 6.2 Rating Aggregation Logic

**Rating Calculation Rules:**
```typescript
// Rating business logic
function calculateVideoRating(ratings: Rating[]): number {
  // Weighted average with recency bias
  const now = Date.now();
  const weights = ratings.map(r => {
    const age = now - new Date(r.createdAt).getTime();
    const daysOld = age / (1000 * 60 * 60 * 24);
    // Recent ratings weighted higher
    return Math.max(0.5, 1 - (daysOld / 90)); // 90-day decay
  });
  
  const weightedSum = ratings.reduce((sum, rating, i) => 
    sum + (rating.stars * weights[i]), 0
  );
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  return weightedSum / totalWeight;
}

// Minimum ratings threshold
const MIN_RATINGS_FOR_DISPLAY = 3;

// Rating display logic
if (ratingCount < MIN_RATINGS_FOR_DISPLAY) {
  display "New" badge instead of rating
} else {
  display calculated average (1 decimal place)
}
```

### 6.3 Recommendation Engine Logic

**Content Recommendation Algorithm:**
```
Recommendation Factors
├── User Profile Match (30%)
│   ├── Selected subjects
│   ├── Difficulty preferences
│   └── Historical interactions
├── Content Performance (25%)
│   ├── Average rating
│   ├── View completion rate
│   ├── Engagement metrics
│   └── Recency
├── Learning Gap Analysis (20%)
│   ├── Weak subject areas
│   ├── Incomplete topic coverage
│   └── Study pattern analysis
├── Social Signals (15%)
│   ├── Peer recommendations
│   ├── Trending content
│   └── Creator reputation
└── Contextual Factors (10%)
    ├── Time of day
    ├── Upcoming exams
    ├── Study session history
    └── Device being used

Recommendation Types:
├── "Continue Learning" (based on recent activity)
├── "Trending in [Subject]" (popular content)
├── "Recommended for You" (personalized)
├── "Fill Knowledge Gaps" (adaptive learning)
└── "From Top Creators" (quality content)
```

## 7. Study Analytics Architecture

### 7.1 Progress Tracking Logic

**Learning Metrics Calculation:**
```
User Progress Metrics
├── Subject Mastery
│   ├── Topics covered per subject
│   ├── Average rating of viewed content
│   ├── Completion rate of videos
│   └── Time spent per subject
├── Study Habits
│   ├── Study session frequency
│   ├── Optimal study times
│   ├── Session duration patterns
│   └── Break frequency
├── Engagement Quality
│   ├── Note-taking frequency
│   ├── Question asking rate
│   ├── Content creation activity
│   └── Community participation
└── Academic Performance Indicators
    ├── Content difficulty progression
    ├── Concept mastery speed
    ├── Retention metrics
    └── Study goal achievement
```

### 7.2 Insight Generation Logic

**Personalized Insights:**
```
Insight Generation Rules
├── Study Pattern Insights
│   ├── "You study best in the morning"
│   ├── "Your Chemistry sessions are 40% longer"
│   └── "You learn faster with visual content"
├── Progress Insights
│   ├── "You've mastered 12 Math topics this month"
│   ├── "Your study streak is 15 days"
│   └── "You're in the top 20% of learners"
├── Recommendation Insights
│   ├── "Based on your history, try [topic]"
│   ├── "You might struggle with [concept], watch these first"
│   └── "Similar students found [content] helpful"
└── Goal-Oriented Insights
    ├── "Complete 3 more videos to reach your weekly goal"
    ├── "Your exam is in 2 days, review these topics"
    └── "You're ahead of schedule on [subject]"
```

## 8. Content Moderation Architecture

### 8.1 Multi-Layer Moderation System

```
Moderation Pipeline
═══════════════════════════════════════════════════════════════

Layer 1: Automated Pre-Screening
├── Profanity detection
├── Spam pattern recognition
├── Subject classification
└── Safety scoring
    ↓
{SAFE} ────────────────┐
    ↓                  │
Layer 2: AI Review     │
├── Context analysis   │
├── Intent detection   │
├── Policy matching    │
└── Confidence scoring │
    ↓                  │
{HIGH CONFIDENCE} ─────┤
    ↓                  │
Auto-Approve ──────────┘
    ↓
Publish Content

{LOW CONFIDENCE}
    ↓
Layer 3: Human Review
├── Queue assignment
├── Moderator review
├── Decision + feedback
└── Policy update (if needed)
    ↓
{APPROVED} → Publish
{REJECTED} → Notify + educate user
{MODIFIED} → Auto-correct + publish
```

### 8.2 Community Safety Rules

**Content Policy Framework:**
```
Acceptable Content
├── Educational topics in core subjects
├── Study tips and strategies
├── Academic discussion and questions
├── Constructive feedback on content
└── Helpful resources and references

Prohibited Content
├── Personal information (addresses, phone numbers)
├── Inappropriate language or imagery
├── Off-topic discussions
├── Spam or promotional content
├── Harassment or bullying
├── Cheating or academic dishonesty
└── Copyright infringement

Enforcement Actions
├── First Violation: Warning + education
├── Second Violation: Content removal
├── Third Violation: Temporary suspension
├── Severe Violation: Immediate account suspension
└── Appeal Process: Human review within 48 hours
```

## 9. Gamification Architecture

### 9.1 Achievement System

**Achievement Categories:**
```
Achievement Framework
├── Learning Achievements
│   ├── "First Video Generated"
│   ├── "Subject Master" (100 videos in subject)
│   ├── "Fast Learner" (10 videos in 1 day)
│   └── "All Subjects" (content in all 4 subjects)
├── Social Achievements
│   ├── "Community Helper" (50 helpful comments)
│   ├── "Top Rated" (average rating > 4.5)
│   ├── "Conversation Starter" (100+ comments)
│   └── "Super Sharer" (content shared 50 times)
├── Consistency Achievements
│   ├── "Week Warrior" (7-day streak)
│   ├── "Month Master" (30-day streak)
│   ├── "Daily Grind" (100-day streak)
│   └── "Early Bird" (study before 8am for 7 days)
└── Quality Achievements
    ├── "Perfectionist" (all 5-star ratings given)
    ├── "Quality Contributor" (all content rated > 4.0)
    ├── "Helpful Peer" (comments upvoted 100+ times)
    └── "Academic Excellence" (high progress scores)
```

### 9.2 Study Streak Logic

**Streak Calculation Rules:**
```typescript
// Streak business logic
interface StreakRules {
  // Minimum activity to maintain streak
  minVideosPerDay: 1;
  minStudyMinutesPerDay: 15;
  
  // Grace period
  gracePeriodHours: 24;
  streakFreezeAllowed: 2; // per month
  
  // Streak tiers
  tiers: [
    { days: 7, reward: "Bronze Badge" },
    { days: 30, reward: "Silver Badge" },
    { days: 100, reward: "Gold Badge" },
    { days: 365, reward: "Diamond Badge" }
  ]
}

// Streak break protection
- Allow one "freeze" per week (premium feature)
- Grace period: 24 hours from last activity
- Weekends count at 50% requirement
- Holidays: auto-freeze (configurable)
```

## 10. Accessibility Architecture

### 10.1 Accessibility Features

**WCAG 2.1 AA Compliance:**
```
Accessibility Implementation
├── Perceivable
│   ├── Alt text for all images
│   ├── Captions for all videos
│   ├── High contrast mode
│   └── Scalable fonts (50%-300%)
├── Operable
│   ├── Full keyboard navigation
│   ├── No time-based limitations
│   ├── Clear focus indicators
│   └── Skip navigation links
├── Understandable
│   ├── Consistent navigation
│   ├── Clear error messages
│   ├── Predictable behavior
│   └── Input assistance
└── Robust
    ├── Valid HTML/ARIA
    ├── Screen reader compatible
    ├── Browser compatibility
    └── Assistive tech support
```

### 10.2 Voice Control Architecture

**Voice Command System:**
```
Voice Commands
├── Navigation Commands
│   ├── "Go to [page name]"
│   ├── "Open [subject]"
│   └── "Show my planner"
├── Content Commands
│   ├── "Generate video about [topic]"
│   ├── "Search for [query]"
│   └── "Play next video"
├── Playback Commands
│   ├── "Play / Pause"
│   ├── "Skip forward / backward"
│   └── "Increase / decrease speed"
└── Interaction Commands
    ├── "Rate [1-5] stars"
    ├── "Add to favorites"
    └── "Share this video"
```

## 11. Multi-Platform Synchronization

### 11.1 Cross-Device Sync Logic

**Synchronization Strategy:**
```
Sync Architecture
├── Real-Time Sync (Priority 1)
│   ├── User authentication state
│   ├── Active study sessions
│   ├── Real-time comments
│   └── Planner updates
├── Near Real-Time (Priority 2)
│   ├── Video generation status
│   ├── New content available
│   ├── Achievement unlocks
│   └── Notifications
├── Periodic Sync (Priority 3)
│   ├── Analytics data
│   ├── Cached content refresh
│   ├── Settings synchronization
│   └── Offline queue processing
└── Manual Sync (Priority 4)
    ├── Large file downloads
    ├── Full library refresh
    ├── Archive operations
    └── Data export/import
```

### 11.2 Conflict Resolution

**Sync Conflict Handling:**
```
Conflict Resolution Strategy
├── Last Write Wins
│   └── User preferences, theme settings
├── Merge Strategy
│   └── Planner events (combine additions)
├── User Choice
│   └── Conflicting event times, descriptions
└── Server Authority
    └── Ratings, view counts, generated content
```

---

This functional architecture document defines the complete user experience, business logic, and interaction patterns that guide the Little Monster platform's development and ensure consistency across all platform implementations.

**Last Updated**: October 30, 2025  
**Next Review**: After each phase completion or as features evolve
