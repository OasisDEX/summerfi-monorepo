import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { sdkSupportedChains } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

const getVaultsListRaw = async () => {
  const vaultsListByNetwork = await Promise.all(
    sdkSupportedChains.map((networkId) =>
      backendSDK.armada.users.getVaultsRaw({
        chainInfo: getChainInfoByChainId(networkId),
      }),
    ),
  )

  return {
    vaults: vaultsListByNetwork.flatMap(({ vaults }) => vaults),
    callDataTimestamp: Date.now(),
  }
}

export const getVaultsList = unstableCache(getVaultsListRaw, [], {
  revalidate: REVALIDATION_TIMES.VAULTS_LIST,
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
