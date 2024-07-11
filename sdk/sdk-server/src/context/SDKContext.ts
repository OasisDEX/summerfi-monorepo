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
import { EarnProtocolManagerFactory } from '@summerfi/earn-protocol-service'
import type { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { BlockchainnClientProvider } from '@summerfi/blockchain-client-provider'
import { AllowanceManagerFactory } from '@summerfi/allowance-service'
import type { IAllowanceManager } from '@summerfi/allowance-common'

export type SDKContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type SDKAppContext = {
  addressBookManager: IAddressBookManager
  configProvider: IConfigurationProvider
  blokchainClientProvider: BlockchainnClientProvider
  tokensManager: ITokensManager
  swapManager: ISwapManager
  oracleManager: IOracleManager
  protocolsRegistry: IProtocolPluginsRegistry
  protocolManager: IProtocolManager
  orderPlannerService: IOrderPlannerService
  allowanceManager: IAllowanceManager
  earnProtocolManager: IEarnProtocolManager
}

// context for each request
export const createSDKContext = (opts: SDKContextOptions): SDKAppContext => {
  const configProvider = new ConfigurationProvider()
  const blokchainClientProvider = new BlockchainnClientProvider({ configProvider })
  const addressBookManager = AddressBookManagerFactory.newAddressBookManager({ configProvider })
  const tokensManager = TokensManagerFactory.newTokensManager({ configProvider })
  const orderPlannerService = new OrderPlannerService()
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const oracleManager = OracleManagerFactory.newOracleManager({ configProvider })
  const protocolsRegistry = createProtocolsPluginsRegistry({
    configProvider,
    blokchainClientProvider,
    tokensManager,
    oracleManager,
    swapManager,
    addressBookManager,
  })
  const protocolManager = ProtocolManager.createWith({ pluginsRegistry: protocolsRegistry })
  const allowanceManager = AllowanceManagerFactory.newAllowanceManager({
    configProvider,
  })
  const earnProtocolManager = EarnProtocolManagerFactory.newEarnProtocolManager({ configProvider })

  return {
    configProvider,
    blokchainClientProvider,
    addressBookManager,
    tokensManager,
    swapManager,
    oracleManager,
    protocolsRegistry,
    protocolManager,
    orderPlannerService,
    allowanceManager,
    earnProtocolManager,
  }
}
