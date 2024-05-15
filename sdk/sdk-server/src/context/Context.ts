/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
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
import { IAddressBookManager } from '@summerfi/address-book-common'
import { AddressBookManagerFactory } from '@summerfi/address-book-service'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type SDKAppContext = {
  addressBookManager: IAddressBookManager
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
  const configProvider = new ConfigurationProvider()
  const addressBookManager = AddressBookManagerFactory.newAddressBookManager({ configProvider })
  const tokensManager = TokensManagerFactory.newTokensManager({ configProvider })
  const orderPlannerService = new OrderPlannerService()
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const oracleManager = OracleManagerFactory.newOracleManager({ configProvider })
  const protocolsRegistry = createProtocolsPluginsRegistry({
    configProvider,
    tokensManager,
    oracleManager,
    swapManager,
    addressBookManager,
  })
  const protocolManager = ProtocolManager.createWith({ pluginsRegistry: protocolsRegistry })

  return {
    configProvider,
    addressBookManager,
    tokensManager,
    swapManager,
    oracleManager,
    protocolsRegistry,
    protocolManager,
    orderPlannerService,
  }
}
