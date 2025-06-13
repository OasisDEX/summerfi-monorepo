import { type FC } from 'react'
import { parseServerResponseToClient, subgraphNetworkToId } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { YieldTrendView } from '@/features/yield-trend/components/YieldTrendView'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface YieldTrendPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const YieldTrendPage: FC<YieldTrendPageProps> = async ({ searchParams: awaitableSearchParams }) => {
  const _searchParams = await awaitableSearchParams
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  return <YieldTrendView vaults={vaultsWithConfig} vaultsApyByNetworkMap={vaultsApyByNetworkMap} />
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - Yield Trend`,
    description:
      'Compare the median DeFi yield to Lazy Summer AI-Optimized Yield. See how Lazy Summer Protocol outperforms the market with AI-powered yield optimization.',
  }
}

export default YieldTrendPage
