import { REVALIDATION_TAGS, REVALIDATION_TIMES, rewardsDailyEmmission } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, SupportedNetworkIds } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

const getVaultsListRaw = async () => {
  const vaultsListByNetwork = await Promise.all(
    Object.values(SupportedNetworkIds)
      .filter((networkId): networkId is number => typeof networkId === 'number')
      .map((networkId) =>
        backendSDK.armada.users.getVaultsRaw({
          chainInfo: getChainInfoByChainId(Number(networkId)),
        }),
      ),
  )

  return {
    vaults: vaultsListByNetwork
      .flatMap(({ vaults }) => vaults)
      // TEMPORARY FIX FOR REWARDS EMISSIONS
      .map((vault) => {
        const rewardTokenEmissionsAmount = rewardsDailyEmmission.find(
          (reward) => reward.id === vault.id && reward.chainId === vault.protocol.network,
        )?.dailyEmmission

        return {
          ...vault,
          rewardTokenEmissionsAmount: [rewardTokenEmissionsAmount],
          // eslint-disable-next-line no-mixed-operators
          rewardTokenEmissionsFinish: [new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).getTime()], // infinite offset by 1 day
        }
      }) as unknown as SDKVaultishType[],
    callDataTimestamp: Date.now(),
  }
}

export const getVaultsList = unstableCache(getVaultsListRaw, [], {
  revalidate: REVALIDATION_TIMES.VAULTS_LIST,
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
