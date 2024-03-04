/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'
import { OrderPlannerService } from '@summerfi/order-planner-service/implementation'
import { SwapService } from '@summerfi/swap-service'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type Context = {
  provider: undefined | string
  deployments: DeploymentIndex
  orderPlannerService: OrderPlannerService
  swapService: SwapService
}

// context for each request
export const createContext = (opts: ContextOptions): Context => {
  const deployments = Deployments as DeploymentIndex
  const orderPlannerService = new OrderPlannerService({ deployments })
  const swapService = new SwapService()

  return {
    provider: undefined,
    deployments,
    orderPlannerService,
    swapService,
  }
}
