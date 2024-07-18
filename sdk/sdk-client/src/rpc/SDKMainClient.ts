import { SerializationService } from '@summerfi/sdk-common/services'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'

// Workaround to register all serializable classes for the old web app
// export * from '@summerfi/sdk-common/common'
// export * from '@summerfi/sdk-common/exchange'
// export * from '@summerfi/sdk-common/orders'
// export * from '@summerfi/sdk-common/protocols'
// export * from '@summerfi/sdk-common/services'
// export * from '@summerfi/sdk-common/simulation'
// export * from '@summerfi/sdk-common/swap'
// export * from '@summerfi/sdk-common/tokens'
// export * from '@summerfi/sdk-common/user'
// export * from '@summerfi/protocol-plugins'

const EnableDeserialize = false

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createMainRPCClient(apiURL: string): RPCMainClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: (opts) => opts.direction === 'down' && opts.result instanceof Error,
        // logger: (data) => {
        //   console.log(JSON.stringify(data, null, 2))
        // },
      }),
      httpBatchLink({
        url: apiURL,
        transformer: {
          input: SerializationService.getTransformer(),
          output: {
            serialize: SerializationService.getTransformer().serialize,
            deserialize: (object) => {
              try {
                const res = SerializationService.getTransformer().parse(
                  JSON.stringify(object, null, 2),
                )
                // console.log('deserialized', res)
                return EnableDeserialize
                  ? SerializationService.getTransformer().deserialize(object)
                  : res
              } catch (error) {
                console.log(error)
              }
            },
          },
        },
      }),
    ],
  })
}
