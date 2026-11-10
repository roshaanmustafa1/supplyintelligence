'use client'

import { useSyncExternalStore } from 'react'
import { Agentation } from 'agentation'

const emptySubscribe = () => () => {}

/**
 * Agentation visual feedback toolbar.
 * Strictly mounted only in local development environment.
 * Communicates with the local Agentation MCP server on port 4747.
 */
export function AgentationDev() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Explicit safety check: never render in non-development environments
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Prevent SSR hydration mismatch before browser mount
  if (!isMounted) {
    return null
  }

  return <Agentation endpoint="http://localhost:4747" />
}
