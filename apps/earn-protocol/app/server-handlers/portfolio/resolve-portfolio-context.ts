import { type IArmadaPosition } from '@summerfi/app-types'
import {
  parseServerResponseToClient,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedRwaUserPositions } from '@/app/server-handlers/cached/get-rwa-user-positions'
import { getCachedRwaVaultsInfo } from '@/app/server-handlers/cached/get-rwa-vaults-info'
import { getCachedRwaVaultsList } from '@/app/server-handlers/cached/get-rwa-vaults-list'
import { getCachedUserPositions } from '@/app/server-handlers/cached/get-user-positions'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { mergePositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

// Shared resolution step for the portfolio query units (core data, per-position history) and the
// page metadata. Each caller runs this independently; every call here is cached, so the overlap is
// deduped and the units can resolve in parallel instead of waterfalling. Mirrors the vault-open /
// vault-manage context resolvers.
export const resolvePortfolioContext = async ({ walletAddress }: { walletAddress: string }) => {
  const [
    userPositions,
    vaultsList,
    systemConfig,
    vaultsInfo,
    rwaUserPositions,
    rwaVaultsList,
    rwaVaultsInfo,
  ] = await Promise.all([
    getCachedUserPositions({ walletAddress }),
    getCachedVaultsList(),
    getCachedConfig(),
    getCachedVaultsInfo(),
    // RWA (rounds-based) positions/vaults live in the institutional subgraph and are read via the
    // insti SDK. They're additive to the portfolio and degrade gracefully if unavailable.
    getCachedRwaUserPositions({ walletAddress }),
    getCachedRwaVaultsList(),
    getCachedRwaVaultsInfo(),
  ])

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []
  const rwaUserPositionsJsonSafe = rwaUserPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(rwaUserPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList([
    ...vaultsList.vaults,
    ...rwaVaultsList.vaults,
  ])

  // Standard vaults decorated for the view (positions carousel + DCA lookups). RWA vaults are
  // permissioned, so they intentionally stay out of the "you might like" surfaces.
  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
    daoManagedVaultsList,
  })

  // Combined list (standard + RWA), used only to resolve each position to its vault and to drive
  // the per-vault history/APY calls. RWA positions carry their own (RWA) vault into the view.
  const allVaultsWithConfig = decorateVaultsWithConfig({
    vaults: [...vaultsList.vaults, ...rwaVaultsList.vaults],
    systemConfig,
    userPositions: [...userPositionsJsonSafe, ...rwaUserPositionsJsonSafe],
    daoManagedVaultsList,
  })

  // Source of truth for which fleets are RWA: the RWA vaults list (their ids are the fleet
  // addresses). decorateWithFleetConfig keys the fleet config by vault id and can miss the RWA flag
  // for list-sourced vaults, so we match on these addresses directly instead of relying on
  // isRwaVault — this drives both the pending-receipts fetch and the RWA pill on position rows.
  const rwaFleetAddresses = new Set(rwaVaultsList.vaults.map((vault) => vault.id.toLowerCase()))

  const rwaVaultsWithConfig = allVaultsWithConfig.filter((vault) =>
    rwaFleetAddresses.has(vault.id.toLowerCase()),
  )

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)
  // IRwaVaultInfo is a structural clone of IArmadaVaultInfo (differs only by the `type` discriminant
  // and a brand symbol that the JSON round-trip above strips), and findVaultInfo matches by id — so
  // it's safe to treat RWA vault info as IArmadaVaultInfo for the portfolio's position->info lookup.
  const rwaVaultsInfoParsed = parseServerResponseToClient(rwaVaultsInfo)
    .vaults as unknown as IArmadaVaultInfo[]
  const allVaultsInfo = [...vaultsInfoParsed, ...rwaVaultsInfoParsed]

  // Defensive: only keep RWA positions whose vault resolved in the combined list, so a stray
  // position (e.g. a delisted RWA vault) can't make mergePositionWithVault throw and crash the page.
  const resolvableRwaPositions = rwaUserPositionsJsonSafe.filter((position) =>
    allVaultsWithConfig.some(
      (vault) =>
        vault.id.toLowerCase() === position.pool.id.fleetAddress.value.toLowerCase() &&
        subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)) ===
          position.id.user.chainInfo.chainId,
    ),
  )

  const allUserPositions = [...userPositionsJsonSafe, ...resolvableRwaPositions]

  const positionsWithVault = allUserPositions.map((position) => {
    const merged = mergePositionWithVault({
      position,
      vaultsWithConfig: allVaultsWithConfig,
      vaultsInfo: allVaultsInfo,
    })

    // Guarantee RWA positions are flagged so the "RWA" pill renders, even when the fleet-config
    // decoration didn't set isRwaVault on this vault instance.
    return rwaFleetAddresses.has(merged.vault.id.toLowerCase())
      ? { ...merged, vault: { ...merged.vault, isRwaVault: true } }
      : merged
  })

  return {
    systemConfig,
    vaultsWithConfig,
    allVaultsWithConfig,
    rwaVaultsWithConfig,
    rwaFleetAddresses,
    positionsWithVault,
  }
}
