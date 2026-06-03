'use server'

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
import {
  getSummerProtocolInstitutionDB,
  type UserRole,
} from '@summerfi/summer-protocol-institutions-db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import {
  cognitoGroupTag,
  getCachedCognitoGroupUsers,
} from '@/app/server-handlers/institution/institution-users/cached-cognito-users'
import { escapeCognitoFilterValue } from '@/app/server-handlers/institution/institution-users/helpers'
import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

// this is just a simple helper function to extract user attributes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAttr = (u: any | undefined, key: string) => {
  const list = u?.Attributes ?? u?.UserAttributes

  return Array.isArray(list) ? list.find((a) => a.Name === key)?.Value : undefined
}

export async function rootAdminActionDeleteCognitoUser(userSub: string) {
  'use server'
  await rootAdminValidateAdminSession()
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
    const userData = await cognitoAdminClient
      .send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `sub = "${escapeCognitoFilterValue(userSub)}"`,
          Limit: 1,
        }),
      )
      .catch((error) => {
        throw new Error(`Error fetching user with sub ${userSub}: ${error}`)
      })

    if (!userData.Users || userData.Users.length === 0) {
      throw new Error(`User with sub ${userSub} not found`)
    }

    const userDeletionQuery = await cognitoAdminClient
      .send(
        new AdminDeleteUserCommand({
          UserPoolId: userPoolId,
          Username: userData.Users[0].Username,
        }),
      )
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error deleting user', error)
      })

    return userDeletionQuery
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting user', error)

    throw new Error(`Failed to delete user with sub ${userSub}`)
  } finally {
    cognitoAdminClient.destroy()
  }
}

export async function rootAdminActionCreateUser(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()
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
  const found = await cognitoClient
    .send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `email = "${escapeCognitoFilterValue(email)}"`,
        Limit: 1,
      }),
    )
    .catch((error) => {
      throw new Error(`Error searching for user by email ${email}: ${error}`)
    })

  let username: string | undefined
  let sub: string | undefined

  if (found.Users && found.Users.length > 0) {
    username = found.Users[0]?.Username
    sub = getAttr(found.Users[0], 'sub')
  } else {
    // 2) Create user if not exists. Username cannot be an email when email alias is enabled.
    const base = slugify(fullName)
    const generatedUsername = `${base}-${Math.random().toString(36).slice(2, 8)}`

    const created = await cognitoClient
      .send(
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
      .catch((error) => {
        throw new Error(`Error creating user with email ${email}: ${error}`)
      })

    // add to `institution-user` group - easier to list them later
    // `ListUsersInGroupCommand` instead of `ListUsersCommand`
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
        console.error('Error adding user to group', error)
      })

    username = created.User?.Username ?? generatedUsername

    // Retrieve attributes to get sub
    const createdFetch = await cognitoClient
      .send(new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }))
      .catch((error) => {
        throw new Error(`Error fetching created user ${username}: ${error}`)
      })

    sub = getAttr(createdFetch, 'sub')
  }

  // 2b) Ensure we have sub
  if (!sub && username) {
    const fetched = await cognitoClient
      .send(new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }))
      .catch((error) => {
        throw new Error(`Error fetching user ${username} to get sub: ${error}`)
      })

    sub = getAttr(fetched, 'sub')
  }

  if (!sub) throw new Error('Failed to resolve Cognito user sub')

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    await db.insertInto('institutionUsers').values({ userSub: sub, institutionId, role }).execute()

    revalidateTag(cognitoGroupTag('institution-user'), { expire: 0 })
    revalidatePath('/admin/users')
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error creating user', error)
  } finally {
    db.destroy()
    cognitoClient.destroy()
  }
}

export async function rootAdminActionDeleteWholeUser(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()

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

    const [deleteDbUserResult, deleteCognitoUserResult] = await Promise.all([
      db.deleteFrom('institutionUsers').where('userSub', '=', userSub).execute(),
      rootAdminActionDeleteCognitoUser(userSub),
    ])

    // eslint-disable-next-line no-console
    console.log(
      // Log the results of the deletion
      'User deleted',
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
    revalidateTag(cognitoGroupTag('institution-user'), { expire: 0 })
    redirect('/admin/users')
  }
}

