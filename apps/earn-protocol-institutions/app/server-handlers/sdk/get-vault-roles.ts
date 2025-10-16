import { Address, type ChainIds } from '@summerfi/sdk-client'
import { unstable_cache as unstableCache } from 'next/cache'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { vaultSpecificRolesList } from '@/constants/vaults'
import { type InstitutionVaultRole } from '@/types/institution-data'

export const getVaultSpecificRoles: ({
  institutionName,
  vaultAddress,
  chainId,
}: {
  institutionName: string
  vaultAddress: string
  chainId: (typeof ChainIds)[keyof typeof ChainIds]
}) => Promise<InstitutionVaultRole[]> = async ({ institutionName, vaultAddress, chainId }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)

  return await unstableCache(
    async () => {
      const results = await Promise.all(
        vaultSpecificRolesList.map(async ({ role, roleName }) => {
          const contractAddress = Address.createFromEthereum({
            value: vaultAddress,
          })
          const wallets =
            await institutionSDK.armada.accessControl.getAllAddressesWithContractSpecificRole({
              role,
              contractAddress,
              chainId,
            })

          return wallets.map((address) => ({
            address,
            role: roleName,
          }))
        }),
      )

      return results.flat()
    },
    [institutionName],
    { tags: [`institution-vault-roles-${institutionName}-${vaultAddress}-${chainId}`] },
  )()
}
