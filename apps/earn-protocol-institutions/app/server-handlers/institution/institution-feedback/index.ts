import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import { unstable_cache as unstableCache } from 'next/cache'

import { type SessionPayload } from '@/features/auth/types'
import { type FeedbackPostData } from '@/types/feedback'

// region fetchers
export const submitFeedback = async ({
  feedback,
  session,
  institutionId,
}: {
  feedback: FeedbackPostData
  session: SessionPayload
  institutionId: number
}) => {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    if (
      !feedback.category ||
      !feedback.content ||
      feedback.content.trim().length < 10 ||
      Number.isNaN(Number(institutionId)) ||
      !session.user?.institutionsList
    ) {
      throw new Error('Invalid feedback data')
    }
    if (session.user.institutionsList.every((inst) => Number(inst.id) !== Number(institutionId))) {
      throw new Error('Institution access denied')
    }

    // Verify institution exists
    const institution = await db
      .selectFrom('institutions')
      .select(['id', 'name'])
      .where('id', '=', Number(institutionId))
      .executeTakeFirst()

    if (!institution) {
      throw new Error('Institution not found')
    }

    // Create feedback ticket + message in a single transaction
    const ticket = await db
      .insertInto('feedbackMessages')
      .values({
        threadId: 0, // Placeholder, will update after insert
        parentId: null,
        institutionId: institution.id,
        authorSub: session.sub,
        authorName: session.user.name,
        authorEmail: session.user.email,
        authorType: session.user.isGlobalAdmin ? 'admin' : 'user',
        content: feedback.content,
        url: feedback.url ?? null,
        category: feedback.category,
        status: 'new',
      })
      .returning(['id', 'createdAt'])
      .executeTakeFirstOrThrow()

    // Update thread_id to match the message id
    await db
      .updateTable('feedbackMessages')
      .set({ threadId: ticket.id })
      .where('id', '=', ticket.id)
      .execute()

    return {
      threadId: ticket.id,
      createdAt: ticket.createdAt,
    }
  } catch {
    return null
  } finally {
    db.destroy()
  }
}

export const submitFeedbackResponse = async ({
  feedbackResponse,
  session,
  institutionId,
}: {
  feedbackResponse: FeedbackPostData
  session: SessionPayload
  institutionId: number
}) => {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    if (
      !feedbackResponse.feedbackResponseId ||
      !feedbackResponse.content ||
      feedbackResponse.content.trim().length < 10 ||
      Number.isNaN(Number(institutionId)) ||
      (!session.user?.institutionsList && !session.user?.isGlobalAdmin)
    ) {
      throw new Error(
        `Invalid feedback response data${JSON.stringify({
          feedbackResponse,
          session,
          institutionId,
        })}`,
      )
    }
    if (
      !session.user.isGlobalAdmin &&
      session.user.institutionsList?.every((inst) => Number(inst.id) !== Number(institutionId))
    ) {
      throw new Error('Institution access denied')
    }

    // Verify thread exists and get current status
    const thread = await db
      .selectFrom('feedbackMessages')
      .select(['id', 'status', 'institutionId'])
      .where('id', '=', Number(feedbackResponse.feedbackResponseId))
      .where('parentId', 'is', null)
      .executeTakeFirst()

    if (!thread) {
      throw new Error('Thread not found')
    }

    if (Number(thread.institutionId) !== Number(institutionId)) {
      throw new Error('Institution mismatch')
    }

    // Insert the message
    const result = await db
      .insertInto('feedbackMessages')
      .values({
        threadId: thread.id,
        parentId: Number(feedbackResponse.feedbackResponseId),
        institutionId: Number(institutionId),
        authorSub: session.sub,
        authorName: session.user.name,
        authorEmail: session.user.email,
        authorType: session.user.isGlobalAdmin ? 'admin' : 'user',
        content: feedbackResponse.content,
        url: null,
        category: null,
        status: thread.status, // Inherit current thread status
      })
      .returning(['id', 'createdAt'])
      .executeTakeFirstOrThrow()

    return {
      messageId: result.id,
      createdAt: result.createdAt,
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error submitting feedback response:', err)

    return null
  } finally {
    db.destroy()
  }
}

