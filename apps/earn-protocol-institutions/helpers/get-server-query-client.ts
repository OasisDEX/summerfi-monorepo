import { cache } from 'react'
import { QueryClient } from '@tanstack/react-query'

// Request-scoped QueryClient for server-side prefetching. `cache` guarantees a single instance
// per request so multiple prefetches share one client that can be dehydrated together. Never
// reuse the client singleton from app-earn-ui here — that one is shared across all requests.
export const getServerQueryClient = cache(() => new QueryClient())
