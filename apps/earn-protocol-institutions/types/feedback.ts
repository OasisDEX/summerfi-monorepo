import { type FeedbackCategory } from '@summerfi/summer-protocol-institutions-db'

export type FeedbackThreadItem = {
  id: number
  threadId: number
  parentId: number | null
  institutionId: number
  authorSub: string | null
  authorName: string | null
  authorEmail: string | null
  authorType: 'admin' | 'system' | 'user'
  content: string
  url: string | null
  category: FeedbackCategory | null
  status: 'closed' | 'in-progress' | 'new' | 'resolved'
  createdAt: string
  updatedAt: string
}

export type FeedbackPostData = {
  feedbackResponseId?: string
  url?: string | null
  category?: FeedbackCategory
  content?: string
  status?: FeedbackThreadItem['status']
}

export type FeedbackThreadDetails = {
  thread: FeedbackThreadItem
  messages: FeedbackThreadItem[]
}

export const feedbackCategoryOptions: {
  label: string
  value: FeedbackCategory
}[] = [
  { label: 'Question', value: 'question' },
  { label: 'Bug', value: 'bug' },
  { label: 'Feature Request', value: 'feature-request' },
]
