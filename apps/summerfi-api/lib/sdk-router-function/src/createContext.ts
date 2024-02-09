/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'

// context for each request
export const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  // TODO
  return {}
}
export type Context = Awaited<ReturnType<typeof createContext>>
