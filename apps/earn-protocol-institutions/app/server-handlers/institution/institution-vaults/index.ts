import { arkDetailsMap, getProtocolLabel } from '@summerfi/app-earn-ui'
import {
  type LandingPageData,
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
  InstiGlobalRoles,
  type IRwaVaultInfo,
  type Role,
} from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
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
import {
  graphqlRwaVaultHistoryClients,
  graphqlVaultHistoryClients,
} from '@/app/server-handlers/institution/utils/graph-ql-clients'
import { getInstitutionsRwaSDK, getInstitutionsSDK } from '@/app/server-handlers/sdk'
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
import {
  decorateRwaVaults,
  getInstitutionRwaClientChainPairs,
  getRwaClientIdForVault,
  getVaultConfigCustomFields,
  isRwaVaultByConfig,
} from '@/helpers/rwa'
import { getNavPriceChange24h, getNavPriceChange30d } from '@/helpers/rwa-nav'
import { type ArksDeployedOnChain } from '@/types/arks'
import { type InstitutionVaultRole } from '@/types/institution-data'

// Mirror the main app's regular vaults-list chain coverage (all SupportedNetworkIds). The
// per-institution SDK throws on chains where a client has no deployment, so each chain is fetched
// in isolation below and a missing deployment degrades to an empty list.
const supportedInstitutionNetworks = Object.values(SupportedNetworkIds).filter(
  (networkId): networkId is SupportedNetworkIds => typeof networkId === 'number',
)

// The standard (v1) institutional SDK only has deployments on a subset of chains, so per-chain
// `getVaultInfoList` throws for chains a client isn't deployed on. This shows up two ways, both
// benign and both handled (degrade to an empty list): "No deployment configs" when the SDK knows
// the chain but the client has no deployment, and "Only absolute URLs are supported" when the chain
// has no subgraph URL configured at all (e.g. Mainnet/Sonic/HyperEVM for institutional v1). Neither
// is logged as an error — a genuine outage would blank Base/Arbitrum too and surface as an empty
// list everywhere, which is the real signal.
const isExpectedMissingDeploymentError = (error: unknown): boolean =>
  error instanceof Error &&
  (error.message.includes('No deployment configs') ||
    error.message.includes('Only absolute URLs are supported'))

// region fetchers

