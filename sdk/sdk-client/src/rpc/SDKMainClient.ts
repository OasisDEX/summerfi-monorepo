import { LoggingService, SerializationService } from '@summerfi/sdk-common'
import type { SDKAppRouter } from '@summerfi/sdk-server'
import { createTRPCClient, httpBatchLink, loggerLink, splitLink } from '@trpc/client'

export type RPCMainClientType = ReturnType<typeof createTRPCClient<SDKAppRouter>>

const URL_LENGTH_SPLIT = 3000

function getEstimatedUrlLength(apiURL: string, path: string, input: unknown): number {
  const encodedInput = SerializationService.stringify(input)

  return apiURL.length + path.length + encodedInput.length + 64
}

function getRequestMethod(type: 'query' | 'mutation' | 'subscription', estimatedUrlLength: number) {
  return type === 'query' && estimatedUrlLength <= URL_LENGTH_SPLIT ? 'GET' : 'POST'
}

function getLoggedRequestUrl(params: {
  apiURL: string
  path: string
  input: unknown
  method: 'GET' | 'POST'
}): string {
  const [apiUrlWithoutQuery, ...queryPartsFromBaseUrl] = params.apiURL.split('?')
  const queryParts = queryPartsFromBaseUrl.length > 0 ? [queryPartsFromBaseUrl.join('?')] : []
  const url = `${apiUrlWithoutQuery.replace(/\/$/, '')}/${params.path}`

  queryParts.push('batch=1')

  if (params.method === 'GET' && params.input !== undefined) {
    const serializedInput = SerializationService.getTransformer().input.serialize(params.input)
    const batchInput = { 0: serializedInput }

    queryParts.push(`input=${encodeURIComponent(JSON.stringify(batchInput))}`)
  }

  return queryParts.length > 0 ? `${url}?${queryParts.join('&')}` : url
}

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
          // Only log the URL for outgoing requests, not responses
          if (opts.direction === 'up') {
            const estimatedUrlLength = getEstimatedUrlLength(params.apiURL, opts.path, opts.input)
            const method = getRequestMethod(opts.type, estimatedUrlLength)
            const fullUrl = getLoggedRequestUrl({
              apiURL: params.apiURL,
              path: opts.path,
              input: opts.input,
              method,
            })

            LoggingService.log(`[SDK] ${method}: ${fullUrl}`)
          }
        },
      }),
      splitLink({
        condition(op) {
          if (op.type !== 'query') {
            return true
          }

          const estimatedUrlLength = getEstimatedUrlLength(params.apiURL, op.path, op.input)

          return estimatedUrlLength > URL_LENGTH_SPLIT
        },
        true: postBatchLink,
        false: getBatchLink,
      }),
    ],
  })
}
