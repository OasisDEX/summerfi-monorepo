/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type Context = {
  provider: undefined | string
  deployments: undefined | DeploymentIndex
}

// context for each request
export const createContext = (opts: ContextOptions) => {
  return {
    provider: undefined,
    deployments: Deployments,
  }
}
