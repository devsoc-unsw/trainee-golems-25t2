import { v4 as uuidv4 } from "uuid";

// Utility function for generating session IDs
export function generateSessionId() {
  return uuidv4();
}

// Legacy functions kept for compatibility during migration
export function loadData() {
  // No-op: Data now managed by Prisma
}

export function getData() {
  // Legacy function - use Prisma user service instead
  return { users: [] };
}