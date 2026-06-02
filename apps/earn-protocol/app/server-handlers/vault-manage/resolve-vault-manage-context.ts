import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedRwaVaultDetails } from '@/app/server-handlers/cached/get-rwa-vault-details'
import { getCachedRwaVaultsList } from '@/app/server-handlers/cached/get-rwa-vaults-list'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import {
  decorateVaultsWithConfig,
  getVaultCuratedBy,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

// Shared resolution step for the vault-manage query units. The core + per-section handlers each
// run this independently (mirroring how the two vaults-list handlers both call getCachedConfig);
// every call here is cached, so the overlap is deduped. `withPosition` is false for the lazy
// sections that don't need the user position (yield chart, exposure, activity, curation), so they
// skip the uncached getUserPosition SDK call.
export const resolveVaultManageContext = async ({
  network,
  vaultId,
  walletAddress,
  withPosition = true,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
  withPosition?: boolean
}) => {
  const configRaw = await getCachedConfig()
  const systemConfig = parseServerResponseToClient(configRaw)
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)

  // Preserved verbatim from the original page resolution logic.
  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  // RWA (rounds-based) vaults live in a separate subgraph, so they must be resolved through the RWA
  // detail/list handlers (mirroring resolveVaultOpenContext) — otherwise the standard handlers
  // return nothing and the page reports "no such vault".
  const isRwaVault = !!getVaultCuratedBy(parsedVaultId ?? '', parsedNetworkId, systemConfig)

  if (!parsedVaultId || !isAddress(walletAddress)) {
    return {
      systemConfig,
      parsedNetwork,
      parsedNetworkId,
      parsedVaultId,
      isRwaVault,
      vault: null,
      position: null,
      vaultWithConfig: null,
      allVaultsWithConfig: [],
    }
  }

  const [vault, { vaults }, { vaults: rwaVaults }, position] = await Promise.all([
    (isRwaVault ? getCachedRwaVaultDetails : getCachedVaultDetails)({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getCachedVaultsList(),
    isRwaVault ? getCachedRwaVaultsList() : Promise.resolve({ vaults: [] }),
    withPosition
      ? getUserPosition({
          vaultAddress: parsedVaultId,
          network: parsedNetwork,
          walletAddress,
          isRwaVault,
        })
      : Promise.resolve(null),
  ])

  const allVaults = [...vaults, ...rwaVaults]

  // For RWA vaults a user only holds a Fleet position (shares) after the round settles and they
  // claim; until then they hold receipts and have no position. So we do not bail on a missing
  // position for RWA — the page decides whether to show the position or the deposit view.
  if (!vault || (withPosition && !position && !isRwaVault)) {
    return {
      systemConfig,
      parsedNetwork,
      parsedNetworkId,
      parsedVaultId,
      isRwaVault,
      vault: vault ?? null,
      position: position ?? null,
      vaultWithConfig: null,
      allVaultsWithConfig: [],
    }
  }

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(allVaults)

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
    userPositions: position ? [position] : undefined,
    daoManagedVaultsList,
  })

  const allVaultsWithConfig = decorateVaultsWithConfig({
    vaults: allVaults,
    systemConfig,
    daoManagedVaultsList,
  })

  return {
    systemConfig,
    parsedNetwork,
    parsedNetworkId,
    parsedVaultId,
    isRwaVault,
    vault,
    position,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    vaultWithConfig: vaultWithConfig ?? null,
    allVaultsWithConfig,
  }
}
