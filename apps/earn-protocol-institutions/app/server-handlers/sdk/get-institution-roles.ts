import { ChainIds, GlobalRoles } from '@summerfi/sdk-client'
import { unstable_cache as unstableCache } from 'next/cache'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

const rolesList = Object.values(GlobalRoles)

export const getInstitutionRoles: ({ institutionName }: { institutionName: string }) => Promise<{
  [role in GlobalRoles]: { wallets: string[] }
}> = async ({ institutionName }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)

  return await unstableCache(
    async () => {
      return Object.assign(
        {},
        ...(
          await Promise.all(
            rolesList.map(async (role) => {
              const wallets =
                await institutionSDK.armada.accessControl.getAllAddressesWithGeneralRole({
                  role,
                  chainId: ChainIds.Base,
                })

              return [
                {
                  [role]: {
                    wallets,
                  },
                },
              ]
            }),
          )
        ).flat(),
      )
    },
    [institutionName],
    { tags: [`institution-roles-${institutionName}`] },
  )()
}
