import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { type SDKAppRouter } from '@summerfi/sdk-server'
import superjson from 'superjson'

export type RPCClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createRPCClient(apiURL: string): RPCClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      httpBatchLink({
        url: apiURL,
        transformer: superjson,
      }),
    ],
  })
}
