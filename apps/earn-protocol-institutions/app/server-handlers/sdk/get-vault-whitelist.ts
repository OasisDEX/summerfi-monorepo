import { type ChainId, GraphRoleName, type Role } from '@summerfi/sdk-client'
import { unstable_cache as unstableCache } from 'next/cache'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

export const getVaultWhitelist: ({
  institutionName,
  vaultAddress,
  chainId,
}: {
  institutionName: string
  vaultAddress: string
  chainId: ChainId
}) => Promise<Role[]> = async ({ institutionName, vaultAddress, chainId }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)

  return await unstableCache(
    async () => {
      const { roles } = await institutionSDK.armada.accessControl.getAllRoles({
        chainId,
        targetContract: vaultAddress as `0x${string}`,
        name: GraphRoleName.WHITELIST_ROLE,
      })

      return roles
    },
    [institutionName, vaultAddress, String(chainId)],
    { tags: [`institution-vault-whitelist-${institutionName}-${vaultAddress}-${chainId}`] },
  )()
}
