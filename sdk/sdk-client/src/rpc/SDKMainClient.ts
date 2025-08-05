import { LoggingService, SerializationService } from '@summerfi/sdk-common'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createMainRPCClient(params: {
  apiURL: string
  clientId?: string
  logging?: boolean
}): RPCMainClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: () => !!params.logging,
        logger(opts) {
          const apiUrlBase = new URL(`${params.apiURL}/${opts.path}`)
          const input = SerializationService.stringify(opts.input)
          apiUrlBase.searchParams.set('input', input)
          LoggingService.log(`SDK call (${opts.path}):`, apiUrlBase.toString())
        },
      }),
      httpBatchLink({
        url: params.apiURL,
        transformer: SerializationService.getTransformer(),
        maxURLLength: 10000,
        headers() {
          return {
            ...(params.clientId && { 'Client-Id': params.clientId }),
          }
        },
      }),
    ],
  })
}
