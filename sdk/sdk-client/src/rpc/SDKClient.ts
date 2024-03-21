import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { type SDKAppRouter } from '@summerfi/sdk-server'
import { SerializationService } from '@summerfi/sdk-common/services'

export type RPCClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createRPCClient(apiURL: string): RPCClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink(),
      httpBatchLink({
        url: apiURL,
        transformer: SerializationService.getTransformer(),
      }),
    ],
  })
}
