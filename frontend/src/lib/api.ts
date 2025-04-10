// src/lib/api.ts
/**
 * API wrapper that exports functionality from service modules.
 * This allows components to continue using the api.ts imports while we transition to a service-based architecture.
 */

// Re-export everything from service files
export * from './roadmapService';
export * from './exerciseService';
export * from './userService';
