# KaTuripu

## Performance Issues in the Roadmap Flow

This document outlines performance and robustness issues in the current roadmap data fetching flow and provides recommendations for addressing them.

### Current Issues & Refactoring Recommendations

#### 1. Network Request Optimization

**Issues:**
- Multiple separate API calls (one for roadmap list + one per roadmap for progress data)
- Each request initializes a new Supabase client connection
- No request batching for related data

**Refactoring Approach:**
```typescript
// Consolidated API endpoint to fetch roadmaps with progress in a single call
// src/app/api/roadmaps-with-progress/route.ts
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get roadmaps
  const { data: roadmaps } = await supabase.from('roadmaps').select('*');
  
  // If authenticated, get all progress in a single query
  let progressData = {};
  if (user?.id) {
    const { data } = await supabase
      .from('user_roadmap_progress')
      .select('roadmap_id, progress_percent')
      .eq('user_id', user.id);
    
    progressData = Object.fromEntries(
      (data || []).map(item => [item.roadmap_id, item.progress_percent])
    );
  }
  
  return NextResponse.json({
    roadmaps,
    progress: progressData
  });
}
```

#### 2. Data Caching Implementation

**Issues:**
- Every page load refetches all data
- No caching strategy in place
- Inefficient data re-processing

**Refactoring Approach:**
```typescript
// Client-side fetching with SWR (in roadmap/page.tsx)
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

function RoadmapsPage() {
  const { data, error, isLoading } = useSWR('/api/roadmaps-with-progress', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    dedupingInterval: 60000 // 1 minute
  });
  
  // Use data.roadmaps and data.progress directly
}
```

#### 3. Query Optimization & Pagination

**Issues:**
- All roadmaps fetched at once, regardless of view needs
- Client-side filtering instead of database filtering
- No pagination implemented

**Refactoring Approach:**
```typescript
// Server-side implementation
export async function getAllRoadmaps(options = { page: 1, limit: 20, category: null, search: null }) {
  const { page, limit, category, search } = options;
  const offset = (page - 1) * limit;
  
  let query = supabase.from('roadmaps').select('*', { count: 'exact' });
  
  if (category && category !== 'all') {
    query = query.contains('category', [category]);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  return {
    roadmaps: data || [],
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
}

// API Route
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  
  const result = await getAllRoadmaps({ 
    page, 
    limit: 12,
    category,
    search
  });
  
  return NextResponse.json(result);
}
```

#### 4. Database Connection Management

**Issues:**
- Each service function creates a new Supabase client
- Excessive connection overhead
- Inconsistent client usage patterns

**Refactoring Approach:**
```typescript
// src/lib/db/singleton.ts
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
}

// Then in services:
import { getSupabaseClient } from '@/lib/db/singleton';

export async function getAllRoadmaps() {
  const supabase = getSupabaseClient();
  // use the shared client instance
}
```

#### 5. Error Handling & Recovery

**Issues:**
- Limited error recovery mechanisms
- No retry logic for transient failures
- Poor error reporting to the client

**Refactoring Approach:**
```typescript
// Utility function for retry logic
async function withRetry<T>(
  fn: () => Promise<T>,
  options = { retries: 3, delayMs: 300 }
): Promise<T> {
  let lastError;
  
  for (let attempt = 0; attempt < options.retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Only delay if we're going to retry again
      if (attempt < options.retries - 1) {
        await new Promise(r => setTimeout(r, options.delayMs));
      }
    }
  }
  
  throw lastError;
}

// Using it in a service
export async function getRoadmapById(id: string) {
  return withRetry(async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('roadmaps').select('*').eq('id', id).single();
    
    if (error) throw error;
    return data;
  });
}

// Client-side error boundaries
function RoadmapErrorBoundary({ children }) {
  return (
    <ErrorBoundary fallback={<RoadmapErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
}
```

#### 6. Data Model Optimization

**Issues:**
- Complex normalization on every request
- Inefficient data transformations
- Heavy client-side processing

**Refactoring Approach:**
```sql
-- Create a view to join roadmap data with progress (in schema.sql)
CREATE OR REPLACE VIEW roadmaps_with_meta AS
SELECT 
  r.*,
  COUNT(DISTINCT rn.id) AS node_count,
  COUNT(DISTINCT e.id) AS exercise_count
FROM roadmaps r
LEFT JOIN roadmap_nodes rn ON r.id = rn.roadmap_id
LEFT JOIN node_exercises ne ON rn.id = ne.node_id
LEFT JOIN exercises e ON ne.exercise_id = e.id
GROUP BY r.id;

-- Then query it directly
const { data } = await supabase.from('roadmaps_with_meta').select('*');
```

### Implementation Priority

1. **Consolidate API Calls (Highest Impact)**
   - Implement the combined roadmaps-with-progress endpoint
   - Update client code to use this endpoint

2. **Add Client-Side Caching**
   - Implement SWR or React Query
   - Configure appropriate caching policies

3. **Add Pagination & Server-Side Filtering**
   - Update API to support pagination parameters
   - Move filtering logic to the server side

4. **Optimize Database Queries**
   - Create DB views for frequently accessed data combinations
   - Add appropriate indexes for commonly filtered fields

5. **Improve Error Handling**
   - Implement retry logic
   - Add proper error boundaries
   - Create informative error states

By addressing these issues, we can significantly improve the performance and robustness of the roadmap flow in KaTuripu.