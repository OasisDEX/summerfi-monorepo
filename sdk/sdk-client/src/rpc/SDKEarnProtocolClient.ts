import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { SerializationService } from '@summerfi/sdk-common/services'
import { EarnProtocolAppRouter } from '@summerfi/sdk-server'

// Quick hack to register all serializable classes
export * from '@summerfi/sdk-common/common'
export * from '@summerfi/sdk-common/exchange'
export * from '@summerfi/sdk-common/orders'
export * from '@summerfi/sdk-common/simulation'
export * from '@summerfi/sdk-common/user'
export * from '@summerfi/sdk-common/services'
export * from '@summerfi/sdk-common/protocols'
export * from '@summerfi/protocol-plugins'

const EnableDeserialize = false

// TODO: type of RPC is any for now until we implement the server side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RPCEarnProtocolClientType = ReturnType<typeof createTRPCClient<EarnProtocolAppRouter>>

export function createEarnProtocolRPCClient(apiURL: string): RPCEarnProtocolClientType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createTRPCClient<EarnProtocolAppRouter>({
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
