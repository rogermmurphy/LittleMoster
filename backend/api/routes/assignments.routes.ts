/**
 * Assignments Routes
 * Handles assignment CRUD operations
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:38 AM CST
 * Last Updated: October 31, 2025 10:38 AM CST
 */

import { Router, Request, Response } from 'express';
import { AssignmentsService } from '../services/assignments.service';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const router = Router();
const assignmentsService = new AssignmentsService();
const authService = new AuthService();

// Validation schemas
const createAssignmentSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  title: z.string().min(1, 'Title is required').max(200),
  type: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string(), // ISO date string
  status: z.enum(['pending', 'in-progress', 'completed', 'overdue']).optional()
});

const updateAssignmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'overdue']).optional()
});

// Authentication middleware
const authenticate = (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyAccessToken(token);
    
    (req as any).user = payload;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * POST /api/assignments
 * Create a new assignment
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedData = createAssignmentSchema.parse(req.body);

    const result = await assignmentsService.createAssignment({
      userId: user.userId,
      ...validatedData
    });

    res.status(201).json({
      success: true,
      data: { assignment: result }
    });
  } catch (error: any) {
    console.error('Create assignment error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create assignment'
    });
  }
});

/**
 * GET /api/assignments?classId=xxx
 * Get all assignments for a class
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const classId = req.query['classId'] as string;

    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'classId query parameter is required'
      });
    }

    const assignments = await assignmentsService.getClassAssignments(classId, user.userId);

    res.status(200).json({
      success: true,
      data: { assignments }
    });
  } catch (error: any) {
    console.error('Get assignments error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to retrieve assignments'
    });
  }
});

/**
 * GET /api/assignments/:id
 * Get specific assignment
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const assignmentId = req.params['id'];

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const assignment = await assignmentsService.getAssignmentById(assignmentId, user.userId);

    res.status(200).json({
      success: true,
      data: { assignment }
    });
  } catch (error: any) {
    console.error('Get assignment error:', error);
    res.status(404).json({
      success: false,
      error: error.message || 'Assignment not found'
    });
  }
});

/**
 * PATCH /api/assignments/:id
 * Update assignment
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const assignmentId = req.params['id'];

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const validatedData = updateAssignmentSchema.parse(req.body);
    const updated = await assignmentsService.updateAssignment(assignmentId, user.userId, validatedData);

    res.status(200).json({
      success: true,
      data: { assignment: updated }
    });
  } catch (error: any) {
    console.error('Update assignment error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update assignment'
    });
  }
});

/**
 * DELETE /api/assignments/:id
 * Delete assignment
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const assignmentId = req.params['id'];

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    const result = await assignmentsService.deleteAssignment(assignmentId, user.userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Delete assignment error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete assignment'
    });
  }
});

export default router;

</final_file_content>

IMPORTANT: For any future changes to this file, use the final_file_content shown above as your reference. This content reflects the current state of the file, including any auto-formatting (e.g., if you used single quotes but the formatter converted them to double quotes). Always base your SEARCH/REPLACE operations on this final version to ensure accuracy.




				# TODO LIST UPDATE REQUIRED - You MUST include the task_progress parameter in your NEXT tool call.

				**Current Progress: 4/12 items completed (33%)**

				

				- [x] Notes API complete
- [x] Mounted (33 endpoints)
- [x] Assignments service (220 lines)
- [x] Assignments routes (230 lines)
- [ ] Mount assignments
- [ ] 38 endpoints total!
- [ ] TypeScript check
- [ ] Lint check
- [ ] Test endpoints
- [ ] Fix issues
- [ ] Re-test
- [ ] Commit complete

				**CRITICAL INFORMATION:** The user has modified this todo list - review ALL changes carefully

				
1. To create or update a todo list, include the task_progress parameter in the next tool call
2. Review each item and update its status:
   - Mark completed items with: - [x]
   - Keep incomplete items as: - [ ]
   - Add new items if you discover additional steps
3. Modify the list as needed:
		- Add any new steps you've discovered
		- Reorder if the sequence has changed
4. Ensure the list accurately reflects the current state

**Remember:** Keeping the todo list updated helps track progress and ensures nothing is missed.

			<environment_details>
# Visual Studio Code Visible Files
backend/api/routes/assignments.routes.ts

# Visual Studio Code Open Tabs
lm_v_1.md
../../Downloads/lm_v_1.md
.clinerules/lm-gpa-project-standards.md
docs/business-processes.md
.clinerules/living-documents-management.md
.gitignore
README.md
.env.example
docs/specifications/functional-architecture.md
backend/api/services/classes.service.ts
backend/api/routes/classes.routes.ts
docs/phase-1/phase-1-implementation-plan.md
web-app/src/pages/OnboardingPage.tsx
web-app/src/components/GlobalAIChatbot.tsx
web-app/src/pages/ClassDashboardPage.tsx
web-app/src/pages/ClassDetailPage.tsx
web-app/src/pages/ClassmatesPage.tsx
.phase1-ui-complete
web-app/src/pages/HomePage.tsx
web-app/src/pages/MonsterPlayPage.tsx
web-app/src/pages/LibraryPage.tsx
web-app/src/pages/CustomizeLMPage.tsx
web-app/src/App.tsx
docs/project-plan-wbs.md
.phase0-complete
backend/package.json
shared/package.json
shared/tsconfig.json
shared/src/types/index.ts
shared/src/types/database.ts
shared/src/utils/constants.ts
shared/src/index.ts
shared/src/types/api.ts
prod-ca-2021.crt
.env
backend/src/test-connection.ts
web-app/package.json
web-app/vite.config.ts
web-app/tsconfig.json
web-app/tsconfig.node.json
web-app/tailwind.config.js
web-app/postcss.config.js
web-app/index.html
web-app/src/main.tsx
web-app/src/index.css
web-app/src/pages/VideoFeedPage.tsx
web-app/src/pages/ChatPage.tsx
web-app/src/pages/PlannerPage.tsx
docs/specifications/technical-architecture.md
backend/database/migrations/001_initial_schema.sql
docs/phase-1/phase-1.2-implementation-plan.md
backend/api/services/notes.service.ts
backend/api/routes/notes.routes.ts
backend/src/index.ts
backend/api/services/assignments.service.ts
backend/api/routes/assignments.routes.ts
backend/api/routes/audio.routes.ts
implementation_plan.md
backend/api/services/photo.service.ts
backend/api/routes/photo.routes.ts
.clinerules/testing-standards.md
backend/services/job-processor.ts
backend/api/services/audio.service.ts
backend/api/services/textbook.service.ts
backend/api/routes/textbook.routes.ts
backend/ai-services/vector-db.service.ts
backend/api/routes/chat.routes.ts
backend/ai-services/chat.service.ts
backend/ai-services/transcription.service.ts
backend/ai-services/embedding.service.ts
backend/.env.example
docker-compose.yml
.clinerules/zero-tolerance-testing.md
backend/src/run-migration.ts
backend/.env
backend/src/run-migration-supabase.ts
backend/api/services/auth.service.ts
backend/api/routes/auth.routes.ts
backend/tsconfig.json
.week1-complete

# Current Time
10/31/2025, 10:39:06 AM (America/Chicago, UTC-5:00)

# Context Window Usage
623,539 / 1,000K tokens used (62%)

# Current Mode
ACT MODE
</environment_details>
