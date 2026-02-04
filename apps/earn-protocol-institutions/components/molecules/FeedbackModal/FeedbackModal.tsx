/* eslint-disable camelcase */
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  LoadingSpinner,
  PillSelector,
  SkeletonLine,
  SUCCESS_TOAST_CONFIG,
  Text,
} from '@summerfi/app-earn-ui'
import { type FeedbackCategory } from '@summerfi/summer-protocol-institutions-db'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { capitalize } from 'lodash-es'
import { usePathname } from 'next/navigation'

import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'
import { useInstitutionUser } from '@/hooks/useInstitutionUser'
import {
  feedbackCategoryOptions,
  type FeedbackPostData,
  type FeedbackThreadDetails,
  type FeedbackThreadItem,
} from '@/types/feedback'

import feedbackModalStyles from './FeedbackModal.module.css'

dayjs.extend(relativeTime)

const defaultCategory: FeedbackCategory = 'question'

const loadFeedbackThreadsQuery = async (institutionId: string) => {
  const res = await fetch(`/api/user/feedback?institutionId=${institutionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  return data as FeedbackThreadItem[]
}

const loadFeedbackDetailsQuery = async (institutionId: string, threadId: string) => {
  const res = await fetch(
    `/api/user/feedback?institutionId=${institutionId}&threadId=${threadId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await res.json()

  return data as FeedbackThreadDetails
}

const handleAddFeedbackResponseQuery = async (feedbackData: FeedbackPostData) => {
  return await fetch('/api/user/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  }).then((response) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!response) {
      return {
        success: false,
      }
    }
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error('Feedback submission failed:', response.statusText)

      return {
        success: false,
      }
    }

    return {
      success: true,
    }
  })
}

const handleChangeStatusQuery = async (feedbackData: FeedbackPostData) => {
  return await fetch('/api/user/feedback', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  }).then((response) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!response) {
      return {
        success: false,
      }
    }
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error('Feedback status change failed:', response.statusText)

      return {
        success: false,
      }
    }

    return {
      success: true,
    }
  })
}

const AddFeedbackForm = ({ onSubmitted }: { onSubmitted?: () => void }) => {
  const pathname = usePathname()
  const [category, setCategory] = useState<FeedbackCategory>(defaultCategory)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const canSubmit = useMemo(() => {
    return message.trim().length >= 10 && !isSubmitting
  }, [message, isSubmitting])

  const handleSubmit = () => {
    if (!canSubmit) return

    const ticketPayload: FeedbackPostData = {
      url: pathname,
      category,
      content: message,
    }

    setIsSubmitting(true)
    handleAddFeedbackResponseQuery(ticketPayload)
      .then((result) => {
        if (result.success) {
          toast.success('Feedback submitted successfully', SUCCESS_TOAST_CONFIG)
        } else {
          toast.error('Feedback submission failed', ERROR_TOAST_CONFIG)
        }
      })
      .finally(() => {
        setIsSubmitting(false)
        setCategory(defaultCategory)
        setMessage('')
        setTimeout(() => onSubmitted && onSubmitted(), 200)
      })
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <Text variant="p2semi">Add feedback</Text>
        <PillSelector
          options={feedbackCategoryOptions}
          defaultSelected={defaultCategory}
          onSelect={(nextCategory) => setCategory(nextCategory as FeedbackCategory)}
        />
      </div>
      <div className={feedbackModalStyles.formGrid}>
        <label className={feedbackModalStyles.fieldLabel}>
          <textarea
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            className={feedbackModalStyles.textarea}
            rows={4}
            placeholder="Describe the issue or request (min 10 characters)..."
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
        {isSubmitting ? (
          <LoadingSpinner />
        ) : (
          `Submit ${category.replaceAll('-', ' ').toLowerCase()}`
        )}
      </Button>
    </div>
  )
}

