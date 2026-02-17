import { type SDKVaultType, SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { getTestVaultData } from '@/app/server-handlers/sdk/get-test-vault-data'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getVaultDetails({
  vaultAddress,
  network,
}: {
  vaultAddress?: string
  network: SupportedSDKNetworks
}) {
  try {
    if (!vaultAddress) {
      return undefined
    }

    if (
      // testing vaults:
      // 0x48d047532191479852c1f1903cb83700c42a3b8f
      // 0x218f3255fa97a60bf99f175c9c5c56fdf06b15fc
      ['0x48d047532191479852c1f1903cb83700c42a3b8f', '0x218f3255fa97a60bf99f175c9c5c56fdf06b15fc']
        .map((addr) => addr.toLowerCase())
        .includes(vaultAddress.toLowerCase()) &&
      network === SupportedSDKNetworks.Mainnet
    ) {
      return await getTestVaultData(vaultAddress)
    }

    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)

    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const { vault } = await backendSDK.armada.users.getVaultRaw({
      vaultId: poolId,
    })

    return vault as SDKVaultType | undefined
  } catch (error) {
    return serverOnlyErrorHandler(
      'getVaultDetails',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
