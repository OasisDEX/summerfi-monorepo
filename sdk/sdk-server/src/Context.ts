/* eslint-disable @typescript-eslint/no-unused-vars */
import { PriceService, TokenService, ProtocolPluginsRegistry, MockContractProvider  } from '@summerfi/protocol-plugins'
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'
import { OrderPlannerService } from '@summerfi/order-planner-service/implementation'
import { SwapManagerFactory } from '@summerfi/swap-service'
import { ConfigurationProvider, IConfigurationProvider } from '@summerfi/configuration-provider'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { protocolManager } from '@summerfi/protocol-manager'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type SDKAppContext = {
  deployments: DeploymentIndex
  orderPlannerService: OrderPlannerService
  swapManager: ISwapManager
  configProvider: IConfigurationProvider
  protocolsRegistry: ProtocolBuilderRegistryType
  protocolManager: typeof protocolManager
}

// context for each request
export const createSDKContext = (opts: ContextOptions): SDKAppContext => {
  const deployments = Deployments as DeploymentIndex
  const configProvider = new ConfigurationProvider()
  const orderPlannerService = new OrderPlannerService({ deployments })

  // TODO create client manager to set chain
  const client = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(),
  })

  /**
   * Protocols manager has dependencies initialised after instantiation
   * To preserve type safety of protocol manager methods (such as getPool)
   */
  protocolManager.init({
    provider: client,
    tokenService: new TokenService(),
    priceService: new PriceService(client),
    contractProvider: new MockContractProvider(),
  })
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const protocolsRegistry = ProtocolPluginsRegistry

  return {
    deployments,
    orderPlannerService,
    swapManager,
    configProvider,
    protocolsRegistry,
    protocolManager,
  }
}
