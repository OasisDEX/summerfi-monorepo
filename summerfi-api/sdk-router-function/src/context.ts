/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'
import { OrderPlannerService } from '@summerfi/order-planner-service/implementation'
import { SwapManagerFactory } from '@summerfi/swap-service'
import { ConfigurationProvider, IConfigurationProvider } from '@summerfi/configuration-provider'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type Context = {
  provider: undefined | string
  deployments: DeploymentIndex
  orderPlannerService: OrderPlannerService
  swapManager: ISwapManager
  configProvider: IConfigurationProvider
}

// context for each request
export const createContext = (opts: ContextOptions): Context => {
  const deployments = Deployments as DeploymentIndex
  const configProvider = new ConfigurationProvider()
  const orderPlannerService = new OrderPlannerService({ deployments })
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })

  return {
    provider: undefined,
    deployments,
    orderPlannerService,
    swapManager,
    configProvider,
  }
}
