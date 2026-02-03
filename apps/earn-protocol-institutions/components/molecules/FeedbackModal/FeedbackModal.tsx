/* eslint-disable camelcase */
import { useMemo, useState } from 'react'
import { Button, Card, Input, PillSelector, Text } from '@summerfi/app-earn-ui'
import dayjs from 'dayjs'

import { CHART_TIMESTAMP_FORMAT_SHORT } from '@/features/charts/helpers'

import feedbackModalStyles from './FeedbackModal.module.css'

type FeedbackMessage = {
  id: string
  feedback_ticket_id: string
  author_sub: string
  author_type: string
  content: string
  created_at: string
  updated_at: string
}

type FeedbackTicket = {
  id: string
  user_sub: string
  institution_id: string
  url?: string
  category?: string
  status: string
  created_at: string
  updated_at: string
  messages: FeedbackMessage[]
}

const mockUserSub = 'auth0|sample-user'

const mockTickets: FeedbackTicket[] = [
  {
    id: 'mock-ticket-1',
    user_sub: mockUserSub,
    institution_id: 'institution-a',
    url: 'https://app.summer.fi/institutions/a',
    category: 'bug',
    status: 'new',
    created_at: '2024-05-12T09:00:00Z',
    updated_at: '2024-05-12T09:00:00Z',
    messages: [
      {
        id: 'mock-message-1',
        feedback_ticket_id: 'mock-ticket-1',
        author_sub: mockUserSub,
        author_type: 'user',
        content:
          'I cannot submit the form for institution A on the dashboard page after the latest update.',
        created_at: '2024-05-12T09:00:00Z',
        updated_at: '2024-05-12T09:00:00Z',
      },
    ],
  },
  {
    id: 'mock-ticket-2',
    user_sub: mockUserSub,
    institution_id: 'institution-b',
    url: 'https://app.summer.fi/institutions/b',
    category: 'feature',
    status: 'in_progress',
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-11T10:00:00Z',
    messages: [
      {
        id: 'mock-message-2',
        feedback_ticket_id: 'mock-ticket-2',
        author_sub: mockUserSub,
        author_type: 'user',
        content:
          'Requesting CSV export for institution B data on the reports page. This would help with our internal analysis.',
        created_at: '2024-05-10T12:00:00Z',
        updated_at: '2024-05-10T12:00:00Z',
      },
      {
        id: 'mock-message-3',
        feedback_ticket_id: 'mock-ticket-2',
        author_sub: 'support-agent',
        author_type: 'support',
        content: 'Thanks for the request, we are reviewing it',
        created_at: '2024-05-11T09:00:00Z',
        updated_at: '2024-05-11T09:00:00Z',
      },
    ],
  },
]

const categoryOptions = [
  { value: 'question', label: 'Question' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature request' },
]

export const FeedbackModal = () => {
  const [tickets, setTickets] = useState<FeedbackTicket[]>(mockTickets)
  const [institutionId, setInstitutionId] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = useMemo(() => {
    return institutionId.trim().length > 0 && message.trim().length > 0
  }, [institutionId, message])

  const handleSubmit = () => {
    if (!canSubmit) return

    const now = new Date().toISOString()
    const newTicketId = `mock-${Date.now()}`
    const newMessageId = `mock-msg-${Date.now()}`

    const newTicket: FeedbackTicket = {
      id: newTicketId,
      user_sub: mockUserSub,
      institution_id: institutionId,
      url: url || undefined,
      category: category || undefined,
      status: 'new',
      created_at: now,
      updated_at: now,
      messages: [
        {
          id: newMessageId,
          feedback_ticket_id: newTicketId,
          author_sub: mockUserSub,
          author_type: 'user',
          content: message,
          created_at: now,
          updated_at: now,
        },
      ],
    }

    setTickets((prev) => [newTicket, ...prev])
    setInstitutionId('')
    setUrl('')
    setCategory('')
    setMessage('')
  }

  return (
    <Card variant="cardSecondary" className={feedbackModalStyles.wrapper}>
      <Text variant="p1semi" className={feedbackModalStyles.sectionTitle}>
        Add feedback
      </Text>
      <div className={feedbackModalStyles.formGrid}>
        <label className={feedbackModalStyles.fieldLabel}>
          Institution ID
          <Input
            variant="dark"
            value={institutionId}
            onChange={(ev) => setInstitutionId(ev.target.value)}
            className={feedbackModalStyles.input}
            placeholder="institution id"
          />
        </label>
        <label className={feedbackModalStyles.fieldLabel}>
          URL (optional)
          <Input
            variant="dark"
            value={url}
            onChange={(ev) => setUrl(ev.target.value)}
            className={feedbackModalStyles.input}
            placeholder="https://..."
          />
        </label>
        <label className={feedbackModalStyles.fieldLabel}>
          Category
          <PillSelector
            options={categoryOptions}
            defaultSelected={categoryOptions[0].value}
            onSelect={(nextCategory) => setCategory(nextCategory)}
          />
        </label>
        <label className={feedbackModalStyles.fieldLabel}>
          Message
          <textarea
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            className={feedbackModalStyles.textarea}
            rows={4}
            placeholder="Describe the issue or request"
          />
        </label>
      </div>
      <Button
        variant="primarySmall"
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          margin: '0 auto 60px auto',
        }}
      >
        Submit feedback
      </Button>

      <Text variant="p1semi" className={feedbackModalStyles.sectionTitle}>
        Your feedback threads
      </Text>
      <div className={feedbackModalStyles.ticketsList}>
        {tickets.map((ticket) => (
          <div key={ticket.id} className={feedbackModalStyles.ticketCard}>
            <div className={feedbackModalStyles.ticketMeta}>
              <div className={feedbackModalStyles.ticketMetaRow}>
                <div className={feedbackModalStyles.metaLabel}>
                  {ticket.messages[0].content.slice(0, 40)}...
                </div>
                <div className={feedbackModalStyles.metaValue}>
                  {dayjs(ticket.created_at).format(CHART_TIMESTAMP_FORMAT_SHORT)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