export async function rootAdminActionUpdateUser(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()
  const fullName = String(formData.get('name') ?? '').trim()
  const roleRaw = formData.get('role')
  const institutionIdRaw = formData.get('institutionId')
  const userSub = formData.get('userSub')

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
    if (!fullName || !userSub || typeof userSub !== 'string') {
      throw new Error('Missing required fields')
    }

    const institutionId = Number(institutionIdRaw)
    const role = roleRaw ? (String(roleRaw) as UserRole) : null

    if (!Number.isFinite(institutionId)) {
      throw new Error('Invalid institutionId')
    }

    // get the user by email
    const cognitoUser = await cognitoClient
      .send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `sub = "${escapeCognitoFilterValue(userSub)}"`,
          Limit: 1,
        }),
      )
      .catch((error) => {
        throw new Error(`Error fetching user data for update: ${error}`)
      })

    if (cognitoUser.Users && cognitoUser.Users.length > 0) {
      const username = cognitoUser.Users[0].Username
      const [cognitoUpdateResult, dbUpdateResult] = await Promise.all([
        cognitoClient
          .send(
            new AdminUpdateUserAttributesCommand({
              UserPoolId: userPoolId,
              Username: username,
              UserAttributes: [{ Name: 'name', Value: fullName }],
            }),
          )
          .catch((error) => {
            throw new Error(`Error updating user attributes: ${error}`)
          }),
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
        // Log the results of the update
        'User updated',
        JSON.stringify(
          {
            cognitoUpdateResult,
            dbUpdateResult,
          },
          (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
        ),
      )
    } else {
      throw new Error(`User with sub ${userSub} not found`)
    }
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error updating user', error)
  } finally {
    cognitoClient.destroy()
    db.destroy()
    revalidateTag(cognitoGroupTag('institution-user'), { expire: 0 })
    redirect('/admin/users')
  }
}

export async function rootAdminActionGetUsersList() {
  'use server'
  await rootAdminValidateAdminSession()

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
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
          'institutionUsers.createdAt',
          'institutions.displayName as institutionDisplayName',
        ])
        .execute(),
      getCachedCognitoGroupUsers('institution-user'),
    ])

    // enriched with cognito data
    const users = dbUsers.map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.find((cognitoUser) => cognitoUser.sub === userSub)

      return {
        ...dbUser,
        userSub,
        cognitoEmail: user?.email,
        cognitoUserName: user?.username,
        cognitoName: user?.name,
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
  }
}

export async function rootAdminActionGetUserData(userDbId: number) {
  'use server'
  await rootAdminValidateAdminSession()
  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID
  const region = COGNITO_USER_POOL_REGION

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const [dbUser] = await Promise.all([
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
      .where('institutionUsers.id', '=', userDbId)
      .executeTakeFirst(),
  ])

  if (!dbUser?.userSub) {
    throw new Error(`User with id ${userDbId} not found`)
  }

  const cognitoAdminClient = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const userData = await cognitoAdminClient
    .send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `sub = "${escapeCognitoFilterValue(dbUser.userSub)}"`,
        Limit: 1,
      }),
    )
    .catch((error) => {
      throw new Error(`Error fetching user with sub ${dbUser.userSub}: ${error}`)
    })

  if (!userData.Users || userData.Users.length === 0) {
    throw new Error(`User with sub ${dbUser.userSub} not found`)
  }

  const cognitoUserName = userData.Users[0].Username
  const cognitoName = userData.Users[0].Attributes?.find((a) => a.Name === 'name')?.Value

  return {
    ...dbUser,
    userSub: dbUser.userSub,
    cognitoUserName,
    cognitoName,
  }
}

export async function rootAdminActionGetGlobalAdminsList() {
  'use server'
  await rootAdminValidateAdminSession()

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    const [globalAdmins, cognitoUsers] = await Promise.all([
      db.selectFrom('globalAdmins').selectAll().execute(),
      // Global admins are added to the 'global-admin' Cognito group (see rootAdminActionCreateGlobalAdmin),
      // so enrich against that group rather than 'institution-user'.
      getCachedCognitoGroupUsers('global-admin'),
    ])

    // enriched with cognito data
    const admins = globalAdmins.map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.find((cognitoUser) => cognitoUser.sub === userSub)

      return {
        ...dbUser,
        userSub,
        cognitoEmail: user?.email,
        cognitoUserName: user?.username,
        cognitoName: user?.name,
      }
    })

    return {
      admins,
    }
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error fetching global admins', error)

    throw new Error('Failed to fetch global admins')
  } finally {
    db.destroy()
  }
}

