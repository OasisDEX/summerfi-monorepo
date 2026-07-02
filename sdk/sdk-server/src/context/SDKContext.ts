import { IAbiProvider } from '@summerfi/abi-provider-common'
import { AbiProviderFactory } from '@summerfi/abi-provider-service'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { AddressBookManagerFactory } from '@summerfi/address-book-service'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AllowanceManagerFactory } from '@summerfi/allowance-manager-service'
import {
  IArmadaManager,
  type IRWAManager,
  setTestDeployment,
} from '@summerfi/armada-protocol-common'
import {
  ArmadaManagerFactory,
  RWAManager,
  DeploymentProvider,
  fetchPublicDeploymentProviderConfig,
  fetchInstiDeploymentProviderConfig,
  type DeploymentProviderConfig,
  type IDeploymentProvider,
} from '@summerfi/armada-protocol-service'
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
import { SwapManagerFactory, CowSwapProvider } from '@summerfi/swap-service'

import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { createProtocolsPluginsRegistry } from './CreateProtocolPluginsRegistry'
import {
  getChainInfoByChainId,
  isChainId,
  LoggingService,
  type ChainId,
  type EarnAppCookieVerifier,
  type IChainInfo,
  type InstiVersion,
} from '@summerfi/sdk-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { TokensManagerFactory } from '@summerfi/tokens-service'
import { jwtVerify } from 'jose'

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
  rwaManager: IRWAManager
  intentSwapsManager: CowSwapProvider
  earnAppCookieVerifier: EarnAppCookieVerifier
}

function parseCookies(event: APIGatewayProxyEventV2): Record<string, string> {
  const cookies: Record<string, string> = {}
  // API Gateway v2 provides cookies as an array of "name=value" strings
  if (event.cookies) {
    for (const cookie of event.cookies) {
      const idx = cookie.indexOf('=')
      if (idx >= 0) {
        cookies[cookie.slice(0, idx).trim()] = cookie.slice(idx + 1).trim()
      }
    }
  }
  // Fallback: parse from Cookie header
  const cookieHeader = event.headers['cookie'] || event.headers['Cookie']
  if (cookieHeader) {
    for (const part of cookieHeader.split(';')) {
      const idx = part.indexOf('=')
      if (idx >= 0) {
        const name = part.slice(0, idx).trim()
        if (!(name in cookies)) {
          cookies[name] = part.slice(idx + 1).trim()
        }
      }
    }
  }
  return cookies
}

