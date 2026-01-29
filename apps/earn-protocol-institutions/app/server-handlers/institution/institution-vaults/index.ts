import { arkDetailsMap, getProtocolLabel } from '@summerfi/app-earn-ui'
import {
  type SDKVaultishType,
  type SDKVaultType,
  SupportedNetworkIds,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  decorateWithFleetConfig,
  serverOnlyErrorHandler,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  GraphRoleName,
  type Role,
} from '@summerfi/sdk-common'
import dayjs from 'dayjs'
import { unstable_cache as unstableCache } from 'next/cache'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  type InstiVaultActiveUsersResponse,
  type InstiVaultPerformanceResponse,
  type VaultAdditionalInfo,
  type VaultApyAverageMap,
  type VaultApyMap,
  type VaultSharePriceMap,
} from '@/app/server-handlers/institution/institution-vaults/types'
import { graphqlVaultHistoryClients } from '@/app/server-handlers/institution/utils/graph-ql-clients'
import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { vaultSpecificRolesList } from '@/constants/vaults'
import {
  GetInstitutionDataDocument,
  type GetInstitutionDataQuery,
} from '@/graphql/clients/institution/client'
import {
  GetVaultActiveUsersDocument,
  type GetVaultActiveUsersQuery,
  GetVaultActivityLogByTimestampFromDocument,
  type GetVaultActivityLogByTimestampFromQuery,
  GetVaultHistoryDocument,
} from '@/graphql/clients/vault-history/client'
import { getInstiSubgraphId } from '@/helpers/get-insti-subgraph-id'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'
import { type ArksDeployedOnChain } from '@/types/arks'
import { type InstitutionVaultRole } from '@/types/institution-data'

const supportedInstitutionNetworks = [SupportedNetworkIds.Base, SupportedNetworkIds.ArbitrumOne]

// region fetchers

const getInstitutionVaults = async ({ institutionName }: { institutionName: string }) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const institutionSdk = getInstitutionsSDK(institutionName)

    // this is a temporary method
    // until either `getVaultsRaw` returns only the particular insti vaults
    // or `getVaultInfoList` is mapped in the frontend components
    const [systemConfig, ...vaultsInfoArray] = await Promise.all([
      getCachedConfig(),
      ...supportedInstitutionNetworks.map((networkId) =>
        institutionSdk.armada.users.getVaultInfoList({
          chainId: networkId,
        }),
      ),
    ])

    const vaultsInfoByNetwork = supportedInstitutionNetworks.map((networkId, i) => ({
      list: vaultsInfoArray[i].list,
      networkId,
    }))

    const vaultsListByNetwork = (
      await Promise.all(
        vaultsInfoByNetwork.map(async ({ list, networkId }) => {
          const vaults = await Promise.all(
            list.map(async (vaultInfo) => {
              const vaultId = ArmadaVaultId.createFrom({
                chainInfo: getChainInfoByChainId(networkId),
                fleetAddress: vaultInfo.id.fleetAddress,
              })

              const vaultDetails = await institutionSdk.armada.users.getVaultRaw({
                vaultId,
              })

              return vaultDetails.vault ? vaultDetails.vault : null
            }),
          )

          return vaults.filter((vault): vault is NonNullable<typeof vault> => vault !== null).flat()
        }),
      )
    ).flat()

    // temporary mapping of vaultsInfoArray apys to use on the frontend
    const vaultApyMap: VaultApyMap = {}
    const vaultSharePriceMap: VaultSharePriceMap = {}

    const apyLiveAverageArray: number[] = []
    const apy24hAverageArray: number[] = []
    const apy7dAverageArray: number[] = []
    const apy30dAverageArray: number[] = []

    vaultsInfoArray.forEach((vault) => {
      vault.list.forEach((vaultInfo) => {
        const vaultSelector = `${vaultInfo.id.fleetAddress.value}-${vaultInfo.id.chainInfo.chainId.toString()}`

        vaultApyMap[vaultSelector] = {
          apyLive: vaultInfo.apys.live?.value,
          apy24h: vaultInfo.apys.sma24h?.value,
          apy7d: vaultInfo.apys.sma7day?.value,
          apy30d: vaultInfo.apys.sma30day?.value,
        }
        vaultSharePriceMap[vaultSelector] = vaultInfo.sharePrice.value.toString()
      })
    })

    // Calculate average APYs
    vaultsInfoArray.forEach((vault) => {
      vault.list.forEach((vaultInfo) => {
        if (vaultInfo.apys.live?.value !== undefined) {
          apyLiveAverageArray.push(vaultInfo.apys.live.value)
        }
        if (vaultInfo.apys.sma24h?.value !== undefined) {
          apy24hAverageArray.push(vaultInfo.apys.sma24h.value)
        }
        if (vaultInfo.apys.sma7day?.value !== undefined) {
          apy7dAverageArray.push(vaultInfo.apys.sma7day.value)
        }
        if (vaultInfo.apys.sma30day?.value !== undefined) {
          apy30dAverageArray.push(vaultInfo.apys.sma30day.value)
        }
      })
    })

    const apyLiveAverage =
      apyLiveAverageArray.length > 0
        ? apyLiveAverageArray.reduce((a, b) => a + b, 0) / apyLiveAverageArray.length
        : undefined
    const apy24hAverage =
      apy24hAverageArray.length > 0
        ? apy24hAverageArray.reduce((a, b) => a + b, 0) / apy24hAverageArray.length
        : undefined
    const apy7dAverage =
      apy7dAverageArray.length > 0
        ? apy7dAverageArray.reduce((a, b) => a + b, 0) / apy7dAverageArray.length
        : undefined
    const apy30dAverage =
      apy30dAverageArray.length > 0
        ? apy30dAverageArray.reduce((a, b) => a + b, 0) / apy30dAverageArray.length
        : undefined

    const vaultsApyAverages: VaultApyAverageMap = {
      apyLive: apyLiveAverage,
      apy24h: apy24hAverage,
      apy7d: apy7dAverage,
      apy30d: apy30dAverage,
    }

    // above is a temporary method

    const vaultsWithConfig = decorateWithFleetConfig(vaultsListByNetwork, systemConfig)

    const returnTyped: {
      vaults: SDKVaultishType[]
      vaultsAdditionalInfo: VaultAdditionalInfo
    } = {
      vaults: vaultsWithConfig,
      vaultsAdditionalInfo: {
        vaultApyMap,
        vaultsApyAverages,
        vaultSharePriceMap,
      },
    }

    return returnTyped
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vaults:', error)

    return null
  }
}

