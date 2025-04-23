# KaTuripu

## Code Review Findings

### Architectural Issues

1. **Inconsistent Error Handling**
   - Different parts of the codebase handle errors differently
   - Some functions throw errors while others return null/false
   - Recommendation: Adopt a consistent error handling strategy across all services

3. **Direct Database Access in Components**
   - Components directly call database services instead of using a data access layer
   - Recommendation: Implement a proper data access layer between UI components and data services

5. **Inconsistent State Management**
   - Mix of component state and prop drilling for state management
   - Recommendation: Use a more robust state management solution (Redux, Zustand, Context API)

6. **Database Schema in Frontend Code**
   - SQL schema definitions included in katuripu codebase
   - Recommendation: Move database schema to a backend repository

7. **Client-Side Data Fetching Security Concerns**
   - Sensitive operations handled directly from the client
   - Recommendation: Move sensitive operations to a backend API with proper authorization checks

### Code Quality Issues

1. **TypeScript Type Issues**
   - Unsafe typecasting with `as any`
   - Overuse of `any` type
   - Recommendation: Define proper interfaces and avoid type assertions

2. **Large Component Files**
   - Some components contain hundreds of lines of code with multiple responsibilities
   - Recommendation: Break down large components into smaller, single-responsibility components

3. **Direct DOM Manipulation**
   - Instances of direct DOM access instead of React's declarative approach
   - Recommendation: Prefer declarative React patterns

4. **Inconsistent Async/Await Usage**
   - Mixing Promises and async/await patterns
   - Recommendation: Standardize on async/await for more readable asynchronous code

5. **Environment Variables in Client-Side Code**
   - Including potentially sensitive configuration in client-side code
   - Recommendation: Ensure sensitive values are only used in server-side code

## Action Items

1. Create consistent error handling strategy
3. Add proper data access layer
5. Adopt consistent state management solution
6. Refactor large components
7. Move sensitive operations to backend API
8. Fix TypeScript type issues
9. Convert imperative DOM operations to declarative patterns
10. Standardize on async/await for async code
11. Review environment variable usage


# Adopt the following structure:
src/
├── app/                        # App router (server-centric by default)
│   ├── (marketing)/            # Public pages (e.g., landing, about)
│   ├── (dashboard)/            # Auth-protected app (layout grouping)
│   ├── api/                    # Route handlers (server-only)
│   ├── layout.tsx             # Root layout
│   ├── globals.css
│   └── page.tsx
│
├── components/                # Reusable UI components (client/server mixed)
│   ├── ui/                    # Primitive design system (Button, Modal, etc.)
│   └── shared/                # Shared layout components (Navbar, Footer, etc.)
│
├── features/                  # App features (domain logic + components)
│   ├── roadmap/
│   │   ├── components/        # Client components only used in roadmap
│   │   ├── server/            # Server-only helpers (getRoadmap, etc.)
│   │   └── hooks/             # Client-side hooks (e.g., useRoadmapStore)
│   ├── auth/
│   │   ├── components/
│   │   ├── server/
│   │   └── hooks/
│   └── ...
│
├── lib/                       # Utils and libraries (shared code)
│   ├── supabase/              # Singleton Supabase client
│   ├── auth/                  # Centralized auth logic (e.g., getSession)
│   ├── api-client/            # Client-side fetchers (fetchWithAuth, etc.)
│   └── helpers.ts
│
├── services/                  # Business logic (used only by server-side code)
│   ├── roadmapService.ts
│   └── userService.ts
│
├── stores/                    # Zustand or Context state stores (client only)
│   └── roadmapStore.ts
│
├── types/                     # Global TypeScript types
│   └── index.ts
│
├── middleware.ts              # Edge middleware
└── env.d.ts
