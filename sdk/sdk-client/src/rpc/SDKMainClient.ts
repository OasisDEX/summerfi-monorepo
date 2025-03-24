import { SerializationService } from '@summerfi/sdk-common/services'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'

// Workaround to register all serializable classes for the old web app
// export * from '@summerfi/protocol-plugins'
// export * from '@summerfi/sdk-common/common'
// export * from '@summerfi/sdk-common/exchange'
// export * from '@summerfi/sdk-common/lending-protocols'
// export * from '@summerfi/sdk-common/orders'
// export * from '@summerfi/sdk-common/services'
// export * from '@summerfi/sdk-common/simulation'
// export * from '@summerfi/sdk-common/swap'
// export * from '@summerfi/sdk-common/tokens'
// export * from '@summerfi/sdk-common/user'

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createMainRPCClient(apiURL: string): RPCMainClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: (opts) => opts.direction === 'down' && opts.result instanceof Error,
        logger: (ops) => {
          console.log(JSON.stringify(ops, null, 2))
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
