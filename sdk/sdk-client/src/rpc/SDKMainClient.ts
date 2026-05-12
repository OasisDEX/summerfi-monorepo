import { LoggingService, SerializationService } from '@summerfi/sdk-common'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink, splitLink } from '@trpc/client'

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

const URL_LENGTH_SPLIT = 3000

export function createMainRPCClient(params: {
  apiURL: string
  clientId?: string
  logging?: boolean
}): RPCMainClientType {
  const getBatchLink = httpBatchLink({
    url: params.apiURL,
    transformer: SerializationService.getTransformer(),
    maxURLLength: 5000,
    maxItems: 5,
    fetch: (url, opts) => fetch(url, { ...opts, credentials: 'omit' }),
    headers() {
      return {
        ...(params.clientId && { 'Client-Id': params.clientId }),
      }
    },
  })

  const postBatchLink = httpBatchLink({
    url: params.apiURL,
    transformer: SerializationService.getTransformer(),
    methodOverride: 'POST',
    maxURLLength: 10000,
    maxItems: 5,
    fetch: (url, opts) => fetch(url, { ...opts, credentials: 'omit' }),
    headers() {
      return {
        ...(params.clientId && { 'Client-Id': params.clientId }),
      }
    },
  })

  return createTRPCClient<SDKAppRouter>({
    links: [
      loggerLink({
        enabled: () => !!params.logging,
        logger(opts) {
          const apiUrlBase = new URL(`${params.apiURL}/${opts.path}`)
          const encodedInput = SerializationService.stringify(opts.input)
          const estimatedUrlLength =
            params.apiURL.length + opts.path.length + encodedInput.length + 64
          const method =
            opts.type === 'query' && estimatedUrlLength <= URL_LENGTH_SPLIT ? 'GET' : 'POST'

          LoggingService.log(`[SDK] ${method}: ${apiUrlBase}`)
        },
      }),
      splitLink({
        condition(op) {
          if (op.type !== 'query') {
            return true
          }

          const encodedInput = SerializationService.stringify(op.input)
          const estimatedUrlLength =
            params.apiURL.length + op.path.length + encodedInput.length + 64
          return estimatedUrlLength > URL_LENGTH_SPLIT
        },
        true: postBatchLink,
        false: getBatchLink,
      }),
    ],
  })
}
