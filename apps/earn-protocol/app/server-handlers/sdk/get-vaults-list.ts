import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { sdkSupportedChains } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getVaultsList = unstableCache(
  async () => {
    const vaultsListByNetwork = await Promise.all(
      sdkSupportedChains.map((networkId) => {
        const chainInfo = getChainInfoByChainId(networkId)

        return backendSDK.armada.users.getVaultsRaw({
          chainInfo,
        })
      }),
    )

    // flatten the list
    const vaultsFlatList = vaultsListByNetwork.reduce<
      (typeof vaultsListByNetwork)[number]['vaults']
    >((acc, { vaults }) => [...acc, ...vaults], [])

    return {
      vaults: vaultsFlatList,
      callDataTimestamp: Date.now(),
    }
  },
  [],
  {
    revalidate: REVALIDATION_TIMES.VAULTS_LIST,
    tags: [REVALIDATION_TAGS.VAULTS_LIST],
  },
)
