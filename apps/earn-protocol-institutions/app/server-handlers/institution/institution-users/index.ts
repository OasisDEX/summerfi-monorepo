import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { slugify } from '@summerfi/app-utils'
import { type GlobalRoles } from '@summerfi/sdk-common'
import {
  getSummerProtocolInstitutionDB,
  type UserRole,
} from '@summerfi/summer-protocol-institutions-db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCachedInstitutionRoles } from '@/app/server-handlers/institution/institution-data'
import { getAllUsersInGroup } from '@/app/server-handlers/institution/institution-users/helpers'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'
import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

// this is just a simple helper function to extract user attributes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAttr = (u: any | undefined, key: string) => {
  const list = u?.Attributes ?? u?.UserAttributes

  return Array.isArray(list) ? list.find((a) => a.Name === key)?.Value : undefined
}

export const getInstitutionUsers = async (institutionName: string) => {
  'use server'
  await validateInstitutionUserSession({ institutionName })
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
        .where('institutions.name', '=', institutionName)
        .execute(),
      await getAllUsersInGroup(cognitoAdminClient, userPoolId, 'institution-user'),
    ])

    // enriched with cognito data
    const users = dbUsers.map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.find((u) =>
        u.Attributes?.find((a) => a.Name === 'sub' && a.Value === userSub),
      )

      if (!user) {
        // eslint-disable-next-line no-console
        console.log(
          `Warning: Cognito user with sub ${userSub} not found for institution ${institutionName}`,
        )
      }
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

export const getInstitutionUser = async (institutionName: string, userId: string) => {
  'use server'
  await validateInstitutionUserSession({ institutionName })
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
        .where('institutions.name', '=', institutionName)
        .where('institutionUsers.id', '=', Number(userId))
        .executeTakeFirst(),
      await getAllUsersInGroup(cognitoAdminClient, userPoolId, 'institution-user'),
    ])

    if (!dbUsers) {
      throw new Error('User not found')
    }

    // enriched with cognito data
    const users = [dbUsers].map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.find((u) =>
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

export const addInstitutionUser = async (_prevState: unknown, formData: FormData) => {
  'use server'

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  const fullName = String(formData.get('name') ?? '').trim()
  const roleRaw = formData.get('role')
  const institutionName = formData.get('institutionName') as string

  if (!email || !fullName || !institutionName) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    await validateInstitutionUserSession({ institutionName })

    const role = roleRaw ? (String(roleRaw) as UserRole) : null
    // ...existing code...

    const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
    const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
    const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
    const region = COGNITO_USER_POOL_REGION

    if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
    if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

    const cognitoClient = new CognitoIdentityProviderClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    // ...existing cognito logic...
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
      sub = getAttr(found.Users[0], 'sub')
    } else {
      const base = slugify(fullName)
      const generatedUsername = `${base}-${Math.random().toString(36).slice(2, 8)}`

      const created = await cognitoClient.send(
        new AdminCreateUserCommand({
          UserPoolId: userPoolId,
          Username: generatedUsername,
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'name', Value: fullName },
            { Name: 'email_verified', Value: 'true' },
          ],
        }),
      )

      await cognitoClient
        .send(
          new AdminAddUserToGroupCommand({
            UserPoolId: userPoolId,
            Username: generatedUsername,
            GroupName: 'institution-user',
          }),
        )
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error adding user to group institution-user', error)
        })

      username = created.User?.Username ?? generatedUsername

      const createdFetch = await cognitoClient.send(
        new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }),
      )

      sub = getAttr(createdFetch, 'sub')
    }

    if (!sub && username) {
      const fetched = await cognitoClient.send(
        new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }),
      )

      sub = getAttr(fetched, 'sub')
    }

    if (!sub) throw new Error('Failed to resolve Cognito user sub')

    const { db } = await getSummerProtocolInstitutionDB({
      connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
    })

    try {
      const institutionId = await db
        .selectFrom('institutions')
        .select('id')
        .where('name', '=', institutionName)
        .executeTakeFirst()

      if (!institutionId) {
        throw new Error('Institution not found')
      }

      await db
        .insertInto('institutionUsers')
        .values({ userSub: sub, institutionId: institutionId.id, role })
        .execute()

      revalidatePath(`/${institutionName}/overview/manage-internal-users`)

      return { success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating user', error)

      return { success: false, error: 'Failed to create user in database' }
    } finally {
      db.destroy()
      cognitoClient.destroy()
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in addInstitutionUser', error)

    return { success: false, error: 'Failed to add user' }
  }
}

