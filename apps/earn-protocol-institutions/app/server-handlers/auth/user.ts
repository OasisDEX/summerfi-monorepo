import {
  getSummerProtocolInstitutionDB,
  type UserRole,
} from '@summerfi/summer-protocol-institutions-db'

import { type SignInResponse } from '@/features/auth/types'

export async function getEnrichedUser(params: {
  sub: string
  email: string
  name: string
}): Promise<SignInResponse['user']> {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const globalAdmin = await db
      .selectFrom('globalAdmins')
      .select(['userSub'])
      .where('userSub', '=', params.sub)
      .executeTakeFirst()

    if (globalAdmin) {
      return {
        id: params.sub,
        email: params.email,
        name: params.name,
        isGlobalAdmin: true,
      }
    }

    const userInstitutions = await db
      .selectFrom('institutionUsers')
      .innerJoin('institutions', 'institutions.id', 'institutionUsers.institutionId')
      .select([
        'institutionUsers.role',
        'institutionUsers.institutionId',
        'institutions.name as institutionName',
        'institutions.displayName as institutionDisplayName',
      ])
      .where('institutionUsers.userSub', '=', params.sub)
      .execute()

    if (userInstitutions.length === 0) {
      throw new Error('User does not have any institution roles')
    }

    return {
      id: params.sub,
      email: params.email,
      name: params.name,
      isGlobalAdmin: false,
      institutionsList: userInstitutions.map((inst) => ({
        id: inst.institutionId,
        name: inst.institutionName,
        displayName: inst.institutionDisplayName,
        role: inst.role as UserRole,
      })),
    }
  } finally {
    db.destroy()
  }
}
