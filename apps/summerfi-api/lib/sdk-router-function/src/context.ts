/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'
import { OrderPlannerService } from '@summerfi/order-planner-service/implementation'
import { SwapService } from '@summerfi/swap-service'
import type { GetQuote } from '@summerfi/simulator-service'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type Context = {
  getQuote: undefined | GetQuote
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
    getQuote: undefined,
    deployments,
    orderPlannerService,
    swapService,
  }
}
