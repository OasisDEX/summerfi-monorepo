import { type SDKVaultishType } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

import { GetVaultDocument, type GetVaultQuery } from '@/graphql/clients/test-vault/client'

export const getTestVaultData: (testVaultId: string) => Promise<SDKVaultishType> = async (
  testVaultId,
) => {
  // Only for that one, mainnet testing vault
  const networkGraphQlClient = new GraphQLClient(
    `https://api.goldsky.com/api/public/project_cmgyeezx300294yp2bgo8cfjo/subgraphs/summer-protocol/1.6.2-deep-cleanup-optimizations-staging/gn`,
  )
  const vaultData = await networkGraphQlClient.request<GetVaultQuery>(
    GetVaultDocument,
    {
      id: testVaultId,
    },
    {
      origin: 'earn-protocol-app',
    },
  )

  if (!vaultData.vault) {
    throw new Error('Test vault data not found')
  }

  return vaultData.vault as unknown as SDKVaultishType
}
