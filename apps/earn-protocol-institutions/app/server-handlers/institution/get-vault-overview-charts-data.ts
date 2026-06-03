import { getArksInterestRates, getVaultsHistoricalApy } from '@summerfi/app-server-handlers'
import { type ArksHistoricalChartData, type SingleSourceChartData } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, subgraphNetworkToId, ten } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import {
  getCachedInstitutionVaultPerformanceData,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { getArkHistoricalChartData } from '@/features/charts/mappers/mapApyChartData'
import { mapSinglePointChartData } from '@/features/charts/mappers/mapSinglePointChartData'

export type VaultOverviewChartsData = {
  navChartData: SingleSourceChartData
  aumChartData: SingleSourceChartData
  arksHistoricalChartData: ArksHistoricalChartData
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
  const institutionSdk = getInstitutionsSDK(institutionName)
  const chainId = subgraphNetworkToId(parsedNetwork)
  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress: Address.createFromEthereum({ value: vaultAddress }),
  })
  const parsedVaultAddress = vaultAddress.toLowerCase()

  const vault = await getCachedVaultDetails({
    institutionName,
    vaultAddress: parsedVaultAddress,
    network: parsedNetwork,
  })

  if (!vault) {
    return null
  }

  const [arkInterestRatesMap, performanceData, vaultInfo, vaultInterestRates] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vault.arks,
    }),
    getCachedInstitutionVaultPerformanceData({
      vaultAddress,
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
          fleetAddress: vaultAddress,
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