const getInstitutionVault = async ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const chainId = subgraphNetworkToId(network)

    const institutionSdk = getInstitutionsSDK(institutionName)
    const [vault, systemConfig] = await Promise.all([
      institutionSdk.armada.users.getVaultRaw({
        vaultId: ArmadaVaultId.createFrom({
          chainInfo: getChainInfoByChainId(chainId),
          fleetAddress: Address.createFromEthereum({
            value: vaultAddress,
          }),
        }),
      }),
      getCachedConfig(),
    ])

    if (!vault.vault) {
      return null
    }

    const vaultWithConfig = decorateWithFleetConfig([vault.vault], systemConfig)

    return {
      vault: vaultWithConfig[0],
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault:', error)

    return null
  }
}

const getInstitutionVaultArksImpliedCapsMap = async ({
  network,
  vaultAddress,
  arksAddresses,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
  arksAddresses: string[]
}) => {
  if (!vaultAddress) {
    throw new Error('Fleet commander address is required')
  }

  try {
    const chainId = subgraphNetworkToSDKId(network)
    const publicClient = await getSSRPublicClient(chainId)

    const arksImpliedCapsMap: { [x: string]: string | undefined } = (
      await Promise.all(
        arksAddresses.map(async (arkAddress) => {
          const impliedCap = await publicClient?.readContract({
            abi: FleetCommanderAbi,
            address: vaultAddress as `0x${string}`,
            functionName: 'getEffectiveArkDepositCap',
            args: [arkAddress as `0x${string}`],
          })

          return {
            [arkAddress]: impliedCap?.toString(),
          }
        }),
      )
    ).reduce((acc, curr) => ({ ...acc, ...curr }), {})

    return arksImpliedCapsMap
  } catch (error) {
    throw new Error(
      `Error fetching arks implied caps: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

const getInstitutionVaultPerformanceData = async ({
  network,
  vaultAddress,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  if (!vaultAddress) {
    throw new Error('Fleet commander address is required')
  }

  const client = graphqlVaultHistoryClients[network]

  return await client.request<InstiVaultPerformanceResponse>(
    GetVaultHistoryDocument,
    {
      vaultId: vaultAddress,
    },
    {
      origin: 'earn-protocol-institutions',
    },
  )
}

const getInstitutionVaultActiveUsers = async ({
  chainId,
  vaultAddress,
}: {
  chainId: SupportedNetworkIds
  vaultAddress: string
}): Promise<InstiVaultActiveUsersResponse> => {
  try {
    if (!vaultAddress) {
      throw new Error('Vault address is required')
    }

    const network = chainIdToSDKNetwork(chainId)
    const client = graphqlVaultHistoryClients[network]
    const response = await client.request<GetVaultActiveUsersQuery>(
      GetVaultActiveUsersDocument,
      {
        vaultId: vaultAddress,
      },
      {
        origin: 'earn-protocol-institutions',
      },
    )

    return response.vault?.positions ?? []
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault active users:', error)

    return []
  }
}

const getInstitutionVaultActivityLog = async ({
  chainId,
  vaultAddress,
  // both used to get _weeks_ worth of data with timestampFrom
  // and timestampTo, starting from 0 (current week) to N weeks ago
  weekNo,
  targetContractsList,
}: {
  chainId: SupportedNetworkIds
  vaultAddress: string
  weekNo: number
  targetContractsList: string[]
}): Promise<{
  vault: GetVaultActivityLogByTimestampFromQuery['vault']
  curationEvents: GetVaultActivityLogByTimestampFromQuery['curationEvents']
  roleEvents: GetVaultActivityLogByTimestampFromQuery['roleEvents']
}> => {
  try {
    if (!vaultAddress) {
      throw new Error('Vault address is required')
    }

    const timestampFrom = dayjs()
      .subtract(weekNo + 1, 'week')
      .unix()
    const timestampTo = dayjs().subtract(weekNo, 'week').unix()

    const network = chainIdToSDKNetwork(chainId)
    const client = graphqlVaultHistoryClients[network]
    const response = await client.request<GetVaultActivityLogByTimestampFromQuery>(
      GetVaultActivityLogByTimestampFromDocument,
      {
        vaultId: vaultAddress,
        timestampFrom,
        timestampTo,
        targetContractsList,
      },
      {
        origin: 'earn-protocol-institutions',
      },
    )

    return {
      vault: response.vault,
      curationEvents: response.curationEvents,
      roleEvents: response.roleEvents,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault activity log:', error)

    return {
      vault: null,
      curationEvents: [],
      roleEvents: [],
    }
  }
}

const getInstitutionVaultFeeRevenueConfig = async ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const chainId = subgraphNetworkToId(network)

    const institutionSdk = getInstitutionsSDK(institutionName)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo: getChainInfoByChainId(chainId),
      fleetAddress: Address.createFromEthereum({
        value: vaultAddress,
      }),
    })

    return await institutionSdk.armada.admin.getFeeRevenueConfig({
      vaultId,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault fee revenue config:', error)

    return null
  }
}

const getVaultDetails = async ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress?: string
  network: SupportedSDKNetworks
}) => {
  const institutionSDK = getInstitutionsSDK(institutionName)

  try {
    if (!vaultAddress) {
      return undefined
    }

    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)

    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const { vault } = await institutionSDK.armada.users.getVaultRaw({
      vaultId: poolId,
    })

    return vault as SDKVaultType | undefined
  } catch (error) {
    return serverOnlyErrorHandler(
      'getVaultDetails',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}

const getVaultWhitelist: ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: SupportedSDKNetworks
}) => Promise<Role[]> = async ({ institutionName, vaultAddress, network }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)
  const chainId = subgraphNetworkToSDKId(network)

  const { roles } = await institutionSDK.armada.accessControl.getAllRoles({
    chainId,
    targetContract: vaultAddress as `0x${string}`,
    name: GraphRoleName.WHITELIST_ROLE,
  })

  return roles
}

const getAQWhitelist: ({
  institutionName,
  network,
  addressesList,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  addressesList: `0x${string}`[]
}) => Promise<{
  [address: string]: boolean
}> = async ({ institutionName, network, addressesList }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)
  const chainId = subgraphNetworkToSDKId(network)

  const aqWhitelist = (
    await Promise.all(
      addressesList.map(async (targetAddress) => {
        return await institutionSDK.armada.accessControl
          .isWhitelistedAQ({
            chainId,
            targetAddress,
          })
          .then((isAQWhitelisted) => {
            return {
              [targetAddress]: isAQWhitelisted,
            }
          })
      }),
    )
  ).reduce((acc, curr) => ({ ...acc, ...curr }), {})

  return aqWhitelist
}

const getVaultSpecificRoles: ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: SupportedSDKNetworks
}) => Promise<InstitutionVaultRole[]> = async ({ institutionName, vaultAddress, network }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)
  const chainId = subgraphNetworkToSDKId(network)

  const results = await Promise.all(
    vaultSpecificRolesList.map(async ({ role, roleName }) => {
      const contractAddress = Address.createFromEthereum({
        value: vaultAddress,
      })
      const wallets =
        await institutionSDK.armada.accessControl.getAllAddressesWithContractSpecificRole({
          role,
          contractAddress,
          chainId,
        })

      return wallets.map((address) => ({
        address,
        role: roleName,
      }))
    }),
  )

  return results.flat()
}

const getLandingPageData = async () => {
  try {
    const landingPageDataUrl = 'https://summer.fi/earn/api/landing-page-data'
    const response = await fetch(landingPageDataUrl, {
      method: 'GET',
      next: { revalidate: 300 },
    })
    const data = await response.json()

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching landing page data:', error)

    return []
  }
}

const getArksDeployedOnChain: (props: {
  network: SupportedSDKNetworks
}) => Promise<ArksDeployedOnChain> = async ({ network }) => {
  try {
    const response = (await getLandingPageData()) as {
      vaultsWithConfig: SDKVaultishType[]
      protocolTvls: { [x: string]: string }
    }

    const arksDeployedOnChain = response.vaultsWithConfig
      .filter((vault) => supportedSDKNetwork(vault.protocol.network) === network)
      .flatMap((vault) => vault.arks)
      .filter((ark) => !ark.name?.toLowerCase().includes('buffer'))
      .sort((a, b) => {
        const aTvl = a.inputTokenBalance ? BigInt(a.inputTokenBalance) : BigInt(0)
        const bTvl = b.inputTokenBalance ? BigInt(b.inputTokenBalance) : BigInt(0)

        if (aTvl > bTvl) return -1
        if (aTvl < bTvl) return 1

        return 0
      })
      .map((ark) => {
        const arkDetails = arkDetailsMap[network][ark.id]
        const protocol = ark.name?.split('-') ?? ['n/a']
        const protocolLabel = getProtocolLabel(protocol)
        const protocolAllocationName = ark.name
          ? Object.keys(response.protocolTvls).find((protocolName) => {
              return protocolLabel.toLowerCase().includes(protocolName.toLowerCase())
            })
          : undefined

        const protocolAllocation = protocolAllocationName
          ? response.protocolTvls[protocolAllocationName]
          : undefined

        const arkInfo: ArksDeployedOnChain[number] = {
          productId: ark.productId,
          name: protocolLabel,
          symbol: ark.inputToken.symbol,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          description: arkDetails?.description,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          link: arkDetails?.link,
          id: ark.id,
          protocolAllocation,
        }

        return arkInfo
      })

    return arksDeployedOnChain
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching arks deployed on chain:', error)

    return []
  }
}

const getInstitutionBasicData: (props: {
  institutionName: string
  network: SupportedSDKNetworks
}) => Promise<GetInstitutionDataQuery | undefined> = async ({ institutionName, network }) => {
  try {
    const client = graphqlVaultHistoryClients[network]

    console.log('institution id:', getInstiSubgraphId(institutionName).toString())

    return await client.request<GetInstitutionDataQuery>(
      GetInstitutionDataDocument,
      {
        institutionId: getInstiSubgraphId(institutionName).toString(),
      },
      {
        origin: 'earn-protocol-institutions',
      },
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting institution data:', error)

    return undefined
  }
}

// endregion

// region cached calls

export const getCachedInstitutionVaults = ({ institutionName }: { institutionName: string }) => {
  return unstableCache(getInstitutionVaults, ['institution-vaults', institutionName], {
    revalidate: 300,
    tags: [`institution-vaults-${institutionName.toLowerCase()}`],
  })({ institutionName })
}

export const getCachedInstitutionVault = ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  return unstableCache(
    getInstitutionVault,
    ['institution-vault', institutionName, vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ institutionName, network, vaultAddress })
}
export const getCachedInstitutionVaultArksImpliedCapsMap = ({
  network,
  vaultAddress,
  arksAddresses,
  institutionName,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
  arksAddresses: string[]
  institutionName: string
}) => {
  return unstableCache(
    getInstitutionVaultArksImpliedCapsMap,
    ['institution-vault-arks-implied-caps', vaultAddress, JSON.stringify(arksAddresses), network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-arks-implied-caps-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ network, vaultAddress, arksAddresses })
}
export const getCachedInstitutionVaultPerformanceData = ({
  network,
  vaultAddress,
  institutionName,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
  institutionName: string
}) => {
  return unstableCache(
    getInstitutionVaultPerformanceData,
    ['institution-vault-performance-data', vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-performance-data-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ network, vaultAddress })
}

export const getCachedInstitutionVaultActiveUsers = ({
  chainId,
  vaultAddress,
  institutionName,
}: {
  chainId: SupportedNetworkIds
  vaultAddress: string
  institutionName: string
}) => {
  const network = chainIdToSDKNetwork(chainId)

  return unstableCache(
    getInstitutionVaultActiveUsers,
    ['institution-vault-active-users', vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-active-users-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ chainId, vaultAddress })
}

export const getCachedInstitutionVaultActivityLog = ({
  chainId,
  vaultAddress,
  weekNo,
  institutionName,
  targetContractsList,
}: {
  chainId: SupportedNetworkIds
  vaultAddress: string
  weekNo: number
  institutionName: string
  targetContractsList: string[]
}) => {
  const network = chainIdToSDKNetwork(chainId)

  return unstableCache(
    getInstitutionVaultActivityLog,
    ['institution-vault-activity-log', vaultAddress, network, weekNo.toString()],
    {
      revalidate: 300,
      tags: [
        `institution-vault-activity-log-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ chainId, vaultAddress, weekNo, targetContractsList })
}

