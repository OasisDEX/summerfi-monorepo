import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { parseServerResponseToClient, subgraphNetworkToId } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getMigratablePositions } from '@/app/server-handlers/migration'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { MigrateLandingPageView } from '@/components/layout/MigrateLandingPageView/MigrateLandingPageView'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type MigrateLandingPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const MigrateLandingPage = async ({ params }: MigrateLandingPageProps) => {
  const { walletAddress } = await params

  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
    tags: [REVALIDATION_TAGS.PORTFOLIO_DATA, walletAddress.toLowerCase()],
  }

  const [{ vaults }, configRaw, migratablePositionsData] = await Promise.all([
    getVaultsList(),
    systemConfigHandler(),
    unstableCache(getMigratablePositions, [walletAddress], cacheConfig)({ walletAddress }),
  ])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  return (
    <MigrateLandingPageView
      vaultsList={vaultsWithConfig}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      migratablePositions={migratablePositions}
      walletAddress={walletAddress}
    />
  )
}

export default MigrateLandingPage
