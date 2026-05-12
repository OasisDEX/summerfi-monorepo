import { LoggingService, SerializationService } from '@summerfi/sdk-common'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink, splitLink } from '@trpc/client'

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

const MAX_URL_LENGTH = 3000

export function createMainRPCClient(params: {
  apiURL: string
  clientId?: string
  logging?: boolean
}): RPCMainClientType {
  const getBatchLink = httpBatchLink({
    url: params.apiURL,
    transformer: SerializationService.getTransformer(),
    maxURLLength: MAX_URL_LENGTH,
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
            opts.type === 'query' && estimatedUrlLength <= MAX_URL_LENGTH ? 'GET' : 'POST'

          LoggingService.log(`[SDK] ${method}: ${apiUrlBase}`)
          LoggingService.log(`[SDK] ${estimatedUrlLength}`)
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
          LoggingService.log(`[SDK condition] ${estimatedUrlLength}`)
          return estimatedUrlLength > MAX_URL_LENGTH
        },
        true: postBatchLink,
        false: getBatchLink,
      }),
    ],
  })
}
