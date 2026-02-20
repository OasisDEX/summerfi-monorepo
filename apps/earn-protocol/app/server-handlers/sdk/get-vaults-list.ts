import { SupportedNetworkIds } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { GraphQLClient } from 'graphql-request'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { GetVaultsDocument, type GetVaultsQuery } from '@/graphql/clients/test-vault/client'

export const getVaultsListRaw = async () => {
  const vaultsListByNetwork = await Promise.all(
    Object.values(SupportedNetworkIds)
      .filter((networkId): networkId is number => typeof networkId === 'number')
      .map((networkId) =>
        backendSDK.armada.users.getVaultsRaw({
          chainInfo: getChainInfoByChainId(Number(networkId)),
        }),
      ),
  )

  const config = await getCachedConfig()
  const daoManagedVaultsEnabled = !!config.features?.DaoManagedVaults

  if (daoManagedVaultsEnabled) {
    const networkGraphQlClient = new GraphQLClient(
      `https://api.goldsky.com/api/public/project_cmgyeezx300294yp2bgo8cfjo/subgraphs/summer-protocol/1.6.2-deep-cleanup-optimizations-staging/gn`,
    )
    const testVaultData = (await networkGraphQlClient.request<GetVaultsQuery>(
      GetVaultsDocument,
      {},
      {
        origin: 'earn-protocol-app',
      },
    )) as unknown as Awaited<ReturnType<typeof backendSDK.armada.users.getVaultsRaw>>

    return {
      vaults: [...vaultsListByNetwork.flatMap(({ vaults }) => vaults), ...testVaultData.vaults],
      callDataTimestamp: Date.now(),
    }
  }

  return {
    vaults: vaultsListByNetwork.flatMap(({ vaults }) => vaults),
    callDataTimestamp: Date.now(),
  }
}