const AddResponseForm = ({
  onSubmitted,
  threadId,
}: {
  onSubmitted?: () => void
  threadId: string
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const canSubmit = useMemo(() => {
    return message.trim().length >= 10 && !isSubmitting
  }, [message, isSubmitting])

  const handleSubmit = () => {
    if (!canSubmit) return

    const ticketPayload: FeedbackPostData = {
      feedbackResponseId: threadId,
      content: message,
    }

    setIsSubmitting(true)
    handleAddFeedbackResponseQuery(ticketPayload)
      .then((result) => {
        if (result.success) {
          toast.success('Feedback response submitted successfully', SUCCESS_TOAST_CONFIG)
        } else {
          toast.error('Feedback response submission failed', ERROR_TOAST_CONFIG)
        }
      })
      .finally(() => {
        setIsSubmitting(false)
        setMessage('')
        setTimeout(() => onSubmitted && onSubmitted(), 200)
      })
  }

  return (
    <div
      className={feedbackModalStyles.ticketRepliesWrapper}
      style={{ paddingTop: 0, gap: '12px' }}
    >
      <label className={feedbackModalStyles.fieldLabel}>
        <textarea
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          className={feedbackModalStyles.textarea}
          rows={4}
          disabled={isSubmitting}
          placeholder="Write your response here (min 10 characters)..."
        />
      </label>
      <Button
        variant="primarySmall"
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          margin: '0 auto',
        }}
      >
        {isSubmitting ? <LoadingSpinner /> : `Submit response`}
      </Button>
    </div>
  )
}

const TicketMessage = ({ message }: { message: FeedbackThreadItem }) => {
  return (
    <div className={feedbackModalStyles.ticketReply}>
      {message.authorType === 'system' ? (
        <div className={feedbackModalStyles.ticketReplySystemBar}>
          <Text variant="p4">{message.content}</Text>
          <Text variant="p4" style={{ marginBottom: 4 }}>
            {dayjs(message.createdAt).format(CHART_TIMESTAMP_FORMAT_DETAILED)}
          </Text>
        </div>
      ) : (
        <>
          <div className={feedbackModalStyles.ticketReplyStatusBar}>
            <Text variant="p4semi">
              {message.authorName}&nbsp;
              <Text variant="p4" as="span" style={{ fontWeight: 400, opacity: 0.7 }}>
                ({message.authorEmail})
              </Text>
            </Text>
            <Text variant="p4" style={{ marginBottom: 4 }}>
              {dayjs(message.createdAt).format(CHART_TIMESTAMP_FORMAT_DETAILED)}
            </Text>
          </div>
          <Text variant="p3" className={feedbackModalStyles.messageContent}>
            {message.content}
          </Text>
        </>
      )}
    </div>
  )
}

