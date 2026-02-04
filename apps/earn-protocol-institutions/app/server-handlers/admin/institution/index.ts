import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import { redirect } from 'next/navigation'

import { rootAdminActionDeleteCognitoUser } from '@/app/server-handlers/admin/user'
import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { readSession } from '@/app/server-handlers/auth/session'
import {
  submitFeedbackResponse,
  updateFeedbackStatus,
} from '@/app/server-handlers/institution/institution-feedback'
import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

export async function rootAdminActionCreateInstitution(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()

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
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error creating institution', error)
  } finally {
    db.destroy()
  }
}

export async function rootAdminActionUpdateInstitution(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()

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

    const institutionUpdateResult = await db
      .updateTable('institutions')
      .set({
        name: institutionName.trim(),
        displayName: displayName.trim(),
        logoUrl: typeof logoUrl === 'string' ? logoUrl.trim() : '',
        logoFile: logoFile ? logoFile : undefined,
      })
      .where('id', '=', Number(institutionId))
      .execute()

    // eslint-disable-next-line no-console
    console.log(
      // Log the results of the update
      'Institution updated',
      JSON.stringify(
        {
          institutionUpdateResult,
        },
        (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    )
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error updating institution', error)
  } finally {
    db.destroy()

    redirect('/admin/institutions')
  }
}

export async function rootAdminActionDeleteInstitution(formData: FormData) {
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
        ...institutionUsers.map((user) => rootAdminActionDeleteCognitoUser(user.userSub)),
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
  } catch (error) {
    // Handle errors
    // eslint-disable-next-line no-console
    console.error('Error deleting institution', error)
  } finally {
    db.destroy()
    cognitoAdminClient.destroy()

    redirect('/admin/institutions')
  }
}

export async function rootAdminActionGetInstitutionsList() {
  'use server'
  await rootAdminValidateAdminSession()

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

export async function rootAdminActionGetInstitutionData(institutionDbId: number) {
  'use server'
  await rootAdminValidateAdminSession()

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

export async function rootAdminGetFeedbackList() {
  'use server'
  await rootAdminValidateAdminSession()

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const feedbackList = await db
    .selectFrom('feedbackMessages')
    .where('parentId', 'is', null)
    .selectAll()
    .orderBy('createdAt', 'desc')
    .execute()

  db.destroy()

  return feedbackList
}

export async function rootAdminGetFeedbackDetails(threadId: string, institutionId: string) {
  'use server'
  await rootAdminValidateAdminSession()

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  // Get the root message first to verify it exists and belongs to institution
  const rootMessage = await db
    .selectFrom('feedbackMessages')
    .where('id', '=', Number(threadId))
    .where('institutionId', '=', Number(institutionId))
    .where('parentId', 'is', null)
    .selectAll()
    .executeTakeFirst()

  if (!rootMessage) {
    return null
  }

  // Get all messages in the thread
  const messages = await db
    .selectFrom('feedbackMessages')
    .where('threadId', '=', Number(threadId))
    .where('id', '!=', Number(threadId))
    .selectAll()
    .orderBy('createdAt', 'asc')
    .execute()

  return {
    thread: rootMessage,
    messages,
  }
}

export async function rootAdminFeedbackSendResponse(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()

  const institutionId = formData.get('institutionId')
  const threadId = formData.get('threadId')
  const content = formData.get('content')

  if (
    typeof institutionId !== 'string' ||
    isNaN(Number(institutionId)) ||
    typeof threadId !== 'string' ||
    isNaN(Number(threadId)) ||
    typeof content !== 'string' ||
    !content.trim()
  ) {
    throw new Error('institutionId, threadId and content are required')
  }

  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  const sendFeedbackResponse = await submitFeedbackResponse({
    feedbackResponse: {
      feedbackResponseId: threadId,
      content: content.trim(),
    },
    institutionId: Number(institutionId),
    session,
  })

  if (!sendFeedbackResponse) {
    throw new Error('Failed to send feedback response')
  }

  redirect(`/admin/feedback/${institutionId}/${threadId}`)
}

export async function rootAdminFeedbackChangeStatus(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()

  const institutionId = formData.get('institutionId')
  const threadId = formData.get('threadId')
  const newStatus = formData.get('status')

  if (
    typeof institutionId !== 'string' ||
    isNaN(Number(institutionId)) ||
    typeof threadId !== 'string' ||
    isNaN(Number(threadId)) ||
    typeof newStatus !== 'string' ||
    !['closed', 'in-progress', 'new', 'resolved'].includes(newStatus)
  ) {
    throw new Error('institutionId, threadId and valid status are required')
  }

  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  const update = await updateFeedbackStatus({
    institutionId,
    newStatus: newStatus as 'closed' | 'in-progress' | 'new' | 'resolved',
    session,
    threadId,
  })

  if (!update) {
    throw new Error('Failed to update feedback status')
  }

  redirect(`/admin/feedback/${institutionId}/${threadId}`)
}

export async function rootAdminFeedbackDelete(formData: FormData) {
  'use server'
  await rootAdminValidateAdminSession()

  const institutionId = formData.get('institutionId')
  const threadId = formData.get('threadId')

  if (
    typeof institutionId !== 'string' ||
    isNaN(Number(institutionId)) ||
    typeof threadId !== 'string' ||
    isNaN(Number(threadId))
  ) {
    throw new Error('institutionId and threadId are required')
  }

  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    // Delete all messages
    await db.deleteFrom('feedbackMessages').where('parentId', '=', Number(threadId)).execute()
    await db.deleteFrom('feedbackMessages').where('threadId', '=', Number(threadId)).execute()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error deleting feedback thread:', error)

    throw new Error('Failed to delete feedback thread')
  } finally {
    db.destroy()
  }

  redirect(`/admin/feedback`)
}
