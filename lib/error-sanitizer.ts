/**
 * Sanitizes errors returned from Route Handlers.
 * Ensures internal database error messages, stack traces, Prisma signatures,
 * file paths, or sensitive credentials are never leaked to client callers.
 */
export function sanitizeApiError(
  error: unknown,
  fallbackMessage = 'Request failed'
): string {
  if (!(error instanceof Error)) {
    return fallbackMessage
  }

  const msg = error.message

  // Detect Prisma internals, paths, SQL, or environment leaks
  const containsPrismaInternals =
    msg.includes('PrismaClient') ||
    msg.includes('prisma.') ||
    msg.includes('invocation:') ||
    msg.includes('Unique constraint failed') ||
    msg.includes('Foreign key constraint') ||
    msg.includes('connector') ||
    msg.includes('database_url') ||
    msg.includes('raw_query') ||
    msg.includes('\\Users\\') ||
    msg.includes('/home/') ||
    msg.includes('.prisma') ||
    msg.includes('node_modules') ||
    /\n\s*at\s+/.test(msg) ||
    /^\s*at\s+/.test(msg)

  if (containsPrismaInternals) {
    if (msg.includes('Unique constraint') || msg.includes('Unique constraint failed')) {
      return 'A resource with this unique identifier already exists.'
    }
    if (msg.includes('Foreign key')) {
      return 'A referenced relation or category could not be found.'
    }
    return 'Database operation failed. Please verify submitted data.'
  }

  return msg || fallbackMessage
}
