import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedMigratablePositions } from '@/app/server-handlers/cached/migration'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { MigrationLandingPageView } from '@/components/layout/MigrationLandingPageView/MigrationLandingPageView'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type MigrationLandingPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const MigrationLandingPage = async ({ params }: MigrationLandingPageProps) => {
  const { walletAddress } = await params

  const [{ vaults }, configRaw, migratablePositionsData, sumrPrice] = await Promise.all([
    getCachedVaultsList(),
    getCachedConfig(),
    getCachedMigratablePositions({ walletAddress }),
    getCachedSumrPrice(),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)
  const migrationsEnabled = !!systemConfig.features?.Migrations

  if (!migrationsEnabled) {
    redirect('/not-found')
  }

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
    daoManagedVaultsList,
  })

  const vaultsApyByNetworkMap = await getCachedVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
    })),
  })

  const migrationBestVaultApy = getMigrationBestVaultApy({
    migratablePositions,
    vaultsWithConfig,
    vaultsApyByNetworkMap,
  })

  return (
    <MigrationLandingPageView
      vaultsList={vaultsWithConfig}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      migratablePositions={migratablePositions}
      walletAddress={walletAddress}
      migrationBestVaultApy={migrationBestVaultApy}
      sumrPrice={sumrPrice}
    />
  )
}

export default MigrationLandingPage
