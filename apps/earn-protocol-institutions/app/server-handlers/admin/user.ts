'use server'

import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import {
  getSummerProtocolInstitutionDB,
  type UserRole,
} from '@summerfi/summer-protocol-institutions-db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { getAttr, slugifyName } from '@/app/server-handlers/admin/helpers'
import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

export async function deleteCognitoUser(userSub: string) {
  'use server'
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

export async function createUser(formData: FormData) {
  'use server'
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
    sub = getAttr(found.Users[0], 'sub')
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
        ],
      }),
    )

    // add to `institution-user` group - easier to list them later
    // `ListUsersInGroupCommand` instead of `ListUsersCommand`
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: generatedUsername,
        GroupName: 'institution-user',
      }),
    )

    username = created.User?.Username ?? generatedUsername

    // Retrieve attributes to get sub
    const createdFetch = await cognitoClient.send(
      new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }),
    )

    sub = getAttr(createdFetch, 'sub')
  }

  // 2b) Ensure we have sub
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
    await db.insertInto('institutionUsers').values({ userSub: sub, institutionId, role }).execute()

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

export async function deleteWholeUser(formData: FormData) {
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
    const userSub = formData.get('userSub')

    if (typeof userSub !== 'string') {
      throw new Error('userSub is required')
    }

    const [deleteDbUserResult, deleteCognitoUserResult] = await Promise.all([
      db.deleteFrom('institutionUsers').where('userSub', '=', userSub).execute(),
      deleteCognitoUser(userSub),
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
    revalidateTag('getUsersList')
    redirect('/admin/users')
  }
}

export async function updateUser(formData: FormData) {
  'use server'
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
    const cognitoUser = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `sub = "${userSub}"`,
        Limit: 1,
      }),
    )

    if (cognitoUser.Users && cognitoUser.Users.length > 0) {
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
    revalidateTag('getUsersList')
    redirect('/admin/users')
  }
}

export async function getUsersList() {
  'use server'
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
    const [dbUsers] = await Promise.all([
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
    ])

    const cognitoUsers = await cognitoAdminClient.send(
      new ListUsersInGroupCommand({
        UserPoolId: userPoolId,
        GroupName: 'institution-user',
      }),
    )

    // enriched with cognito data
    const users = dbUsers.map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.Users?.find((u) =>
        u.Attributes?.find((a) => a.Name === 'sub' && a.Value === userSub),
      )
      const cognitoUserName = user?.Username
      const cognitoName = user?.Attributes?.find((a) => a.Name === 'name')?.Value

      return {
        ...dbUser,
        userSub,
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

export async function getUserData(userDbId: number) {
  'use server'
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

  const userData = await cognitoAdminClient.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `sub = "${dbUser.userSub}"`,
      Limit: 1,
    }),
  )

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

export async function getGlobalAdminsList() {
  'use server'
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
    const [globalAdmins] = await Promise.all([db.selectFrom('globalAdmins').selectAll().execute()])

    const cognitoUsers = await cognitoAdminClient.send(
      new ListUsersInGroupCommand({
        UserPoolId: userPoolId,
        GroupName: 'global-admin',
      }),
    )

    // enriched with cognito data
    const admins = globalAdmins.map(({ userSub, ...dbUser }) => {
      const user = cognitoUsers.Users?.find((u) =>
        u.Attributes?.find((a) => a.Name === 'sub' && a.Value === userSub),
      )
      const cognitoUserName = user?.Username
      const cognitoName = user?.Attributes?.find((a) => a.Name === 'name')?.Value

      return {
        ...dbUser,
        userSub,
        cognitoUserName,
        cognitoName,
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
    cognitoAdminClient.destroy()
    db.destroy()
  }
}

export async function getGlobalAdminData(userDbId: number) {
  'use server'
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

    const userData = await cognitoAdminClient.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `sub = "${globalAdmin.userSub}"`,
        Limit: 1,
      }),
    )

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

export async function createGlobalAdmin(formData: FormData) {
  'use server'
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
    const generatedUsername = slugifyName(fullName)
    // Create the user in Cognito
    const cognitoUser = await cognitoAdminClient.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: generatedUsername,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: fullName },
        ],
      }),
    )

    // Add the user to the 'institution-user' group
    await cognitoAdminClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: generatedUsername,
        GroupName: 'global-admin',
      }),
    )

    const userSub = cognitoUser.User?.Attributes?.find((a) => a.Name === 'sub')?.Value as string

    // Create the user in the database
    await db
      .insertInto('globalAdmins')
      .values({
        userSub,
      })
      .execute()

    // eslint-disable-next-line no-console
    console.log(`Global admin created successfully: ${userSub}`)
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error creating global admin', error)

    throw new Error('Failed to create global admin')
  } finally {
    revalidateTag('getGlobalAdminsList')
    cognitoAdminClient.destroy()
    db.destroy()
  }
}

export async function deleteGlobalAdmin(formData: FormData) {
  'use server'
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
    await deleteCognitoUser(userSub)

    // eslint-disable-next-line no-console
    console.log(`Global admin deleted successfully: ${userSub}`)
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error deleting global admin', error)

    throw new Error('Failed to delete global admin')
  } finally {
    revalidateTag('getGlobalAdminsList')
    cognitoAdminClient.destroy()
    db.destroy()
    redirect('/admin/global-admins')
  }
}

export async function updateGlobalAdmin(formData: FormData) {
  'use server'
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
    await cognitoAdminClient.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: cognitoUserName,
        UserAttributes: [{ Name: 'name', Value: fullName }],
      }),
    )

    // eslint-disable-next-line no-console
    console.log(`Global admin updated successfully: ${cognitoUserName}`)
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error updating global admin', error)

    throw new Error('Failed to update global admin')
  } finally {
    revalidateTag('getGlobalAdminsList')
    cognitoAdminClient.destroy()
    redirect('/admin/global-admins')
  }
}