const getInstitutionFeedbackList = async ({
  institutionId,
  session,
}: {
  institutionId: string
  session: SessionPayload
}) => {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    if (Number.isNaN(Number(institutionId)) || !session.user?.institutionsList) {
      throw new Error('Invalid feedback data')
    }
    if (session.user.institutionsList.every((inst) => Number(inst.id) !== Number(institutionId))) {
      throw new Error('Institution access denied')
    }
    if (!institutionId || Number.isNaN(Number(institutionId))) {
      throw new Error('Invalid institutionId')
    }
    const feedbackList = await db
      .selectFrom('feedbackMessages')
      .where('institutionId', '=', Number(institutionId))
      .where('parentId', 'is', null) // Only get root messages (thread starters)
      .selectAll()
      .orderBy('createdAt', 'desc')
      .execute()

    return feedbackList
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution feedback list:', error)

    return null
  } finally {
    db.destroy()
  }
}

export const getInstitutionFeedbackThread = async ({
  institutionId,
  threadId,
  session,
}: {
  institutionId: string
  threadId: string
  session: SessionPayload
}) => {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    if (Number.isNaN(Number(institutionId)) || !session.user?.institutionsList) {
      throw new Error('Invalid feedback data')
    }
    if (session.user.institutionsList.every((inst) => Number(inst.id) !== Number(institutionId))) {
      throw new Error('Institution access denied')
    }
    if (!institutionId || Number.isNaN(Number(institutionId))) {
      throw new Error('Invalid institutionId')
    }
    if (!threadId || Number.isNaN(Number(threadId))) {
      throw new Error('Invalid threadId')
    }
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution feedback list:', error)

    return null
  } finally {
    db.destroy()
  }
}

export const updateFeedbackStatus = async ({
  institutionId,
  threadId,
  newStatus,
  session,
}: {
  institutionId: string
  threadId: string
  newStatus: 'new' | 'in-progress' | 'resolved' | 'closed'
  session: SessionPayload
}) => {
  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  try {
    if (!institutionId || Number.isNaN(Number(institutionId))) {
      throw new Error('Invalid institutionId')
    }
    if (!threadId || Number.isNaN(Number(threadId))) {
      throw new Error('Invalid threadId')
    }

    const thread = await db
      .selectFrom('feedbackMessages')
      .select(['status', 'institutionId'])
      .where('id', '=', Number(threadId))
      .where('parentId', 'is', null)
      .executeTakeFirst()

    if (!thread) {
      throw new Error('Thread not found')
    }

    if (Number(thread.institutionId) !== Number(institutionId)) {
      throw new Error('Institution mismatch')
    }

    const oldStatus = thread.status
    const changedByName = session.user?.name ?? 'System'

    // Update all messages in the thread with new status
    await db
      .updateTable('feedbackMessages')
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where('threadId', '=', Number(threadId))
      .execute()

    await db
      .insertInto('feedbackMessages')
      .values({
        threadId: Number(threadId),
        parentId: Number(threadId),
        institutionId: Number(institutionId),
        authorSub: null,
        authorName: null,
        authorEmail: null,
        authorType: 'system',
        content: `Status changed from ${oldStatus} to ${newStatus} by ${changedByName}`,
        url: null,
        category: null,
        status: newStatus,
      })
      .execute()

    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating feedback status:', error)

    return false
  } finally {
    db.destroy()
  }
}

// endregion

// region cached calls

export const getCachedInstitutionFeedbackList = ({
  institutionId,
  session,
}: {
  institutionId: string
  session: SessionPayload
}) => {
  return unstableCache(getInstitutionFeedbackList, ['institution-feedback-list', institutionId], {
    revalidate: 300,
    tags: [`institution-feedback-list-${institutionId.toLowerCase()}`],
  })({ institutionId, session })
}
