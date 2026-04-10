import { QueryClient } from '@tanstack/react-query'

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Used by privy wallet to prefetch (something) and throws error on promised wallet, we need it here
      // eslint-disable-next-line camelcase
      experimental_prefetchInRender: true,
    },
  },
})