const TicketDetails = ({
  ticket,
  goToList,
}: {
  ticket: FeedbackThreadItem
  goToList: () => void
}) => {
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [details, setDetails] = useState<FeedbackThreadDetails | null>(null)

  const ticketRootData = useMemo(() => {
    if (details?.thread) {
      return details.thread
    }

    return ticket
  }, [details?.thread, ticket])

  useEffect(() => {
    setIsLoadingDetails(true)
    loadFeedbackDetailsQuery(ticket.institutionId.toString(), ticket.id.toString()).then((data) => {
      setIsLoadingDetails(false)
      setDetails(data)
    })
  }, [ticket.institutionId, ticket.id])

  const wasUpdated = dayjs(ticketRootData.updatedAt).isAfter(dayjs(ticketRootData.createdAt))

  const formatShortUrl = (url?: string | null) => {
    if (!url) return 'N/A'
    // if longer than 30 characters, shorten it
    if (url.length > 30) {
      return `${url.slice(0, 15)}...${url.slice(-10)}`
    }

    return url
  }

  const handleChangeStatus = (newStatus: FeedbackPostData['status']) => {
    const statusPayload: FeedbackPostData = {
      feedbackResponseId: ticket.id.toString(),
      status: newStatus,
    }

    setIsChangingStatus(true)
    handleChangeStatusQuery(statusPayload)
      .then((result) => {
        if (result.success) {
          toast.success('Feedback status updated successfully', SUCCESS_TOAST_CONFIG)
        } else {
          toast.error('Feedback status update failed', ERROR_TOAST_CONFIG)
        }
      })
      .finally(() => {
        setIsChangingStatus(false)
        setTimeout(() => {
          setIsLoadingDetails(true)
          loadFeedbackDetailsQuery(ticket.institutionId.toString(), ticket.id.toString()).then(
            (data) => {
              setIsLoadingDetails(false)
              setDetails(data)
            },
          )
        }, 200)
      })
  }

  return (
    <div className={feedbackModalStyles.ticketDetailsWrapper}>
      <Button variant="textPrimarySmall" onClick={goToList}>
        ← Back to list
      </Button>
      <Text variant="p2semi">Feedback #{ticketRootData.id}</Text>
      <div className={feedbackModalStyles.ticketDetails}>
        <div className={feedbackModalStyles.ticketDetailsBlock}>
          <Text variant="p4semi">
            {ticketRootData.authorName}&nbsp;(
            <Text variant="p4" as="span" style={{ fontWeight: 400 }}>
              {ticketRootData.authorEmail}
            </Text>
            )
          </Text>

          <Text variant="p4">
            Created: {dayjs(ticketRootData.createdAt).format(CHART_TIMESTAMP_FORMAT_DETAILED)}
          </Text>
          <Text variant="p4">
            Updated:{' '}
            {wasUpdated
              ? dayjs(ticketRootData.updatedAt).format(CHART_TIMESTAMP_FORMAT_DETAILED)
              : '-'}
          </Text>
        </div>
        <div className={feedbackModalStyles.ticketDetailsBlock}>
          <Text variant="p4semi">
            Category:{' '}
            {ticketRootData.category
              ? capitalize(ticketRootData.category.replaceAll('-', ' '))
              : 'N/A'}
          </Text>
          <Text variant="p4semi">
            Status:{' '}
            <select
              className={feedbackModalStyles.statusSelect}
              value={ticketRootData.status}
              disabled={isChangingStatus}
              onChange={(ev) => handleChangeStatus(ev.target.value as FeedbackPostData['status'])}
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </Text>
          <Text
            variant="p4"
            title={ticketRootData.url ?? undefined}
            style={{ fontFamily: 'monospace' }}
          >
            URL:&nbsp;{formatShortUrl(ticketRootData.url)}
          </Text>
        </div>
      </div>
      <Text variant="p2semi">Messages</Text>
      <div className={feedbackModalStyles.ticketRepliesWrapper}>
        <TicketMessage message={ticketRootData} />
        {isLoadingDetails ? (
          <LoadingSpinner
            style={{
              margin: '10px auto',
            }}
          />
        ) : (
          <>
            {details && details.messages.length > 0 ? (
              details.messages.map((message) => (
                <TicketMessage key={message.id} message={message} />
              ))
            ) : (
              <Text variant="p4" style={{ textAlign: 'center', margin: '12px auto', opacity: 0.7 }}>
                No replies yet.
              </Text>
            )}
          </>
        )}
      </div>
      <Text variant="p2semi">Reply</Text>
      <AddResponseForm
        threadId={ticket.id.toString()}
        onSubmitted={() => {
          setIsLoadingDetails(true)
          loadFeedbackDetailsQuery(ticket.institutionId.toString(), ticket.id.toString()).then(
            (data) => {
              setIsLoadingDetails(false)
              setDetails(data)
            },
          )
        }}
      />
    </div>
  )
}

