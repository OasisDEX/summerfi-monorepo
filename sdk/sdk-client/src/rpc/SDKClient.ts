import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { type SDKAppRouter } from '@summerfi/sdk-server'
import { SerializationService } from '@summerfi/sdk-common/services'

export type RPCClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createRPCClient(apiURL: string): RPCClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: (opts) => opts.direction === 'down' && opts.result instanceof Error,
        logger: (data) => {
          console.log(JSON.stringify(data, null, 2))
        },
      }),
      httpBatchLink({
        url: apiURL,
        transformer: SerializationService.getTransformer(),
      }),
    ],
  })
}
