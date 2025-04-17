import { LoggingService, SerializationService } from '@summerfi/sdk-common'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createMainRPCClient(apiURL: string, logging?: boolean): RPCMainClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: () => !!logging,
        logger(opts) {
          const apiUrlBase = new URL(`${apiURL}/${opts.path}`)
          const input = SerializationService.stringify(opts.input)
          apiUrlBase.searchParams.set('input', input)
          LoggingService.log(`SDK call (${opts.path}):`, apiUrlBase.toString())
        },
      }),
      httpBatchLink({
        url: apiURL,
        transformer: SerializationService.getTransformer(),
        maxURLLength: 10000,
      }),
    ],
  })
}
