'use server'

import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  type UserType,
} from '@aws-sdk/client-cognito-identity-provider'
import {
  getSummerProtocolInstitutionDB,
  type UserRole,
} from '@summerfi/summer-protocol-institutions-db'
import { revalidatePath } from 'next/cache'

import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

type CognitoAttrContainer = {
  Attributes?: { Name?: string; Value?: string }[]
  UserAttributes?: { Name?: string; Value?: string }[]
}

// Helper to extract an attribute value by name
const getAttr = (u: CognitoAttrContainer | undefined, key: string) => {
  const list = u?.Attributes ?? u?.UserAttributes

  return Array.isArray(list) ? list.find((a) => a.Name === key)?.Value : undefined
}

// Slugify helper for username base
const slugifyName = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 50) || 'user'

export async function createUser(formData: FormData) {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  const fullName = String(formData.get('name') ?? '').trim()

  const roleRaw = formData.get('role')
  const institutionIdRaw = formData.get('institutionId')

  if (!email || !fullName) return

  const institutionId = Number(institutionIdRaw)
  const role = roleRaw ? (String(roleRaw) as UserRole) : null

  if (!Number.isFinite(institutionId)) return

  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
  const region = COGNITO_USER_POOL_REGION

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const cognitoClient = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  // 1) Find existing user by email
  const found = await cognitoClient.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
      Limit: 1,
    }),
  )

  let username: string | undefined
  let sub: string | undefined

  if (found.Users && found.Users.length > 0) {
    username = found.Users[0]?.Username
    sub = getAttr(found.Users[0] as UserType, 'sub')
  } else {
    // 2) Create user if not exists. Username cannot be an email when email alias is enabled.
    const base = slugifyName(fullName)
    const generatedUsername = `${base}-${Math.random().toString(36).slice(2, 8)}`

    const created = await cognitoClient.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: generatedUsername,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: fullName },
          { Name: 'email_verified', Value: 'true' },
          // { Name: 'preferred_username', Value: generatedUsername },
        ],
      }),
    )

    username = created.User?.Username ?? generatedUsername

    // Retrieve attributes to get sub
    const createdFetch = await cognitoClient.send(
      new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }),
    )

    sub = getAttr(createdFetch as CognitoAttrContainer, 'sub')
  }

  // 2b) Ensure we have sub
  if (!sub && username) {
    const fetched = await cognitoClient.send(
      new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }),
    )

    sub = getAttr(fetched as CognitoAttrContainer, 'sub')
  }

  if (!sub) throw new Error('Failed to resolve Cognito user sub')

  // Optionally map role to a Cognito group
  if (role && username) {
    try {
      await cognitoClient.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: username,
          GroupName: String(role),
        }),
      )
    } catch {
      // ignore group assignment errors
    }
  }

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    await db.insertInto('institutionUsers').values({ userSub: sub, institutionId, role }).execute()

    revalidatePath('/admin/users')
  } finally {
    db.destroy()
    cognitoClient.destroy()
  }
}

export async function getUsersList() {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const [users, institutions] = await Promise.all([
    db
      .selectFrom('institutionUsers')
      .leftJoin('institutions', 'institutions.id', 'institutionUsers.institutionId')
      .select([
        'institutionUsers.id',
        'institutionUsers.userSub',
        'institutionUsers.institutionId',
        'institutionUsers.role',
        'institutionUsers.createdAt',
        'institutions.displayName as institutionDisplayName',
      ])
      .execute(),
    db.selectFrom('institutions').select(['id', 'displayName']).execute(),
  ])

  db.destroy()

  return {
    users,
    institutions,
  }
}
