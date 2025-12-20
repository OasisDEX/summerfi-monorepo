import { Text } from '@summerfi/app-earn-ui'
import { getArksInterestRates, getVaultsHistoricalApy } from '@summerfi/app-server-handlers'
import { humanNetworktoSDKNetwork, subgraphNetworkToId, ten } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId, isAddress } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { redirect } from 'next/navigation'

import {
  getCachedInstitutionVaultPerformanceData,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { getArkHistoricalChartData } from '@/features/charts/mappers/mapApyChartData'
import { mapSinglePointChartData } from '@/features/charts/mappers/mapSinglePointChartData'
import { PanelOverview } from '@/features/panels/vaults/components/PanelOverview/PanelOverview'
import { getInstiVaultNiceName } from '@/helpers/get-insti-vault-nice-name'

export default async function InstitutionVaultOverviewPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const institutionSdk = getInstitutionsSDK(institutionName)
  const chainId = subgraphNetworkToId(parsedNetwork)
  const chainInfo = getChainInfoByChainId(chainId)
  const fleetAddress = Address.createFromEthereum({
    value: vaultAddress,
  })

  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })
  const parsedVaultAddress = vaultAddress.toLowerCase()

  if (!parsedVaultAddress && !isAddress(vaultAddress)) {
    redirect('/not-found')
  }

  const [vault] = await Promise.all([
    getCachedVaultDetails({
      institutionName,
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultAddress} on the network {parsedNetwork}
      </Text>
    )
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
  const summerVaultName = getInstiVaultNiceName({
    network: parsedNetwork,
    symbol: vault.inputToken.symbol,
    institutionName,
  })

  return (
    <PanelOverview
      navChartData={navChartData}
      aumChartData={aumChartData}
      arksHistoricalChartData={arksHistoricalChartData}
      summerVaultName={summerVaultName}
    />
  )
}
