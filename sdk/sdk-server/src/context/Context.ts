/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Deployments } from '@summerfi/core-contracts'
import { IOrderPlannerService, OrderPlannerService } from '@summerfi/order-planner-service'
import { ConfigurationProvider, IConfigurationProvider } from '@summerfi/configuration-provider'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { SwapManagerFactory } from '@summerfi/swap-service'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ProtocolManager } from '@summerfi/protocol-manager-service'
import { createProtocolsPluginsRegistry } from './CreateProtocolPluginsRegistry'
import { IProtocolManager } from '@summerfi/protocol-manager-common'
import { ITokensManager } from '@summerfi/tokens-common'
import { TokensManagerFactory } from '@summerfi/tokens-service'
import { IOracleManager } from '@summerfi/oracle-common'
import { OracleManagerFactory } from '@summerfi/oracle-service'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type SDKAppContext = {
  deployments: DeploymentIndex
  configProvider: IConfigurationProvider
  tokensManager: ITokensManager
  swapManager: ISwapManager
  oracleManager: IOracleManager
  protocolsRegistry: IProtocolPluginsRegistry
  protocolManager: IProtocolManager
  orderPlannerService: IOrderPlannerService
}

// context for each request
export const createSDKContext = (opts: ContextOptions): SDKAppContext => {
  const deployments = Deployments as DeploymentIndex
  const configProvider = new ConfigurationProvider()
  const tokensManager = TokensManagerFactory.newTokensManager({ configProvider })
  const orderPlannerService = new OrderPlannerService({ deployments })
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const oracleManager = OracleManagerFactory.newOracleManager({ configProvider })
  const protocolsRegistry = createProtocolsPluginsRegistry({
    configProvider,
    deployments,
    tokensManager,
    oracleManager,
    swapManager,
  })
  const protocolManager = ProtocolManager.createWith({ pluginsRegistry: protocolsRegistry })

  return {
    deployments,
    configProvider,
    tokensManager,
    swapManager,
    oracleManager,
    protocolsRegistry,
    protocolManager,
    orderPlannerService,
  }
}