export const getCachedInstitutionVaultFeeRevenueConfig = ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  return unstableCache(
    getInstitutionVaultFeeRevenueConfig,
    ['institution-vault-fee-revenue-config', institutionName, vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-fee-revenue-config-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ institutionName, network, vaultAddress })
}

export const getCachedVaultDetails = ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(getVaultDetails, ['vault-details', institutionName, vaultAddress, network], {
    revalidate: 300,
    tags: [
      `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
    ],
  })({ institutionName, vaultAddress, network })
}

export const getCachedVaultWhitelist: ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: SupportedSDKNetworks
}) => Promise<Role[]> = ({ institutionName, vaultAddress, network }) => {
  return unstableCache(
    getVaultWhitelist,
    ['vault-whitelist', institutionName, vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ institutionName, vaultAddress, network })
}

export const getCachedAQWhitelist: ({
  institutionName,
  addressesList,
  network,
}: {
  institutionName: string
  vaultAddress: string
  addressesList: `0x${string}`[]
  network: SupportedSDKNetworks
}) => Promise<{
  [address: string]: boolean
}> = ({ institutionName, addressesList, vaultAddress, network }) => {
  return unstableCache(
    getAQWhitelist,
    ['vault-whitelist', institutionName, addressesList.join(','), network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ institutionName, addressesList, network })
}

export const getCachedVaultSpecificRoles = ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(
    getVaultSpecificRoles,
    ['vault-roles', institutionName, vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ institutionName, vaultAddress, network })
}

export const getCachedArksDeployedOnChain = ({ network }: { network: SupportedSDKNetworks }) => {
  return unstableCache(getArksDeployedOnChain, ['arks-deployed-on-chain', network], {
    revalidate: 3600,
    tags: [`arks-deployed-on-chain-${network.toLowerCase()}`],
  })({ network })
}

export const getCachedInstitutionBasicData = ({
  network,
  institutionName,
}: {
  institutionName: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(getInstitutionBasicData, ['institution-basic-data', network], {
    revalidate: 3600,
    tags: [`institution-basic-data-${network.toLowerCase()}`],
  })({ network, institutionName })
}

// endregion
