/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAbiProvider } from '@summerfi/abi-provider-common'
import { AbiProviderFactory } from '@summerfi/abi-provider-service'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { AddressBookManagerFactory } from '@summerfi/address-book-service'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AllowanceManagerFactory } from '@summerfi/allowance-manager-service'
import { IArmadaManager } from '@summerfi/armada-protocol-common'
import { ArmadaManagerFactory } from '@summerfi/armada-protocol-service'
import { BlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ContractsProviderFactory } from '@summerfi/contracts-provider-service'
import { IOracleManager } from '@summerfi/oracle-common'
import { OracleManagerFactory } from '@summerfi/oracle-service'
import { IOrderPlannerService } from '@summerfi/order-planner-common'
import { OrderPlannerService } from '@summerfi/order-planner-service'
import { IProtocolManager } from '@summerfi/protocol-manager-common'
import { ProtocolManager } from '@summerfi/protocol-manager-service'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { SubgraphManagerFactory } from '@summerfi/subgraph-manager-service'
import { ISwapManager } from '@summerfi/swap-common'
import { SwapManagerFactory } from '@summerfi/swap-service'
import { ITokensManager } from '@summerfi/tokens-common'
import { TokensManagerFactory } from '@summerfi/tokens-service'

import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { createProtocolsPluginsRegistry } from './CreateProtocolPluginsRegistry'

export type SDKContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type SDKAppContext = {
  callUrl: string
  callKey: string
  addressBookManager: IAddressBookManager
  configProvider: IConfigurationProvider
  blockchainClientProvider: BlockchainClientProvider
  abiProvider: IAbiProvider
  contractsProvider: IContractsProvider
  tokensManager: ITokensManager
  swapManager: ISwapManager
  oracleManager: IOracleManager
  protocolsRegistry: IProtocolPluginsRegistry
  protocolManager: IProtocolManager
  orderPlannerService: IOrderPlannerService
  allowanceManager: IAllowanceManager
  armadaManager: IArmadaManager
}

const quickHashCode = (str: string): string => {
  let hash = 0
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return String(Math.abs(hash))
}

// context for each request
export const createSDKContext = (opts: SDKContextOptions): SDKAppContext => {
  const configProvider = new ConfigurationProvider()
  const blockchainClientProvider = new BlockchainClientProvider({ configProvider })
  const abiProvider = AbiProviderFactory.newAbiProvider({ configProvider })
  const tokensManager = TokensManagerFactory.newTokensManager({ configProvider })
  const contractsProvider = ContractsProviderFactory.newContractsProvider({
    configProvider,
    blockchainClientProvider,
    tokensManager,
  })
  const addressBookManager = AddressBookManagerFactory.newAddressBookManager({ configProvider })
  const orderPlannerService = new OrderPlannerService()
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const oracleManager = OracleManagerFactory.newOracleManager({ configProvider })
  const protocolsRegistry = createProtocolsPluginsRegistry({
    configProvider,
    blockchainClientProvider: blockchainClientProvider,
    tokensManager,
    oracleManager,
    swapManager,
    addressBookManager,
  })
  const protocolManager = ProtocolManager.createWith({ pluginsRegistry: protocolsRegistry })
  const allowanceManager = AllowanceManagerFactory.newAllowanceManager({
    configProvider,
    contractsProvider,
  })
  const armadaSubgraphManager = SubgraphManagerFactory.newArmadaSubgraph({ configProvider })
  const armadaManager = ArmadaManagerFactory.newArmadaManager({
    configProvider,
    blockchainClientProvider,
    allowanceManager,
    contractsProvider,
    subgraphManager: armadaSubgraphManager,
    swapManager,
    oracleManager,
    tokensManager,
  })

  return {
    callUrl: `${opts.event.rawPath}?${opts.event.rawQueryString}`,
    callKey: quickHashCode(`${opts.event.rawPath}${opts.event.rawQueryString}`),
    configProvider,
    blockchainClientProvider,
    abiProvider,
    contractsProvider,
    addressBookManager,
    tokensManager,
    swapManager,
    oracleManager,
    protocolsRegistry,
    protocolManager,
    orderPlannerService,
    allowanceManager,
    armadaManager,
  }
}
