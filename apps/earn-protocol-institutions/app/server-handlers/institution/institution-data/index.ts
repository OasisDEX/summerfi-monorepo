import { ChainIds, GlobalRoles } from '@summerfi/sdk-client'
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import { unstable_cache as unstableCache } from 'next/cache'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { institutionsAdminPanelGetLogoSrc } from '@/features/admin/helpers'

const rolesList = Object.values(GlobalRoles)

// region fetchers
const getInstitutionData = async ({ institutionName }: { institutionName: string }) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const institution = await db
      .selectFrom('institutions')
      .select(['id', 'name', 'displayName', 'logoFile', 'logoUrl'])
      .where('name', '=', institutionName)
      .executeTakeFirst()

    if (!institution) return null

    return {
      ...institution,
      logoFile: institution.logoFile
        ? (institutionsAdminPanelGetLogoSrc(institution.logoFile) as string)
        : undefined,
    }
  } finally {
    db.destroy()
  }
}

const getUserInstitutionsList = async ({ userSub }: { userSub: string }) => {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const institutionsList = await db
      .selectFrom('institutionUsers as iu')
      .innerJoin('institutions as i', 'i.id', 'iu.institutionId')
      .select(['i.id as id', 'i.name as name', 'i.displayName as displayName'])
      .where('iu.userSub', '=', userSub)
      .execute()

    return institutionsList
  } finally {
    db.destroy()
  }
}

const getInstitutionRoles: ({ institutionName }: { institutionName: string }) => Promise<{
  [role in GlobalRoles]: { wallets: string[] }
}> = async ({ institutionName }) => {
  const institutionSDK = getInstitutionsSDK(institutionName)

  return Object.assign(
    {},
    ...(
      await Promise.all(
        rolesList.map(async (role) => {
          const wallets = await institutionSDK.armada.accessControl.getAllAddressesWithGlobalRole({
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
}

// endregion

// region cached calls

export const getCachedInstitutionData = ({ institutionName }: { institutionName: string }) => {
  return unstableCache(getInstitutionData, ['institution-data', institutionName], {
    revalidate: 300,
    tags: [`institution-data-${institutionName.toLowerCase()}`],
  })({ institutionName })
}

export const getCachedUserInstitutionsList = ({ userSub }: { userSub: string }) => {
  return unstableCache(getUserInstitutionsList, ['user-institutions-list', userSub], {
    revalidate: 300,
    tags: [`user-data-${userSub}`, `user-institutions-list-${userSub}`],
  })({ userSub })
}

export const getCachedInstitutionRoles = ({ institutionName }: { institutionName: string }) => {
  return unstableCache(getInstitutionRoles, ['institution-roles', institutionName], {
    revalidate: 300,
    tags: ['institution-roles', `institution-data-${institutionName.toLowerCase()}`],
  })({ institutionName })
}