export const updateInstitutionUser = async (_prevState: unknown, formData: FormData) => {
  'use server'
  const fullName = String(formData.get('name') ?? '').trim()
  const roleRaw = formData.get('role')
  const institutionIdRaw = formData.get('institutionId')
  const userSub = formData.get('userSub')

  if (!fullName || !userSub || typeof userSub !== 'string' || !institutionIdRaw) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    await validateInstitutionUserSession({ institutionId: String(institutionIdRaw) })

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

    const { db } = await getSummerProtocolInstitutionDB({
      connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
    })

    try {
      const institutionId = Number(institutionIdRaw)
      const role = roleRaw ? (String(roleRaw) as UserRole) : null

      if (!Number.isFinite(institutionId)) {
        return { success: false, error: 'Invalid institutionId' }
      }

      // get the user by sub
      const [cognitoUser, institutionName] = await Promise.all([
        cognitoClient.send(
          new ListUsersCommand({
            UserPoolId: userPoolId,
            Filter: `sub = "${userSub}"`,
            Limit: 1,
          }),
        ),
        db
          .selectFrom('institutions')
          .select('name')
          .where('id', '=', institutionId)
          .executeTakeFirst(),
      ])

      if (!institutionName) {
        return { success: false, error: 'Institution not found' }
      }

      if (!cognitoUser.Users || cognitoUser.Users.length === 0) {
        return { success: false, error: `User with sub ${userSub} not found` }
      }

      const username = cognitoUser.Users[0].Username

      const [cognitoUpdateResult, dbUpdateResult] = await Promise.all([
        cognitoClient.send(
          new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: username,
            UserAttributes: [{ Name: 'name', Value: fullName }],
          }),
        ),
        db
          .updateTable('institutionUsers')
          .set({
            institutionId,
            role,
          })
          .where('userSub', '=', userSub)
          .execute(),
      ])

      // eslint-disable-next-line no-console
      console.log(
        'Institution user updated',
        JSON.stringify(
          {
            cognitoUpdateResult,
            dbUpdateResult,
          },
          (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
        ),
      )

      revalidatePath(`/${institutionName.name}/overview/manage-internal-users`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating user', error)

      return { success: false, error: 'Failed to update user' }
    } finally {
      cognitoClient.destroy()
      db.destroy()
    }

    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in updateInstitutionUser', error)

    return { success: false, error: 'Failed to update user' }
  }
}

export async function institutionDeleteCognitoUser(userSub: string, institutionIdRaw: string) {
  'use server'
  await validateInstitutionUserSession({ institutionId: String(institutionIdRaw) })
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting user', error)

    throw new Error(`Failed to delete user with sub ${userSub}`)
  } finally {
    cognitoAdminClient.destroy()
  }
}

export const removeInstitutionUser = async (_prevState: unknown, formData: FormData) => {
  'use server'
  const institutionName = formData.get('institutionName')

  await validateInstitutionUserSession({ institutionName: String(institutionName) })

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
    const userSub = formData.get('userSub')

    if (typeof userSub !== 'string') {
      throw new Error('userSub is required')
    }

    const institutionId = await db
      .selectFrom('institutions')
      .select('id')
      .where('name', '=', institutionName as string)
      .executeTakeFirst()

    if (!institutionId) {
      throw new Error('Institution not found')
    }

    const [deleteDbUserResult, deleteCognitoUserResult] = await Promise.all([
      db.deleteFrom('institutionUsers').where('userSub', '=', userSub).execute(),
      institutionDeleteCognitoUser(userSub, String(institutionId.id)),
    ])

    // eslint-disable-next-line no-console
    console.log(
      // Log the results of the deletion
      'Institution user deleted',
      JSON.stringify(
        {
          deleteDbUserResult,
          deleteCognitoUserResult,
        },
        (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    )
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error deleting whole user', error)
  } finally {
    db.destroy()
    cognitoAdminClient.destroy()
    redirect(`/${institutionName}/overview/manage-internal-users`)
  }
}

export const getWalletDetails: (props: {
  institutionName: string
  walletAddress?: string
}) => Promise<
  | {
      walletAddressRoles: GlobalRoles[]
      roles: {
        [key in GlobalRoles]: boolean
      }
    }
  | undefined
> = async ({ institutionName, walletAddress }) => {
  if (!walletAddress) {
    return undefined
  }
  try {
    const { ADMIRALS_QUARTERS_ROLE, DECAY_CONTROLLER_ROLE, GOVERNOR_ROLE, SUPER_KEEPER_ROLE } =
      await getCachedInstitutionRoles({ institutionName })

    const normalizedWalletAddress = walletAddress.toLowerCase()
    const hasAdmiralsQuartersRole = ADMIRALS_QUARTERS_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )
    const hasDecayControllerRole = DECAY_CONTROLLER_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )
    const hasGovernorRole = GOVERNOR_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )
    const hasSuperKeeperRole = SUPER_KEEPER_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )

    const walletAddressRoles = [] as GlobalRoles[]

    if (hasAdmiralsQuartersRole) {
      walletAddressRoles.push('ADMIRALS_QUARTERS_ROLE' as GlobalRoles)
    }
    if (hasDecayControllerRole) {
      walletAddressRoles.push('DECAY_CONTROLLER_ROLE' as GlobalRoles)
    }
    if (hasGovernorRole) {
      walletAddressRoles.push('GOVERNOR_ROLE' as GlobalRoles)
    }
    if (hasSuperKeeperRole) {
      walletAddressRoles.push('SUPER_KEEPER_ROLE' as GlobalRoles)
    }

    return {
      walletAddressRoles,
      roles: {
        ADMIRALS_QUARTERS_ROLE: hasAdmiralsQuartersRole,
        DECAY_CONTROLLER_ROLE: hasDecayControllerRole,
        GOVERNOR_ROLE: hasGovernorRole,
        SUPER_KEEPER_ROLE: hasSuperKeeperRole,
      },
    }
  } catch (error) {
    return undefined
  }
}
