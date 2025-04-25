import { getDisplayToken, isVaultAtLeastDaysOld, Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultOpenPageProps = {
  params: Promise<{
    vaultId: string // could be vault address or the vault name
    network: SDKNetwork
  }>
}

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const { network: paramsNetwork, vaultId } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId && !isAddress(vaultId)) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [vault, { vaults }, medianDefiYield, topDepositors, latestActivity, rebalanceActivity] =
    await Promise.all([
      getVaultDetails({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
      }),
      getVaultsList(),
      getMedianDefiYield(),
      getPaginatedTopDepositors({
        page: 1,
        limit: 4,
        strategies: [strategy],
      }),
      getPaginatedLatestActivity({
        page: 1,
        limit: 4,
        strategies: [strategy],
      }),
      getPaginatedRebalanceActivity({
        page: 1,
        limit: 4,
        strategies: [strategy],
        startTimestamp: dayjs().subtract(30, 'days').unix(),
      }),
    ])

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  const [arkInterestRatesMap, vaultInterestRates, vaultsApyRaw] = await Promise.all([
    vault?.arks
      ? getInterestRates({
          network: parsedNetwork,
          arksList: vault.arks,
        })
      : Promise.resolve({}),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
    getVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap,
    vaultInterestRates,
  })

  const vaultApyData = vaultsApyRaw[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`]

  return (
    <VaultOpenView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arkInterestRatesMap}
      vaultApyData={vaultApyData}
      vaultsApyRaw={vaultsApyRaw}
    />
  )
}

export async function generateMetadata({ params }: EarnVaultOpenPageProps): Promise<Metadata> {
  const { network: paramsNetwork, vaultId } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())
  const prodHost = (await headers()).get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  const [vault] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []

  const [vaultsApyRaw] = await Promise.all([
    getVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
  ])

  const vaultApyData =
    vaultsApyRaw[`${vaultWithConfig.id}-${subgraphNetworkToId(vaultWithConfig.protocol.network)}`]

  const totalValueLockedTokenParsed = vault
    ? formatCryptoBalance(
        new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
      )
    : ''

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault: vaultWithConfig, days: 30 })

  const apy30d = isVaultAtLeast30dOld
    ? vaultApyData.sma30d
      ? formatDecimalAsPercent(vaultApyData.sma30d, { noPercentSign: true })
      : 'n/a'
    : 'New'

  return {
    title: `Lazy Summer Protocol - ${vault ? getDisplayToken(vault.inputToken.symbol) : ''} on ${capitalize(paramsNetwork)}, $${totalValueLockedTokenParsed} TVL`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: `${baseUrl}earn/api/og/vault?tvl=${totalValueLockedTokenParsed}&apy30d=${apy30d}&token=${vaultWithConfig.inputToken.symbol}`,
    },
  }
}

export default EarnVaultOpenPage