function buildEarnAppCookieVerifier(
  cookies: Record<string, string>,
  cookiePrefix: string,
  jwtSecret: string,
): EarnAppCookieVerifier {
  return async (userAddress): Promise<void> => {
    const cookieName = `${cookiePrefix}-${userAddress.toLowerCase()}`
    const cookieValue = cookies[cookieName]
    if (!cookieValue) {
      throw new Error(`Unauthorized: missing authentication cookie for address ${userAddress}`)
    }
    let decodedAddress: string
    try {
      const secretEncoded = new TextEncoder().encode(jwtSecret)
      const { payload } = await jwtVerify(cookieValue, secretEncoded, { algorithms: ['HS512'] })
      const jwtData = (payload as { payload?: { address?: string } }).payload
      decodedAddress = jwtData?.address ?? ''
    } catch {
      throw new Error('Unauthorized: invalid or expired authentication token')
    }
    if (!decodedAddress || decodedAddress.toLowerCase() !== userAddress.toLowerCase()) {
      throw new Error('Unauthorized: token address does not match the requested address')
    }
  }
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
export const createSDKContext = async (opts: SDKContextOptions): Promise<SDKAppContext> => {
  // check for Client-Id header in request and fetch integrator config if present
  const clientId = opts.event.headers['Client-Id'] || opts.event.headers['client-id'] || undefined

  // Institutional deployment-config version (set by makeInstiSdk). Controls whether to source institution wiring from the RWA / institutions-v2 subgraph (v2) or the legacy institutions subgraph (v1).
  const assertInstiVersion = (
    unknownInstiVersion: string | undefined,
  ): InstiVersion | undefined => {
    if (unknownInstiVersion && !['v1', 'v2'].includes(unknownInstiVersion)) {
      throw new Error(`Invalid InstiVersion header: ${unknownInstiVersion}`)
    }

    if (clientId !== undefined && unknownInstiVersion === undefined) {
      return 'v1' // default to v1 for backward compatibility when Client-Id is present without Insti-Version
    }

    return unknownInstiVersion as InstiVersion
  }
  const instiVersion = assertInstiVersion(
    opts.event.headers['Insti-Version'] || opts.event.headers['insti-version'],
  )

  const requestCookies = parseCookies(opts.event)
  const configProvider = new ConfigurationProvider()
  const summerDeployment = configProvider.getConfigurationItem({
    name: 'SUMMER_DEPLOYMENT_CONFIG',
  })
  setTestDeployment(summerDeployment)

  const armadaSubgraphManager = SubgraphManagerFactory.newArmadaSubgraph({
    configProvider,
    clientId,
    instiVersion,
  })
  const dcaSubgraphManager = SubgraphManagerFactory.newDcaSubgraph({ configProvider })
  // RWA is institutional-only: the subgraph manager is only constructed when a Client-Id is present.
  // Public requests leave it unset (RWA routes are unreachable for them); typed non-optional so the
  // institutional RWAManager wiring below stays clean.
  const rwaSubgraphManager = SubgraphManagerFactory.newRwaSubgraph({
    configProvider,
    clientId,
    instiVersion,
  })

  let deploymentProviderConfigs: DeploymentProviderConfig[]
  let supportedChains: IChainInfo[]

  if (clientId) {
    const rawDeployedInstiChainIds = configProvider.getConfigurationItem({
      name: 'SUMMER_DEPLOYED_CHAINS_ID_INSTI',
    })
    const rawDeployedRwaChainIds = configProvider.getConfigurationItem({
      name: 'SUMMER_DEPLOYED_CHAINS_ID_RWA',
    })
    const instiDeployedChainIds: ChainId[] = rawDeployedInstiChainIds
      .split(',')
      .map(Number)
      .filter(isChainId)
    const rwaDeployedChainIds: ChainId[] = rawDeployedRwaChainIds
      .split(',')
      .map(Number)
      .filter(isChainId)

    // v2 (RWA) sources institution wiring from the RWA / institutions-v2 subgraph and the RWA chains;
    // v1 keeps the legacy institutions subgraph + insti chains.
    const useInstiV2 = instiVersion === 'v2'
    LoggingService.log(
      `Client-Id ${clientId} ${instiVersion} - using ${useInstiV2 ? 'RWA' : 'insti'} deployment config with chainIds ${
        useInstiV2 ? rwaDeployedChainIds : instiDeployedChainIds
      }`,
    )
    const deployedChainIds = useInstiV2 ? rwaDeployedChainIds : instiDeployedChainIds
    const instiSubgraphManager = useInstiV2 ? rwaSubgraphManager : armadaSubgraphManager

    supportedChains = deployedChainIds.map(getChainInfoByChainId)
    try {
      deploymentProviderConfigs = await fetchInstiDeploymentProviderConfig(
        instiSubgraphManager,
        deployedChainIds,
        clientId,
      )
    } catch (error) {
      console.error(`Failed to fetch insti deploy config:`, error)
      throw new Error(
        `Failed to fetch insti deploy config for Client-Id ${clientId}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
    if (deploymentProviderConfigs.length === 0) {
      throw new Error(
        `No deployment configs exist for Client-Id ${clientId} on deployed chains ${deployedChainIds.join(', ')}`,
      )
    }
  } else {
    // if no Client-Id header, use default deployment provider config
    const publicDeploymentChainIds: ChainId[] = configProvider
      .getConfigurationItem({
        name: 'SUMMER_DEPLOYED_CHAINS_ID',
      })
      .split(',')
      .map(Number)
      .filter(isChainId)
    supportedChains = publicDeploymentChainIds.map(getChainInfoByChainId)

    deploymentProviderConfigs = fetchPublicDeploymentProviderConfig(publicDeploymentChainIds)
  }

  const supportedChainIds = supportedChains.map((c) => c.chainId)

  const deploymentProvider: IDeploymentProvider = DeploymentProvider(
    supportedChainIds,
    deploymentProviderConfigs,
  )

  const blockchainClientProvider = new BlockchainClientProvider({ configProvider })
  const abiProvider = AbiProviderFactory.newAbiProvider({ configProvider })
  const tokensManager = TokensManagerFactory.newTokensManager({
    configProvider,
    blockchainClientProvider,
  })
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
    blockchainClientProvider,
  })
  const intentSwapsManager = new CowSwapProvider({
    configProvider,
    allowanceManager,
    tokensManager,
    blockchainClientProvider,
  })

  const earnCookiePrefix = configProvider.getConfigurationItem({
    name: 'EARN_PROTOCOL_DCA_COOKIE_PREFIX',
  })
  const earnJwtSecret = configProvider.getConfigurationItem({ name: 'EARN_PROTOCOL_JWT_SECRET' })

  const earnAppCookieVerifier: EarnAppCookieVerifier = buildEarnAppCookieVerifier(
    requestCookies,
    earnCookiePrefix,
    earnJwtSecret,
  )

  const armadaManager = ArmadaManagerFactory.newArmadaManager({
    configProvider,
    deploymentProvider,
    blockchainClientProvider,
    allowanceManager,
    contractsProvider,
    swapManager,
    oracleManager,
    tokensManager,
    supportedChains,
    clientId,
    subgraphManager: armadaSubgraphManager,
    dcaSubgraphManager,
  })

  // RWA is a first-class SDK module (not part of Armada). Its subgraph manager is only
  // wired for institutional (Client-Id) requests;
  const rwaManager = new RWAManager({
    clientId,
    configProvider,
    rwaSubgraphManager,
    tokensManager,
    contractsProvider,
    allowanceManager,
    deploymentProvider,
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
    rwaManager,
    intentSwapsManager,
    earnAppCookieVerifier,
  }
}
