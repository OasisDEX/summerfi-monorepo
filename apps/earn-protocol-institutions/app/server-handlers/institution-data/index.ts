import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'

export const getInstitutionData = async (institutionName: string) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const institutionData = await db
      .selectFrom('institutions')
      .select(['id', 'name', 'displayName'])
      .where('name', '=', institutionName)
      .executeTakeFirst()

    return institutionData
  } finally {
    db.destroy()
  }
}

export const getUserInstitutionsList = async (userSub: string) => {
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
