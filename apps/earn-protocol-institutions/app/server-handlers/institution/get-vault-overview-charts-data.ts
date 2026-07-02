import { getArksInterestRates, getVaultsHistoricalApy } from '@summerfi/app-server-handlers'
import { type ArksHistoricalChartData, type SingleSourceChartData } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, subgraphNetworkToId, ten } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVaultPerformanceData,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { getArkHistoricalChartData } from '@/features/charts/mappers/mapApyChartData'
import { mapSinglePointChartData } from '@/features/charts/mappers/mapSinglePointChartData'
import { getRwaClientIdForVault } from '@/helpers/rwa'

export type VaultOverviewChartsData = {
  navChartData: SingleSourceChartData
  aumChartData: SingleSourceChartData
  arksHistoricalChartData: ArksHistoricalChartData
}

// RWA vaults are single-market (no FleetCommander ark allocation), so the ARK historical-yield chart
// doesn't apply — render it empty rather than reaching for ark/rates data that doesn't exist.
const EMPTY_ARKS_HISTORICAL_CHART_DATA: ArksHistoricalChartData = {
  data: { '7d': [], '30d': [], '90d': [], '6m': [], '1y': [], '3y': [] },
  dataNames: [],
  colors: {},
}

// The vault overview page used to block on four heavy calls (ark interest rates, per-vault
// performance history, SDK vault info, and historical APY) just to build the NAV / AUM / ARK
// charts. Those — and the chart mappers — now live behind this handler so the page paints its
// header + contracts shell immediately and the charts stream in via a scroll-gated client query.
export const getVaultOverviewChartsData = async ({
  institutionName,
  vaultAddress,
  network,
}: {
  institutionName: string
  vaultAddress: string
  network: string
}): Promise<VaultOverviewChartsData | null> => {
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  // Normalise once and reuse for every keyed call so the vault-details / performance / historical
  // caches and the SDK vault id all key off the same lowercased address (no cache misses).
  const parsedVaultAddress = vaultAddress.toLowerCase()
  const chainId = subgraphNetworkToId(parsedNetwork)

  const [vault, systemConfig] = await Promise.all([
    getCachedVaultDetails({
      institutionName,
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
    }),
    getCachedConfig(),
  ])

  if (!vault) {
    return null
  }

  // RWA vaults don't resolve on the v1 SDK (getVaultInfo) or the standard rates/historical-APY
  // subgraphs. Build the NAV + AUM charts from the (RWA-aware) performance data — NAV from the
  // pricePerShare history, AUM from inputTokenBalance — and skip the inapplicable ARK chart.
  const isRwa = !!getRwaClientIdForVault({
    systemConfig,
    networkId: chainId,
    vaultAddress: parsedVaultAddress,
  })

  if (isRwa) {
    const rwaPerformanceData = await getCachedInstitutionVaultPerformanceData({
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
      institutionName,
    })

    // History is fetched newest-first (orderDirection: desc), so .at(0) is the latest NAV point.
    const latestNavPrice =
      rwaPerformanceData.vault.hourlyVaultHistory.at(0)?.navPrice ??
      rwaPerformanceData.vault.dailyVaultHistory.at(0)?.navPrice ??
      rwaPerformanceData.vault.weeklyVaultHistory.at(0)?.navPrice ??
      '0'

    const rwaNavChartData = mapSinglePointChartData({
      performanceData: rwaPerformanceData,
      currentPointValue: latestNavPrice,
      pointName: 'navPrice',
    })
    const rwaAumChartData = mapSinglePointChartData({
      performanceData: rwaPerformanceData,
      currentPointValue: new BigNumber(vault.inputTokenBalance.toString())
        .div(ten.pow(vault.inputToken.decimals))
        .toString(),
      pointName: 'netValue',
    })

    return {
      navChartData: rwaNavChartData,
      aumChartData: rwaAumChartData,
      arksHistoricalChartData: EMPTY_ARKS_HISTORICAL_CHART_DATA,
    }
  }

  const institutionSdk = getInstitutionsSDK(institutionName)
  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress: Address.createFromEthereum({ value: parsedVaultAddress }),
  })

  const [arkInterestRatesMap, performanceData, vaultInfo, vaultInterestRates] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vault.arks,
    }),
    getCachedInstitutionVaultPerformanceData({
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
      institutionName,
    }),
    institutionSdk.armada.users.getVaultInfo({
      vaultId,
    }),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [
        {
          fleetAddress: parsedVaultAddress,
          chainId,
        },
      ],
    }),
  ])

  const navChartData = mapSinglePointChartData({
    performanceData,
    currentPointValue: vaultInfo.sharePrice.value.toString(),
    pointName: 'navPrice',
  })
  const aumChartData = mapSinglePointChartData({
    performanceData,
    currentPointValue: new BigNumber(vault.inputTokenBalance.toString())
      .div(ten.pow(vault.inputToken.decimals))
      .toString(),
    pointName: 'netValue',
  })
  const arksHistoricalChartData = getArkHistoricalChartData({
    vault,
    arkInterestRatesMap,
    vaultInterestRates,
    institutionName,
  })

  return { navChartData, aumChartData, arksHistoricalChartData }
}