const getInstitutionVaults = async ({ institutionName }: { institutionName: string }) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const institutionSdk = getInstitutionsSDK(institutionName)

    // this is a temporary method
    // until either `getVaultsRaw` returns only the particular insti vaults
    // or `getVaultInfoList` is mapped in the frontend components
    const systemConfig = await getCachedConfig()

    // The per-client SDK throws on chains where the institution has no deployment (e.g. an RWA-only
    // client like a single curator has no standard fleets on Base/Arbitrum). Isolate each chain so a
    // missing deployment yields an empty list instead of rejecting the whole response.
    const vaultsInfoArray = await Promise.all(
      supportedInstitutionNetworks.map((networkId) =>
        institutionSdk.armada.users
          .getVaultInfoList({ chainId: networkId })
          .catch((error: unknown) => {
            if (!isExpectedMissingDeploymentError(error)) {
              // eslint-disable-next-line no-console
              console.error(
                `Error fetching standard vault info for ${institutionName} on chain ${networkId}:`,
                error,
              )
            }

            return { list: [] } as Awaited<
              ReturnType<typeof institutionSdk.armada.users.getVaultInfoList>
            >
          }),
      ),
    )

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

              const vaultDetails = await institutionSdk.armada.users
                .getVaultRaw({ vaultId })
                .catch(() => null)

              return vaultDetails?.vault ?? null
            }),
          )

          return vaults.filter((vault): vault is NonNullable<typeof vault> => vault !== null).flat()
        }),
      )
    ).flat()

    // RWA vaults are served by the institutions-v2 deployment (rounds-based, separate subgraph) via
    // the v2 SDK (getInstitutionsRwaSDK). The clientId is the vault's `vaultInstitutionId` (an
    // institution can own several, e.g. `Name_v2`). We pair each clientId with the chain its config
    // lives on — like the earn-protocol app — and fetch each pair exactly once. Cross-producting
    // clientIds against every RWA network (the previous approach) re-fetched the same vaults because
    // the SDK resolves the subgraph from the Client-Id, producing duplicates. Each pair is isolated
    // so one failing/empty fetch never blanks the rest, nor the standard list.
    const rwaClientChainPairs = getInstitutionRwaClientChainPairs({ systemConfig, institutionName })

    const rwaResults = await Promise.all(
      rwaClientChainPairs.map(async ({ clientId, networkId }) => {
        try {
          const rwaSdk = getInstitutionsRwaSDK(clientId)
          const [rawResult, infoResult] = await Promise.all([
            rwaSdk.rwa.getVaultsRaw({
              chainInfo: getChainInfoByChainId(networkId),
              clientId,
            }),
            rwaSdk.rwa.getVaultInfoListPerChain({
              chainId: getChainInfoByChainId(networkId).chainId,
              clientId,
            }),
          ])

          const decorated = decorateRwaVaults({
            vaults: rawResult.vaults as unknown as SDKVaultishType[],
            systemConfig,
            networkId,
          })

          // The RWA subgraph `totalValueLockedUSD` omits settling deposits, so it understates (often
          // $0) the real TVL. Override it with the SDK market value (fleet + pending deposits +
          // claimable withdrawals) so institution totals and the vault table reflect true TVL.
          const vaultsWithTvl = await Promise.all(
            decorated.map(async (vault) => {
              try {
                const marketValue = await rwaSdk.rwa.getVaultMarketValue({
                  chainId: getChainInfoByChainId(networkId).chainId,
                  fleetAddress: vault.id.toLowerCase() as `0x${string}`,
                })

                return { ...vault, totalValueLockedUSD: marketValue.totalUsd.amount }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Error fetching RWA market value for vault ${vault.id}:`, error)

                return vault
              }
            }),
          )

          return {
            vaults: vaultsWithTvl,
            infoList: infoResult.list,
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `Error fetching RWA vaults for clientId ${clientId} on chain ${networkId}:`,
            error,
          )

          return { vaults: [] as SDKVaultishType[], infoList: [] as IRwaVaultInfo[] }
        }
      }),
    )

    const rwaVaultsByNetwork = rwaResults.flatMap((result) => result.vaults)
    const rwaInfoList = rwaResults.flatMap((result) => result.infoList)

    // APY / share-price maps + averages, keyed by `${fleetAddress}-${chainId}`. Standard and RWA
    // vault info share the same apys/sharePrice shape, so both feed the maps and the averages.
    const vaultApyMap: VaultApyMap = {}
    const vaultSharePriceMap: VaultSharePriceMap = {}

    const apyLiveAverageArray: number[] = []
    const apy24hAverageArray: number[] = []
    const apy7dAverageArray: number[] = []
    const apy30dAverageArray: number[] = []

    // Drop disabled vaults and RWA vaults from the standard info list: the v1 subgraph also indexes
    // RWA vaults under the institution, so without this the maps/averages would include disabled
    // vaults and double-count RWA vaults (which already come from rwaInfoList).
    const standardVaultInfos = vaultsInfoArray
      .flatMap((vault) => vault.list)
      .filter((vaultInfo) => {
        const configCustomFields = getVaultConfigCustomFields({
          systemConfig,
          networkId: Number(vaultInfo.id.chainInfo.chainId),
          vaultAddress: vaultInfo.id.fleetAddress.value,
        })

        return !configCustomFields?.disabled && !configCustomFields?.vaultCurator
      })

    const allVaultInfos: (IRwaVaultInfo | (typeof vaultsInfoArray)[number]['list'][number])[] = [
      ...standardVaultInfos,
      ...rwaInfoList,
    ]

    allVaultInfos.forEach((vaultInfo) => {
      const vaultSelector = `${vaultInfo.id.fleetAddress.value}-${vaultInfo.id.chainInfo.chainId.toString()}`

      vaultApyMap[vaultSelector] = {
        apyLive: vaultInfo.apys.live?.value,
        apy24h: vaultInfo.apys.sma24h?.value,
        apy7d: vaultInfo.apys.sma7day?.value,
        apy30d: vaultInfo.apys.sma30day?.value,
      }
      vaultSharePriceMap[vaultSelector] = vaultInfo.sharePrice.value.toString()

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

    // The standard (v1) institutions subgraph also indexes RWA vaults under the institution, so the
    // standard fetch can return the same vault the RWA fetch does. RWA vaults are sourced solely from
    // the RWA fetch above, so drop them from the standard list to avoid the same vault appearing
    // twice. Detect RWA by config-by-address (not the decoration flag — see the isRwaVault gotcha).
    const vaultsWithConfig = decorateWithFleetConfig(vaultsListByNetwork, systemConfig).filter(
      (vault) =>
        !isRwaVaultByConfig({
          systemConfig,
          networkId: subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network)),
          vaultAddress: vault.id,
        }),
    )

    const returnTyped: {
      vaults: SDKVaultishType[]
      vaultsAdditionalInfo: VaultAdditionalInfo
    } = {
      vaults: [...vaultsWithConfig, ...rwaVaultsByNetwork],
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
    const systemConfig = await getCachedConfig()

    const vaultId = ArmadaVaultId.createFrom({
      chainInfo: getChainInfoByChainId(chainId),
      fleetAddress: Address.createFromEthereum({
        value: vaultAddress,
      }),
    })

    // RWA vaults live on the institutions-v2 deployment; route them through the v2 SDK keyed by the
    // vault's `vaultInstitutionId` clientId. `armada.users.getVaultRaw` (v1) returns nothing for them.
    const rwaClientId = getRwaClientIdForVault({ systemConfig, networkId: chainId, vaultAddress })

    if (rwaClientId) {
      const { vault: rwaVault } = await getInstitutionsRwaSDK(rwaClientId).rwa.getVaultRaw({
        vaultId,
      })

      if (!rwaVault) {
        return null
      }

      const [rwaDecorated] = decorateRwaVaults({
        vaults: [rwaVault as unknown as SDKVaultishType],
        systemConfig,
        networkId: chainId,
      })

      // NAV (pricePerShare) performance metrics, computed from the vault's daily snapshots — the RWA
      // equivalent of an APY. `navPriceSkipFirstNDays` (config) trims the volatile inception window.
      const skipFirstNDays =
        getVaultConfigCustomFields({ systemConfig, networkId: chainId, vaultAddress })
          ?.navPriceSkipFirstNDays ?? 0
      const navPriceChange30d = getNavPriceChange30d(rwaVault, skipFirstNDays)

      return {
        vault: {
          ...rwaDecorated,
          navPriceChange24h: getNavPriceChange24h(rwaVault),
          navApy30d: navPriceChange30d?.apy ?? null,
          navApy30dPartialDays: navPriceChange30d?.isPartial ? navPriceChange30d.daysUsed : null,
        },
      }
    }

    const { vault } = await institutionSdk.armada.users.getVaultRaw({ vaultId })

    if (!vault) {
      return null
    }

    const [decorated] = decorateWithFleetConfig([vault], systemConfig)

    return {
      vault: decorated,
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

// NAV (pricePerShare) + TVL (inputTokenBalanceNormalized) history for an RWA vault, read straight
// from the institutions-v2 subgraph (the v1 institutions subgraph used for standard vaults doesn't
// index RWA vaults, so the charts would otherwise be empty). Same field shape as GetVaultHistory, so
// the result is interchangeable with the standard performance data the chart mappers consume.
const RWA_VAULT_HISTORY_QUERY = gql`
  query GetRwaVaultHistory($vaultId: ID!) {
    vault(id: $vaultId) {
      id
      protocol {
        network
      }
      inputToken {
        symbol
        decimals
      }
      inputTokenBalance
      hourlyVaultHistory: hourlySnapshots(first: 721, orderBy: timestamp, orderDirection: desc) {
        netValue: inputTokenBalanceNormalized
        navPrice: pricePerShare
        timestamp
      }
      dailyVaultHistory: dailySnapshots(first: 366, orderBy: timestamp, orderDirection: desc) {
        netValue: inputTokenBalanceNormalized
        navPrice: pricePerShare
        timestamp
      }
      weeklyVaultHistory: weeklySnapshots(first: 157, orderBy: timestamp, orderDirection: desc) {
        netValue: inputTokenBalanceNormalized
        navPrice: pricePerShare
        timestamp
      }
    }
  }
`

const emptyPerformanceResponse = (
  vaultAddress: string,
  network: SupportedSDKNetworks,
): InstiVaultPerformanceResponse => ({
  vault: {
    id: vaultAddress,
    protocol: { network },
    inputToken: { symbol: '', decimals: 18 },
    inputTokenBalance: '0',
    hourlyVaultHistory: [],
    dailyVaultHistory: [],
    weeklyVaultHistory: [],
  },
})

const getRwaVaultPerformanceData = async ({
  network,
  vaultAddress,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
}): Promise<InstiVaultPerformanceResponse> => {
  const client = graphqlRwaVaultHistoryClients[network]

  if (!client) {
    return emptyPerformanceResponse(vaultAddress, network)
  }

  try {
    // The subgraph returns `vault: null` when the address isn't found, so type it as nullable here.
    const response = await client.request<{
      vault: InstiVaultPerformanceResponse['vault'] | null
    }>(
      RWA_VAULT_HISTORY_QUERY,
      { vaultId: vaultAddress.toLowerCase() },
      {
        origin: 'earn-protocol-institutions',
      },
    )

    // Guarantee a non-null vault so the chart mappers (which assume one) never crash.
    return response.vault
      ? { vault: response.vault }
      : emptyPerformanceResponse(vaultAddress, network)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching RWA vault performance data:', error)

    return emptyPerformanceResponse(vaultAddress, network)
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

  // RWA vaults live on the institutions-v2 subgraph; route their NAV / TVL history there. Both the
  // institution-overview (multi-vault) and vault-overview charts consume this fetcher, so the
  // branch makes both RWA-aware in one place.
  const systemConfig = await getCachedConfig()
  const isRwa = !!getRwaClientIdForVault({
    systemConfig,
    networkId: subgraphNetworkToId(network),
    vaultAddress,
  })

  if (isRwa) {
    return await getRwaVaultPerformanceData({ network, vaultAddress })
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

// Vault-wide RWA activity from the institutions-v2 subgraph. RWA deposits/withdrawals flow through
// the rounds vaults (Input = deposits, Output = withdrawals), recorded as per-account receipt
// `activities` — not on the standard `vault.deposits/withdraws`. We resolve the fleet's rounds-vault
// pair, then page receipts per side by exact rounds-vault id (the nested targetVault filter isn't
// supported by graph-node), and flatten their activities into a single timeline.
export type RwaActivityItem = {
  type: string
  side: 'deposit' | 'withdrawal'
  timestamp: number
  txHash: string
  account: string
  amount: string
  tokenSymbol: string
  roundId: string
  roundState: string
}

export type RwaVaultActivity = {
  chainId: number
  activities: RwaActivityItem[]
}

// Receipts pulled per rounds-vault side. Bounded — newest-touched first; a "load more" can page via
// skip later if needed.
const RWA_ACTIVITY_RECEIPTS_LIMIT = 200

const GetRwaRoundsVaultPairDocument = gql`
  query GetRwaRoundsVaultPair($fleet: String!) {
    roundsVaultPairs(where: { targetVault: $fleet }) {
      inputVault {
        id
      }
      outputVault {
        id
      }
    }
  }
`

const GetRwaVaultReceiptsDocument = gql`
  query GetRwaVaultReceipts($vault: String!, $first: Int!) {
    receipts(first: $first, orderBy: lastUpdated, orderDirection: desc, where: { vault: $vault }) {
      account {
        id
      }
      round {
        roundId
        state
      }
      activities(orderBy: timestamp, orderDirection: desc) {
        type
        timestamp
        txHash
        assetAmount
        assetToken {
          symbol
          decimals
        }
      }
    }
  }
`

type RwaReceiptsResponse = {
  receipts: {
    account: { id: string } | null
    round: { roundId: string; state: string }
    activities: {
      type: string
      timestamp: string
      txHash: string
      assetAmount: string
      assetToken: { symbol: string; decimals: number }
    }[]
  }[]
}

const getRwaVaultActivity = async ({
  network,
  vaultAddress,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
}): Promise<RwaVaultActivity> => {
  const chainId = subgraphNetworkToId(network)
  const client = graphqlRwaVaultHistoryClients[network]

  if (!client) {
    return { chainId, activities: [] }
  }

  try {
    const { roundsVaultPairs } = await client.request<{
      roundsVaultPairs: { inputVault: { id: string }; outputVault: { id: string } }[]
    }>(
      GetRwaRoundsVaultPairDocument,
      { fleet: vaultAddress.toLowerCase() },
      { origin: 'earn-protocol-institutions' },
    )

    if (roundsVaultPairs.length === 0) {
      return { chainId, activities: [] }
    }

    const [pair] = roundsVaultPairs

    const [inputReceipts, outputReceipts] = await Promise.all([
      client.request<RwaReceiptsResponse>(
        GetRwaVaultReceiptsDocument,
        { vault: pair.inputVault.id, first: RWA_ACTIVITY_RECEIPTS_LIMIT },
        { origin: 'earn-protocol-institutions' },
      ),
      client.request<RwaReceiptsResponse>(
        GetRwaVaultReceiptsDocument,
        { vault: pair.outputVault.id, first: RWA_ACTIVITY_RECEIPTS_LIMIT },
        { origin: 'earn-protocol-institutions' },
      ),
    ])

    const mapReceipts = (
      receipts: RwaReceiptsResponse['receipts'],
      side: RwaActivityItem['side'],
    ): RwaActivityItem[] =>
      receipts.flatMap((receipt) =>
        receipt.activities.map((activity) => ({
          type: activity.type,
          side,
          timestamp: Number(activity.timestamp),
          txHash: activity.txHash,
          account: receipt.account?.id ?? '',
          amount: new BigNumber(activity.assetAmount)
            .shiftedBy(-activity.assetToken.decimals)
            .toString(),
          tokenSymbol: activity.assetToken.symbol,
          roundId: receipt.round.roundId,
          roundState: receipt.round.state,
        })),
      )

    const activities = [
      ...mapReceipts(inputReceipts.receipts, 'deposit'),
      ...mapReceipts(outputReceipts.receipts, 'withdrawal'),
    ].sort((a, b) => b.timestamp - a.timestamp)

    return { chainId, activities }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching RWA vault activity:', error)

    return { chainId, activities: [] }
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

// On-chain fleet fee rates, read straight from the FleetCommander contract. `getFeeRevenueConfig`
// (v1 admin SDK) doesn't surface RWA fees, so RWA vaults read these directly. `tipRate` exists on
// every fleet; `performanceFeeRate` is RWA-only (non-RWA fleets revert → null). Both are stored as
// uint256 scaled by 1e18 and expressed in percent, so we shift by -18 then -2 to get a decimal
// fraction (0.01 = 1%) ready for `formatDecimalAsPercent`. Mirrors earn-protocol `getFleetCommanderFees`.
const FEE_RATE_DECIMALS = 18

const performanceFeeRateAbi = [
  {
    type: 'function',
    name: 'performanceFeeRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'Percentage' }],
    stateMutability: 'view',
  },
] as const

export type InstitutionVaultFleetFees = {
  managementFee: number | null
  performanceFee: number | null
}

const readFeeRate = async (read: () => Promise<bigint | unknown>): Promise<number | null> => {
  try {
    const raw = await read()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (raw === undefined || raw === null) {
      return null
    }

    return new BigNumber(String(raw)).shiftedBy(-FEE_RATE_DECIMALS).shiftedBy(-2).toNumber()
  } catch {
    // A revert (e.g. performanceFeeRate on a non-RWA fleet) or transient RPC error → treat as absent.
    return null
  }
}

const getInstitutionVaultFleetFees = async ({
  network,
  vaultAddress,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
}): Promise<InstitutionVaultFleetFees> => {
  try {
    const chainId = subgraphNetworkToSDKId(network)
    const publicClient = await getSSRPublicClient(chainId)

    if (!publicClient) {
      return { managementFee: null, performanceFee: null }
    }

    const address = vaultAddress as `0x${string}`

    const [managementFee, performanceFee] = await Promise.all([
      readFeeRate(() =>
        publicClient.readContract({ abi: FleetCommanderAbi, address, functionName: 'tipRate' }),
      ),
      readFeeRate(() =>
        publicClient.readContract({
          abi: performanceFeeRateAbi,
          address,
          functionName: 'performanceFeeRate',
        }),
      ),
    ])

    return { managementFee, performanceFee }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault fleet fees:', error)

    return { managementFee: null, performanceFee: null }
  }
}

// Risk-parameter data for an RWA vault, read from the institutions-v2 deployment. Caps / buffer are
// display-only (no RWA admin setter); the two rounds-vault `minPositionSize`s are the editable bits.
// All token amounts are normalized to display units (decimal strings). `null` = not available (n/a).
export type RwaVaultRiskParameters = {
  inputTokenSymbol: string
  vaultCap: string | null
  depositLimit: string | null
  minimumBufferBalance: string | null
  inputMinPositionSize: string | null
  inputMinPositionSymbol: string | null
  inputMinPositionDecimals: number | null
  outputMinPositionSize: string | null
  outputMinPositionSymbol: string | null
  outputMinPositionDecimals: number | null
  arks: {
    id: string
    name: string | null
    depositCap: string | null
    tokenSymbol: string
    maxDepositPercentage: number | null
  }[]
}

const normalizeAmount = (
  raw: string | number | bigint | null | undefined,
  decimals: number,
): string | null =>
  raw != null ? new BigNumber(raw.toString()).shiftedBy(-decimals).toString() : null

const getRwaVaultRiskParameters = async ({
  network,
  vaultAddress,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
}): Promise<RwaVaultRiskParameters | null> => {
  const systemConfig = await getCachedConfig()
  const chainId = subgraphNetworkToId(network)
  const rwaClientId = getRwaClientIdForVault({ systemConfig, networkId: chainId, vaultAddress })

  if (!rwaClientId) {
    return null
  }

  try {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo: getChainInfoByChainId(chainId),
      fleetAddress: Address.createFromEthereum({ value: vaultAddress }),
    })

    const { vault } = await getInstitutionsRwaSDK(rwaClientId).rwa.getVaultRaw({ vaultId })

    if (!vault) {
      return null
    }

    const { decimals } = vault.inputToken
    const inputVault = vault.roundsVaultPair?.inputVault
    const outputVault = vault.roundsVaultPair?.outputVault

    return {
      inputTokenSymbol: vault.inputToken.symbol,
      vaultCap: normalizeAmount(vault.depositCap, decimals),
      depositLimit: normalizeAmount(vault.depositLimit, decimals),
      minimumBufferBalance: normalizeAmount(vault.minimumBufferBalance, decimals),
      inputMinPositionSize: inputVault
        ? normalizeAmount(inputVault.minPositionSize, inputVault.underlyingToken.decimals)
        : null,
      inputMinPositionSymbol: inputVault?.underlyingToken.symbol ?? null,
      inputMinPositionDecimals: inputVault?.underlyingToken.decimals ?? null,
      outputMinPositionSize: outputVault
        ? normalizeAmount(outputVault.minPositionSize, outputVault.underlyingToken.decimals)
        : null,
      outputMinPositionSymbol: outputVault?.underlyingToken.symbol ?? null,
      outputMinPositionDecimals: outputVault?.underlyingToken.decimals ?? null,
      arks: vault.arks.map((ark) => ({
        id: ark.id,
        name: ark.name ?? null,
        depositCap: normalizeAmount(ark.depositCap, ark.inputToken.decimals),
        tokenSymbol: ark.inputToken.symbol,
        maxDepositPercentage: new BigNumber(ark.maxDepositPercentageOfTVL.toString())
          .shiftedBy(-18)
          .toNumber(),
      })),
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching RWA vault risk parameters:', error)

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

    // RWA vaults live on the institutions-v2 deployment; route by the vault's `vaultInstitutionId`
    // clientId via the v2 SDK so the overview / risk pages resolve them instead of "not found".
    const systemConfig = await getCachedConfig()
    const rwaClientId = getRwaClientIdForVault({ systemConfig, networkId: chainId, vaultAddress })

    const { vault } = rwaClientId
      ? await getInstitutionsRwaSDK(rwaClientId).rwa.getVaultRaw({ vaultId: poolId })
      : await institutionSDK.armada.users.getVaultRaw({ vaultId: poolId })

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
    name: InstiGlobalRoles.WHITELIST_ROLE,
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

    return data as LandingPageData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching landing page data:', error)

    return {} as LandingPageData
  }
}

const getArksDeployedOnChain: (props: {
  network: SupportedSDKNetworks
}) => Promise<ArksDeployedOnChain> = async ({ network }) => {
  try {
    const response = await getLandingPageData()

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
          ? response.protocolTvls[
              protocolAllocationName as keyof typeof response.protocolTvls
            ].toString()
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

export const getCachedRwaVaultActivity = ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  return unstableCache(getRwaVaultActivity, ['rwa-vault-activity', vaultAddress, network], {
    revalidate: 300,
    tags: [
      `rwa-vault-activity-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
    ],
  })({ network, vaultAddress })
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

export const getCachedInstitutionVaultFleetFees = ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  return unstableCache(
    getInstitutionVaultFleetFees,
    ['institution-vault-fleet-fees', institutionName, vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `institution-vault-fleet-fees-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ network, vaultAddress })
}

export const getCachedRwaVaultRiskParameters = ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  return unstableCache(
    getRwaVaultRiskParameters,
    ['rwa-vault-risk-parameters', institutionName, vaultAddress, network],
    {
      revalidate: 300,
      tags: [
        `rwa-vault-risk-parameters-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
      ],
    },
  )({ network, vaultAddress })
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
      `vault-details-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
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
        `vault-whitelist-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
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
        `vault-aq-whitelist-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
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
        `vault-roles-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
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
  return unstableCache(
    getInstitutionBasicData,
    ['institution-basic-data', network, institutionName.toLowerCase()],
    {
      revalidate: 3600,
      tags: [`institution-basic-data-${network.toLowerCase()}-${institutionName.toLowerCase()}`],
    },
  )({ network, institutionName })
}

// endregion
