import { rewardsDailyEmmission } from '@summerfi/app-earn-ui'
import { type SDKVaultType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
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

    // TEMPORARY FIX FOR REWARDS EMISSIONS
    const rewardTokenEmissionsAmount = rewardsDailyEmmission.find(
      (reward) => reward.id === vault?.id,
    )?.dailyEmmission

    return {
      ...vault,
      rewardTokenEmissionsAmount: [rewardTokenEmissionsAmount],
      // eslint-disable-next-line no-mixed-operators
      rewardTokenEmissionsFinish: [new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).getTime()], // infinite offset by 1 day
    } as unknown as SDKVaultType | undefined
  } catch (error) {
    return serverOnlyErrorHandler(
      'getVaultDetails',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
