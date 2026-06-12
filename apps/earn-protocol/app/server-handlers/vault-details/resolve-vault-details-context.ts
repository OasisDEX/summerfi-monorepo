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
import { decorateVaultsWithFees } from '@/app/server-handlers/fleet-fees/decorate-vaults-with-fees'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

// Shared resolution step for both vault-details query units. The core and content handlers each
// run this independently (mirroring how the two vaults-list handlers both call getCachedConfig);
// every call here is cached, so the overlap is deduped and the two units can prefetch in parallel
// instead of waterfalling like the old page did.
export const resolveVaultDetailsContext = async ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}) => {
  const configRaw = await getCachedConfig()
  const systemConfig = parseServerResponseToClient(configRaw)
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)

  // Preserved verbatim from the original page resolution logic.
  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    return {
      systemConfig,
      parsedNetwork,
      parsedNetworkId,
      parsedVaultId,
      vault: null,
      vaultWithConfig: null,
      allVaultsWithConfig: [],
    }
  }

  const [vault, { vaults }] = await Promise.all([
    getCachedVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getCachedVaultsList(),
  ])

  if (!vault) {
    return {
      systemConfig,
      parsedNetwork,
      parsedNetworkId,
      parsedVaultId,
      vault: null,
      vaultWithConfig: null,
      allVaultsWithConfig: [],
    }
  }

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const [[vaultWithConfig], allVaultsWithConfig] = await Promise.all([
    decorateVaultsWithFees(
      decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
        daoManagedVaultsList,
      }),
    ),
    decorateVaultsWithFees(
      decorateVaultsWithConfig({
        vaults,
        systemConfig,
        daoManagedVaultsList,
      }),
    ),
  ])

  return {
    systemConfig,
    parsedNetwork,
    parsedNetworkId,
    parsedVaultId,
    vault,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    vaultWithConfig: vaultWithConfig ?? null,
    allVaultsWithConfig,
  }
}
