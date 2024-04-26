/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'
import { OrderPlannerService } from '@summerfi/order-planner-service/implementation'
import { SwapManagerFactory } from '@summerfi/swap-service'
import { ConfigurationProvider, IConfigurationProvider } from '@summerfi/configuration-provider'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ProtocolManager } from '@summerfi/protocol-manager-service'
import { createProtocolsPluginsRegistry } from './CreateProtocolPluginsRegistry'
import { IProtocolManager } from '@summerfi/protocol-manager-common'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type SDKAppContext = {
  deployments: DeploymentIndex
  orderPlannerService: OrderPlannerService
  swapManager: ISwapManager
  configProvider: IConfigurationProvider
  protocolsRegistry: IProtocolPluginsRegistry
  protocolManager: IProtocolManager
}

// context for each request
export const createSDKContext = (opts: ContextOptions): SDKAppContext => {
  const deployments = Deployments as DeploymentIndex
  const configProvider = new ConfigurationProvider()
  const orderPlannerService = new OrderPlannerService({ deployments })
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const protocolsRegistry = createProtocolsPluginsRegistry({
    deployments,
    swapManager,
  })
  const protocolManager = new ProtocolManager({ pluginsRegistry: protocolsRegistry })

  return {
    deployments,
    orderPlannerService,
    swapManager,
    configProvider,
    protocolsRegistry,
    protocolManager,
  }
}
