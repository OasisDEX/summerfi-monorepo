import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { type SDKAppRouter } from '@summerfi/sdk-server'
import { SerializationService } from '@summerfi/sdk-common/services'

// Quick hack to register all serializable classes
export * from '@summerfi/sdk-common/common'
export * from '@summerfi/sdk-common/exchange'
export * from '@summerfi/sdk-common/orders'
export * from '@summerfi/sdk-common/simulation'
export * from '@summerfi/sdk-common/user'
export * from '@summerfi/sdk-common/services'
export * from '@summerfi/sdk-common/utils'
export * from '@summerfi/sdk-common/protocols'

const EnableDeserialize = false

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
        transformer: {
          input: SerializationService.getTransformer(),
          output: {
            serialize: SerializationService.getTransformer().serialize,
            deserialize: (object) => {
              return EnableDeserialize
                ? SerializationService.getTransformer().deserialize(object)
                : SerializationService.getTransformer().parse(JSON.stringify(object, null, 2))
            },
          },
        },
      }),
    ],
  })
}
