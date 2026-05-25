import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { sdkAppRouter, createSDKContext } from '@summerfi/sdk-server'

export const baseHandler = awsLambdaRequestHandler({
  router: sdkAppRouter,
  createContext: createSDKContext,
  maxBatchSize: 5,
  allowMethodOverride: true,
})

export const handler = (
  event: Parameters<typeof baseHandler>[0],
  context: Parameters<typeof baseHandler>[1],
) => {
  console.log('[raw event headers]', JSON.stringify(event.headers))
  const normalizedEvent = {
    ...event,
    headers: Object.fromEntries(
      Object.entries(event.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]),
    ),
  }
  return baseHandler(normalizedEvent, context)
}