export async function rootAdminActionGetGlobalAdminData(userDbId: number) {
  'use server'
  await rootAdminValidateAdminSession()
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
    const [globalAdmin] = await Promise.all([
      db.selectFrom('globalAdmins').selectAll().where('id', '=', userDbId).executeTakeFirst(),
    ])

    if (!globalAdmin) throw new Error(`Global admin with id ${userDbId} not found`)

    const userData = await cognitoAdminClient
      .send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `sub = "${escapeCognitoFilterValue(globalAdmin.userSub)}"`,
          Limit: 1,
        }),
      )
      .catch((error) => {
        throw new Error(`Error fetching user with sub ${globalAdmin.userSub}: ${error}`)
      })

    if (!userData.Users || userData.Users.length === 0) {
      throw new Error(`Cognito user not found for sub ${globalAdmin.userSub}`)
    }

    return {
      ...globalAdmin,
      cognitoUserName: userData.Users[0].Username,
      cognitoName: userData.Users[0].Attributes?.find((a) => a.Name === 'name')?.Value,
    }
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error fetching global admin data', error)

    throw new Error('Failed to fetch global admin data')
  } finally {
    cognitoAdminClient.destroy()
    db.destroy()
  }
}

export async function rootAdminActionCreateGlobalAdmin(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()
  const email = formData.get('email')?.toString()
  const fullName = formData.get('name')?.toString()

  if (!email || !fullName) {
    throw new Error('Missing required fields')
  }

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
    const generatedUsername = slugify(fullName)
    // Create the user in Cognito
    const cognitoUser = await cognitoAdminClient
      .send(
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
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error creating cognito user', error)

        throw new Error('Failed to create cognito user')
      })

    // Add the user to the 'institution-user' group
    await cognitoAdminClient
      .send(
        new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: generatedUsername,
          GroupName: 'global-admin',
        }),
      )
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error adding user to group institution-user', error)
      })

    const userSub = cognitoUser.User?.Attributes?.find((a) => a.Name === 'sub')?.Value as string

    // Create the user in the database
    await db
      .insertInto('globalAdmins')
      .values({
        userSub,
      })
      .execute()

    revalidateTag(cognitoGroupTag('global-admin'), { expire: 0 })

    // eslint-disable-next-line no-console
    console.log(`Global admin created successfully: ${userSub}`)
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error creating global admin', error)

    throw new Error('Failed to create global admin')
  } finally {
    cognitoAdminClient.destroy()
    db.destroy()
  }
}

export async function rootAdminActionDeleteGlobalAdmin(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()
  const userSub = formData.get('userSub')

  if (typeof userSub !== 'string') {
    throw new Error('userSub is required')
  }

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
    // Delete the user from the database
    await db.deleteFrom('globalAdmins').where('userSub', '=', userSub).execute()

    // Delete the user from Cognito
    await rootAdminActionDeleteCognitoUser(userSub)

    // eslint-disable-next-line no-console
    console.log(`Global admin deleted successfully: ${userSub}`)
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error deleting global admin', error)

    throw new Error('Failed to delete global admin')
  } finally {
    cognitoAdminClient.destroy()
    db.destroy()
    revalidateTag(cognitoGroupTag('global-admin'), { expire: 0 })
    redirect('/admin/global-admins')
  }
}

export async function rootAdminActionUpdateGlobalAdmin(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()
  const fullName = formData.get('name')?.toString()
  const cognitoUserName = formData.get('cognitoUserName')

  if (!fullName || typeof cognitoUserName !== 'string') {
    throw new Error('Missing required fields')
  }

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
    // Update the user in Cognito
    await cognitoAdminClient
      .send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: userPoolId,
          Username: cognitoUserName,
          UserAttributes: [{ Name: 'name', Value: fullName }],
        }),
      )
      .catch((error) => {
        throw new Error(`Error updating global admin in cognito: ${error}`)
      })

    // eslint-disable-next-line no-console
    console.log(`Global admin updated successfully: ${cognitoUserName}`)
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error updating global admin', error)

    throw new Error('Failed to update global admin')
  } finally {
    cognitoAdminClient.destroy()
    revalidateTag(cognitoGroupTag('global-admin'), { expire: 0 })
    redirect('/admin/global-admins')
  }
}
