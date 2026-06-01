import { IAbiProvider } from '@summerfi/abi-provider-common'
import { AbiProviderFactory } from '@summerfi/abi-provider-service'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { AddressBookManagerFactory } from '@summerfi/address-book-service'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AllowanceManagerFactory } from '@summerfi/allowance-manager-service'
import { IArmadaManager, setTestDeployment } from '@summerfi/armada-protocol-common'
import {
  ArmadaManagerFactory,
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
  // Institutional deployment-config version (set by makeInstiSdk). Defaults to 'v1' so existing
  // makeAdminSDK clients (which do not send the header) keep the legacy institutions config path.
  const instiVersion =
    opts.event.headers['Insti-Version'] || opts.event.headers['insti-version'] || 'v1'
  LoggingService.log('Request headers', opts.event.headers)

  const requestCookies = parseCookies(opts.event)
  const configProvider = new ConfigurationProvider()
  const summerDeployment = configProvider.getConfigurationItem({
    name: 'SUMMER_DEPLOYMENT_CONFIG',
  })
  setTestDeployment(summerDeployment)

  const armadaSubgraphManager = SubgraphManagerFactory.newArmadaSubgraph({
    configProvider,
    clientId,
  })
  const dcaSubgraphManager = SubgraphManagerFactory.newDcaSubgraph({ configProvider })
  const rwaSubgraphManager = SubgraphManagerFactory.newRwaSubgraph({ configProvider })

  let deploymentProviderConfigs: DeploymentProviderConfig[]
  let supportedChains: IChainInfo[]

  if (clientId) {
    const rawInstiChainIds = configProvider.getConfigurationItem({
      name: 'SUMMER_DEPLOYED_CHAINS_ID_INSTI',
    })
    const rawRwaChainIds = configProvider.getConfigurationItem({
      name: 'SUMMER_DEPLOYED_CHAINS_ID_RWA',
    })
    const instiChainIds: ChainId[] = rawInstiChainIds.split(',').map(Number).filter(isChainId)
    const rwaChainIds: ChainId[] = rawRwaChainIds.split(',').map(Number).filter(isChainId)

    // v2 (RWA) sources institution wiring from the RWA / institutions-v2 subgraph and the RWA chains;
    // v1 keeps the legacy institutions subgraph + insti chains.
    const useRwaConfig = instiVersion === 'v2'
    const configChainIds = useRwaConfig ? rwaChainIds : instiChainIds
    const institutionSubgraphManager = useRwaConfig ? rwaSubgraphManager : armadaSubgraphManager

    supportedChains = configChainIds.map(getChainInfoByChainId)
    try {
      deploymentProviderConfigs = await fetchInstiDeploymentProviderConfig(
        institutionSubgraphManager,
        configChainIds,
        clientId,
      )
    } catch (error) {
      console.error(`Failed to fetch integrator config:`, error)
      throw new Error(`Failed to fetch integrator config for Client-Id ${clientId}`)
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
    subgraphManager: armadaSubgraphManager,
    swapManager,
    oracleManager,
    tokensManager,
    supportedChains,
    clientId,
    dcaSubgraphManager,
    rwaSubgraphManager,
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
    intentSwapsManager,
    earnAppCookieVerifier,
  }
}
