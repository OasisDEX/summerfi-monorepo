import { Address, type ChainId, ContractSpecificRoleName } from '@summerfi/sdk-client'
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
}) => Promise<string[]> = async ({ institutionName, vaultAddress, chainId }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)

  return await unstableCache(
    async () => {
      const results = await Promise.all(
        [
          {
            role: ContractSpecificRoleName.WHITELISTED_ROLE,
          },
        ].map(async ({ role }) => {
          const contractAddress = Address.createFromEthereum({
            value: vaultAddress,
          })
          const wallets =
            await institutionSDK.armada.accessControl.getAllAddressesWithContractSpecificRole({
              role,
              contractAddress,
              chainId,
            })

          return wallets
        }),
      )

      return results.flat()
    },
    [institutionName, vaultAddress, String(chainId)],
    { tags: [`institution-vault-whitelist-${institutionName}-${vaultAddress}-${chainId}`] },
  )()
}
