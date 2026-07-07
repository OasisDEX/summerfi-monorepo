import { type IArmadaPosition } from '@summerfi/app-types'
import { parseServerResponseToClient } from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedUserPositions } from '@/app/server-handlers/cached/get-user-positions'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { decorateVaultsWithFees } from '@/app/server-handlers/fleet-fees/decorate-vaults-with-fees'
import { mergePositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

// Shared resolution step for the portfolio query units (core data, per-position history) and the
// page metadata. Each caller runs this independently; every call here is cached, so the overlap is
// deduped and the units can resolve in parallel instead of waterfalling. Mirrors the vault-open /
// vault-manage context resolvers.
export const resolvePortfolioContext = async ({ walletAddress }: { walletAddress: string }) => {
  const [userPositions, vaultsList, systemConfig, vaultsInfo] = await Promise.all([
    getCachedUserPositions({ walletAddress }),
    getCachedVaultsList(),
    getCachedConfig(),
    getCachedVaultsInfo(),
  ])

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList([...vaultsList.vaults])

  // Standard vaults decorated for the view (positions carousel + position->vault resolution).
  const vaultsWithConfig = await decorateVaultsWithFees(
    decorateVaultsWithConfig({
      vaults: vaultsList.vaults,
      systemConfig,
      userPositions: userPositionsJsonSafe,
      daoManagedVaultsList,
    }),
  )
  // Kept as a distinct name for the callers that resolve every position to its vault / drive the
  // per-vault history + APY calls. With RWA removed this is the same standard decorated list.
  const allVaultsWithConfig = vaultsWithConfig

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)

  const positionsWithVault = userPositionsJsonSafe.map((position) =>
    mergePositionWithVault({
      position,
      vaultsWithConfig: allVaultsWithConfig,
      vaultsInfo: vaultsInfoParsed,
    }),
  )

  return {
    systemConfig,
    vaultsWithConfig,
    allVaultsWithConfig,
    positionsWithVault,
  }
}
