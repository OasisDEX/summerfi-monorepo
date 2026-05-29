import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import {
  decorateVaultsWithConfig,
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

  if (!parsedVaultId || !isAddress(walletAddress)) {
    return {
      systemConfig,
      parsedNetwork,
      parsedNetworkId,
      parsedVaultId,
      vault: null,
      position: null,
      vaultWithConfig: null,
      allVaultsWithConfig: [],
    }
  }

  const [vault, { vaults }, position] = await Promise.all([
    getCachedVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getCachedVaultsList(),
    withPosition
      ? getUserPosition({
          vaultAddress: parsedVaultId,
          network: parsedNetwork,
          walletAddress,
        })
      : Promise.resolve(null),
  ])

  if (!vault || (withPosition && !position)) {
    return {
      systemConfig,
      parsedNetwork,
      parsedNetworkId,
      parsedVaultId,
      vault: vault ?? null,
      position: position ?? null,
      vaultWithConfig: null,
      allVaultsWithConfig: [],
    }
  }

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
    userPositions: position ? [position] : undefined,
    daoManagedVaultsList,
  })

  const allVaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
    daoManagedVaultsList,
  })

  return {
    systemConfig,
    parsedNetwork,
    parsedNetworkId,
    parsedVaultId,
    vault,
    position,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    vaultWithConfig: vaultWithConfig ?? null,
    allVaultsWithConfig,
  }
}
