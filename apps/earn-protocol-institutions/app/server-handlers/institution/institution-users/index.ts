import {
  CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'

import { validateInstitutionUserSession } from '@/app/server-handlers/institution/validate-user-session'
import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

export const getInstitutionUsers = async (institutionId: string) => {
  'use server'
  await validateInstitutionUserSession(institutionId)
  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
  const region = COGNITO_USER_POOL_REGION

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const cognitoAdminClient = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  try {
    const [dbUsers, cognitoUsers] = await Promise.all([
      db
        .selectFrom('institutionUsers')
        .leftJoin('institutions', 'institutions.id', 'institutionUsers.institutionId')
        .select([
          'institutionUsers.id',
          'institutionUsers.userSub',
          'institutionUsers.institutionId',
          'institutionUsers.role',
          'institutionUsers.id',
          'institutions.name',
          'institutionUsers.createdAt',
          'institutions.displayName as institutionDisplayName',
        ])
        .where('institutions.name', '=', institutionId)
        .execute(),
      await cognitoAdminClient.send(
        new ListUsersInGroupCommand({
          UserPoolId: userPoolId,
          GroupName: 'institution-user',
        }),
      ),
    ])

    // enriched with cognito data
    const users = dbUsers.map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.Users?.find((u) =>
        u.Attributes?.find((a) => a.Name === 'sub' && a.Value === userSub),
      )
      const cognitoEmail = user?.Attributes?.find((a) => a.Name === 'email')?.Value
      const cognitoUserName = user?.Username
      const cognitoName = user?.Attributes?.find((a) => a.Name === 'name')?.Value

      return {
        ...dbUser,
        userSub,
        cognitoEmail,
        cognitoUserName,
        cognitoName,
      }
    })

    return {
      users,
    }
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error fetching users list', error)

    throw new Error('Failed to fetch users list')
  } finally {
    db.destroy()
    cognitoAdminClient.destroy()
  }
}

export const getInstitutionUser = async (institutionId: string, userId: string) => {
  'use server'
  await validateInstitutionUserSession(institutionId)
  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
  const region = COGNITO_USER_POOL_REGION

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const cognitoAdminClient = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  try {
    const [dbUsers, cognitoUsers] = await Promise.all([
      db
        .selectFrom('institutionUsers')
        .leftJoin('institutions', 'institutions.id', 'institutionUsers.institutionId')
        .select([
          'institutionUsers.id',
          'institutionUsers.userSub',
          'institutionUsers.institutionId',
          'institutionUsers.role',
          'institutionUsers.id',
          'institutions.name',
          'institutionUsers.createdAt',
          'institutions.displayName as institutionDisplayName',
        ])
        .where('institutions.name', '=', institutionId)
        .where('institutionUsers.id', '=', Number(userId))
        .executeTakeFirst(),
      await cognitoAdminClient.send(
        new ListUsersInGroupCommand({
          UserPoolId: userPoolId,
          GroupName: 'institution-user',
        }),
      ),
    ])

    if (!dbUsers) {
      throw new Error('User not found')
    }

    // enriched with cognito data
    const users = [dbUsers].map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.Users?.find((u) =>
        u.Attributes?.find((a) => a.Name === 'sub' && a.Value === userSub),
      )
      const cognitoEmail = user?.Attributes?.find((a) => a.Name === 'email')?.Value
      const cognitoUserName = user?.Username
      const cognitoName = user?.Attributes?.find((a) => a.Name === 'name')?.Value

      return {
        ...dbUser,
        userSub,
        cognitoEmail,
        cognitoUserName,
        cognitoName,
      }
    })

    return {
      user: users[0],
    }
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error fetching user', error)

    throw new Error('Failed to fetch user')
  } finally {
    db.destroy()
    cognitoAdminClient.destroy()
  }
}

export const addInstitutionUser = async (institutionId: string, userData: any) => {}

export const updateInstitutionUser = async (
  institutionId: string,
  userId: string,
  userData: any,
) => {}

export const removeInstitutionUser = async (institutionId: string, userId: string) => {}
