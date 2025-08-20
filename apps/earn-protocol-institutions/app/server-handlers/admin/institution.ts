import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

// Server Action: create institution
export async function createInstitution(formData: FormData) {
  'use server'

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const institutionName = formData.get('name')
    const displayName = formData.get('displayName')
    const logoUrl = formData.get('logoUrl')
    const logoFileInput = formData.get('logoFile') as File | null

    if (
      typeof institutionName !== 'string' ||
      !institutionName.trim() ||
      typeof displayName !== 'string' ||
      !displayName.trim()
    ) {
      throw new Error('Name and displayName are required')
    }

    let logoFile: Buffer | null = null

    if (
      logoFileInput &&
      typeof logoFileInput.arrayBuffer === 'function' &&
      logoFileInput.size > 0
    ) {
      const buf = await logoFileInput.arrayBuffer()

      logoFile = Buffer.from(buf)
    }

    // If your DB sets createdAt automatically, you can omit it here.
    await db
      .insertInto('institutions')
      .values({
        name: institutionName.trim(),
        displayName: displayName.trim(),
        logoUrl: typeof logoUrl === 'string' ? logoUrl.trim() : '',
        logoFile,
      })
      .execute()
  } finally {
    db.destroy()
  }
}

// Server Action: update institution
export async function updateInstitution(formData: FormData) {
  'use server'

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const institutionId = formData.get('id')
    const institutionName = formData.get('name')
    const displayName = formData.get('displayName')
    const logoUrl = formData.get('logoUrl')
    const logoFileInput = formData.get('logoFile') as File | null

    if (
      typeof institutionId !== 'string' ||
      isNaN(Number(institutionId)) ||
      typeof institutionName !== 'string' ||
      !institutionName.trim() ||
      typeof displayName !== 'string' ||
      !displayName.trim()
    ) {
      throw new Error('id, name and displayName are required')
    }

    let logoFile: Buffer | null = null

    if (
      logoFileInput &&
      typeof logoFileInput.arrayBuffer === 'function' &&
      logoFileInput.size > 0
    ) {
      const buf = await logoFileInput.arrayBuffer()

      logoFile = Buffer.from(buf)
    }

    await db
      .updateTable('institutions')
      .set({
        name: institutionName.trim(),
        displayName: displayName.trim(),
        logoUrl: typeof logoUrl === 'string' ? logoUrl.trim() : '',
        logoFile: logoFile ? logoFile : undefined,
      })
      .where('id', '=', Number(institutionId))
      .execute()
  } finally {
    db.destroy()
    revalidateTag('getInstitutionsList')
    redirect('/admin/institutions')
  }
}

// [internal] Server Action: delete cognito user
async function deleteCognitoUser(userSub: string) {
  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
  const region = COGNITO_USER_POOL_REGION

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const cognitoAdminClient = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const userData = await cognitoAdminClient.send(
    new ListUsersCommand({ UserPoolId: userPoolId, Filter: `sub = "${userSub}"`, Limit: 1 }),
  )

  if (!userData.Users || userData.Users.length === 0) {
    throw new Error(`User with sub ${userSub} not found`)
  }

  const userDeletionQuery = await cognitoAdminClient.send(
    new AdminDeleteUserCommand({ UserPoolId: userPoolId, Username: userData.Users[0].Username }),
  )

  return userDeletionQuery
}

// Server Action: delete institution and associated users
export async function deleteInstitution(formData: FormData) {
  'use server'

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })
  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
  const region = COGNITO_USER_POOL_REGION

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const cognitoAdminClient = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  try {
    const institutionId = formData.get('id')

    if (typeof institutionId !== 'string' || isNaN(Number(institutionId))) {
      throw new Error('id is required')
    }
    const parsedInstitutionId = Number(institutionId)

    const institutionUsers = await db
      .selectFrom('institutionUsers')
      .selectAll()
      .where('institutionId', '=', parsedInstitutionId)
      .execute()

    const [deleteInstitutionResult, deleteInstitutionUsersResult, ...cognitoDeleteUserResults] =
      await Promise.all([
        db.deleteFrom('institutions').where('id', '=', parsedInstitutionId).execute(),
        db
          .deleteFrom('institutionUsers')
          .where('institutionId', '=', parsedInstitutionId)
          .execute(),
        ...institutionUsers.map((user) => deleteCognitoUser(user.userSub)),
      ])

    // eslint-disable-next-line no-console
    console.log(
      // Log the results of the deletion
      'Institution deleted',
      JSON.stringify(
        {
          deleteInstitutionResult,
          deleteInstitutionUsersResult,
          cognitoDeleteUserResults,
        },
        (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    )
  } finally {
    db.destroy()
    cognitoAdminClient.destroy()
    revalidateTag('getInstitutionsList')
    redirect('/admin/institutions')
  }
}

export async function getInstitutionsList() {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const institutions = await db.selectFrom('institutions').selectAll().execute()
  const institutionsUsers = await db.selectFrom('institutionUsers').selectAll().execute()

  db.destroy()

  return institutions.map((institution) => {
    const users = institutionsUsers.filter((user) => user.institutionId === institution.id)

    return {
      ...institution,
      users,
    }
  })
}

export async function getInstitutionData(institutionDbId: number) {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const institution = await db
    .selectFrom('institutions')
    .selectAll()
    .where('id', '=', institutionDbId)
    .executeTakeFirst()

  db.destroy()

  return institution
}
