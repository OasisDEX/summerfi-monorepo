import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { readSession } from '@/app/server-handlers/auth/session'
import {
  getInstitutionFeedbackThread,
  getCachedInstitutionFeedbackList,
  submitFeedback,
  submitFeedbackResponse,
  updateFeedbackStatus,
} from '@/app/server-handlers/institution/institution-feedback'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'
import { type FeedbackPostData } from '@/types/feedback'

const createFeedbackSchema = z.object({
  category: z.enum(['question', 'bug', 'feature-request']).optional(),
  content: z.string().min(10).max(5000),
  url: z.string().min(1).max(512).optional(),
})

const createFeedbackResponseSchema = z.object({
  feedbackResponseId: z.string().min(1),
  content: z.string().min(10),
})

const updateFeedbackStatusSchema = z.object({
  feedbackResponseId: z.string().min(1),
  status: z.enum(['closed', 'in-progress', 'new', 'resolved']),
})

export const POST = async (request: Request) => {
  // Get user session info
  const session = await readSession()

  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const institutionId = session.user?.institutionsList?.[0]?.id

  if (!institutionId) {
    return NextResponse.json({ error: 'user not associated with any institution' }, { status: 403 })
  }

  const requestData = (await request.json()) as FeedbackPostData
  const { category, content, url, feedbackResponseId } = requestData

  if (feedbackResponseId) {
    const feedbackResponseValidationResult = createFeedbackResponseSchema.safeParse({
      feedbackResponseId,
      content,
    })

    if (!feedbackResponseValidationResult.success) {
      return NextResponse.json(
        {
          error: `Error: Invalid input, ${JSON.stringify(feedbackResponseValidationResult.error.format())}`,
        },
        { status: 400 },
      )
    }
    const response = await submitFeedbackResponse({
      feedbackResponse: { content, feedbackResponseId },
      institutionId,
      session,
    })

    if (!response) {
      return NextResponse.json({ error: 'submission failed' }, { status: 404 })
    }

    return NextResponse.json(response)
  }

  const addNewFeedbackValidationResult = createFeedbackSchema.safeParse({ category, content, url })

  if (!addNewFeedbackValidationResult.success) {
    return NextResponse.json(
      {
        error: `Error: Invalid input, ${JSON.stringify(addNewFeedbackValidationResult.error.format())}`,
      },
      { status: 400 },
    )
  }

  const submission = await submitFeedback({
    feedback: { category, content, url },
    institutionId,
    session,
  })

  revalidateTag(`institution-feedback-list-${String(institutionId).toLowerCase()}`)

  if (!submission) {
    return NextResponse.json({ error: 'submission failed' }, { status: 404 })
  }

  return NextResponse.json(submission)
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const institutionId = searchParams.get('institutionId') ?? undefined
  const threadId = searchParams.get('threadId') ?? undefined

  if (!institutionId) {
    return NextResponse.json({ error: 'institutionId is required' }, { status: 400 })
  }

  await validateInstitutionUserSession({ institutionId })

  // Get user session info
  const session = await readSession()

  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (threadId) {
    const feedbackDetails = await getInstitutionFeedbackThread({
      institutionId,
      session,
      threadId,
    })

    return NextResponse.json(feedbackDetails)
  }

  const feedbackList = await getCachedInstitutionFeedbackList({
    institutionId,
    session,
  })

  return NextResponse.json(feedbackList ?? [])
}

export const PATCH = async (request: Request) => {
  // Get user session info
  const session = await readSession()

  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const requestData = (await request.json()) as FeedbackPostData
  const { feedbackResponseId, status: newStatus } = requestData

  const institutionId = session.user?.institutionsList?.[0]?.id

  if (!institutionId) {
    return NextResponse.json({ error: 'user not associated with any institution' }, { status: 403 })
  }
  if (!feedbackResponseId) {
    return NextResponse.json({ error: 'feedbackResponseId is required' }, { status: 400 })
  }
  if (!newStatus) {
    return NextResponse.json({ error: 'status is required' }, { status: 400 })
  }

  const updateStatusValidationResult = updateFeedbackStatusSchema.safeParse({
    feedbackResponseId,
    status: newStatus,
  })

  if (!updateStatusValidationResult.success) {
    return NextResponse.json(
      {
        error: `Error: Invalid input, ${JSON.stringify(updateStatusValidationResult.error.format())}`,
      },
      { status: 400 },
    )
  }

  const updatedFeedback = await updateFeedbackStatus({
    newStatus: newStatus as 'closed' | 'in-progress' | 'new' | 'resolved',
    threadId: feedbackResponseId,
    institutionId: institutionId.toString(),
    session,
  })

  if (!updatedFeedback) {
    return NextResponse.json({ error: 'update failed' }, { status: 404 })
  }

  return NextResponse.json(updatedFeedback)
}