const TicketItem = ({ ticket, onClick }: { ticket: FeedbackThreadItem; onClick?: () => void }) => {
  const createdAt = dayjs(ticket.createdAt)
  const updatedAt = dayjs(ticket.updatedAt)
  const isUpdated = updatedAt.isAfter(createdAt)
  const dateToShow = isUpdated ? updatedAt : createdAt

  const dateSinceFormatted = dateToShow.fromNow()

  return (
    <div key={ticket.id} className={feedbackModalStyles.ticketCard} onClick={onClick}>
      <div className={feedbackModalStyles.ticketMeta}>
        <div className={feedbackModalStyles.ticketMetaRow}>
          <div className={feedbackModalStyles.metaUser}>
            <Text variant="p4semi">
              [{ticket.status}&nbsp;{ticket.category?.replaceAll('-', ' ')}]&nbsp;
            </Text>
            <br />
            <Text variant="p4semi">{ticket.authorName}:&nbsp;</Text>
            <Text as="span" variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
              {ticket.content.slice(0, 30)}...
            </Text>
          </div>
          <div className={feedbackModalStyles.metaDate}>
            <Text variant="p4semi" as="span">
              {isUpdated ? 'Updated' : 'Created'}
            </Text>
            &nbsp;
            <Text variant="p4" as="span">
              {dateSinceFormatted}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export const FeedbackModal = () => {
  const [view, setView] = useState<'list' | 'details'>('list')
  const [threadId, setThreadId] = useState<number | null>(null)
  const { data: institutionUserData, loading: institutionUserLoading } = useInstitutionUser()
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [tickets, setTickets] = useState<FeedbackThreadItem[]>([])

  const reloadFeedbackThreads = () => {
    setIsLoadingTickets(true)
    if (institutionUserData?.user?.institutionsList?.[0]?.id) {
      loadFeedbackThreadsQuery(institutionUserData.user.institutionsList[0].id.toString()).then(
        (data) => {
          setIsLoadingTickets(false)
          setTickets(data)
        },
      )
    }
  }

  useEffect(() => {
    if (institutionUserLoading || !institutionUserData?.user?.institutionsList?.[0]?.id) return
    setIsLoadingTickets(true)
    loadFeedbackThreadsQuery(institutionUserData.user.institutionsList[0].id.toString()).then(
      (data) => {
        setIsLoadingTickets(false)
        setTickets(data)
      },
    )
  }, [institutionUserData?.user, institutionUserLoading])

  const goToTicketDetails = (selectedThreadId: number) => {
    setThreadId(selectedThreadId)
    setView('details')
  }

  const goToList = () => {
    setThreadId(null)
    setView('list')
    if (institutionUserData?.user?.institutionsList?.[0]?.id) {
      setIsLoadingTickets(true)
      loadFeedbackThreadsQuery(institutionUserData.user.institutionsList[0].id.toString()).then(
        (data) => {
          setIsLoadingTickets(false)
          setTickets(data)
        },
      )
    }
  }

  const selectedTicket = useMemo(() => {
    return tickets.find((ticket) => ticket.id === threadId) ?? null
  }, [tickets, threadId])

  return (
    <Card variant="cardSecondary" className={feedbackModalStyles.wrapper}>
      {view === 'details' && selectedTicket && (
        <TicketDetails ticket={selectedTicket} goToList={goToList} />
      )}
      {view === 'list' && (
        <>
          <Text variant="p2semi" className={feedbackModalStyles.sectionTitle}>
            Your institution feedback list
          </Text>
          <div className={feedbackModalStyles.ticketsList}>
            {isLoadingTickets ? (
              <>
                <SkeletonLine width="100%" height={35} style={{ margin: '5px auto' }} />
                <SkeletonLine width="100%" height={35} style={{ margin: '5px auto' }} />
              </>
            ) : tickets.length ? (
              tickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => goToTicketDetails(ticket.id)}
                />
              ))
            ) : (
              <Text variant="p4" style={{ textAlign: 'center', margin: '12px auto', opacity: 0.7 }}>
                No feedback submitted yet.
              </Text>
            )}
          </div>
          <AddFeedbackForm onSubmitted={reloadFeedbackThreads} />
        </>
      )}
    </Card>
  )
}
