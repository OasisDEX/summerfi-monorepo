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

const EnableDeserialize = false

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

export function createMainRPCClient(apiURL: string, logging?: boolean): RPCMainClientType {
  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: () => !!logging,
        logger(opts) {
          const apiUrlBase = new URL(`${apiURL}/${opts.path}`)
          const transformer = SerializationService.getTransformer()
          const input = transformer.stringify(opts.input)
          apiUrlBase.searchParams.set('input', input)
          console.log('Calling SDK url:', apiUrlBase.toString())
        },
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
                return EnableDeserialize
                  ? SerializationService.getTransformer().deserialize(object)
                  : res
              } catch (error) {
                console.log('Error deserializing object', error)
              }
            },
          },
        },
        maxURLLength: 10000,
      }),
    ],
  })
}
