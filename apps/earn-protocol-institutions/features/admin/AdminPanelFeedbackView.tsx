import { Text } from '@summerfi/app-earn-ui'
import { capitalize } from 'lodash-es'

import {
  rootAdminFeedbackChangeStatus,
  rootAdminFeedbackDelete,
  rootAdminFeedbackSendResponse,
  rootAdminGetFeedbackDetails,
} from '@/app/server-handlers/admin/institution'

import styles from './AdminPanelFeedbackList.module.css'

// Helper: Format date consistently
const formatDate = (date: string | Date | null): string => {
  if (!date) return '—'

  const parsed = date instanceof Date ? date : new Date(date)

  return isNaN(parsed.getTime()) ? String(date) : parsed.toLocaleString()
}

// Component: Status action button
const StatusActionButton = ({
  isDisabled,
  isDangerous,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & {
  isDisabled?: boolean
  isDangerous?: boolean
}) => (
  <button
    type="submit"
    className={`${styles.statusButton} ${isDisabled ? styles.statusButtonDisabled : ''} ${isDangerous ? styles.statusButtonDangerous : ''}`}
    disabled={isDisabled}
    {...props}
  >
    {children}
  </button>
)

// Component: Metadata section
const MetadataSection = ({
  thread,
}: {
  thread: Exclude<Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>, null>['thread']
}) => (
  <div className={styles.metadataSection}>
    <div className={styles.metaGrid}>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Author</span>
        <span className={styles.metaValue}>{thread.authorName ?? 'Unknown'}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Email</span>
        <span className={styles.metaValue}>{thread.authorEmail ?? '—'}</span>
      </div>
    </div>
    <div className={styles.metaGrid}>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Created</span>
        <span className={styles.metaValue}>{formatDate(thread.createdAt)}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Updated</span>
        <span className={styles.metaValue}>{formatDate(thread.updatedAt)}</span>
      </div>
    </div>
    <div className={styles.metaGrid}>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Category</span>
        <span className={styles.metaValue}>{thread.category}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>URL</span>
        <span className={styles.metaValue}>{thread.url ?? '—'}</span>
      </div>
    </div>
  </div>
)

// Component: Message timeline
const MessageTimeline = ({
  thread,
  messages,
}: {
  thread: Exclude<Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>, null>['thread']
  messages: Exclude<Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>, null>['messages']
}) => {
  const timeline = [{ ...thread, id: thread.threadId, isRoot: true }, ...messages]

  return (
    <div className={styles.timelineSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Conversation</span>
      </div>
      <div className={styles.messagesList}>
        {timeline.map((message) => (
          <div key={message.id} className={styles.messageCard}>
            <div className={styles.messageHeader}>
              <div>
                <div className={styles.messageAuthor}>
                  {message.authorName ?? message.authorType}
                </div>
                {message.authorType !== 'system' && (
                  <div className={styles.messageMetaRow}>
                    <span>{message.authorEmail ?? 'No email'}</span>
                    <span className={styles.authorTypeBadge}>{message.authorType}</span>
                  </div>
                )}
              </div>
              <div className={styles.messageTimestamp}>{formatDate(message.createdAt)}</div>
            </div>
            <pre className={styles.contentBlock}>{message.content}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}

// Component: Status actions
const StatusActions = ({
  thread,
  institutionId,
}: {
  thread: Exclude<Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>, null>['thread']
  institutionId: string | number
}) => (
  <div className={styles.actionsSection}>
    <div className={styles.sectionHeader}>
      <span className={styles.sectionLabel}>Status</span>
    </div>
    <div className={styles.statusActionsList}>
      <form action={rootAdminFeedbackChangeStatus}>
        <input type="hidden" name="threadId" value={thread.threadId} />
        <input type="hidden" name="institutionId" value={String(institutionId)} />
        <input type="hidden" name="newStatus" value="in-progress" />
        <StatusActionButton isDisabled={thread.status === 'in-progress'}>
          In Progress
        </StatusActionButton>
      </form>
      <form action={rootAdminFeedbackChangeStatus}>
        <input type="hidden" name="threadId" value={thread.threadId} />
        <input type="hidden" name="institutionId" value={String(institutionId)} />
        <input type="hidden" name="newStatus" value="resolved" />
        <StatusActionButton isDisabled={thread.status === 'resolved'}>Resolve</StatusActionButton>
      </form>
      <form action={rootAdminFeedbackChangeStatus}>
        <input type="hidden" name="threadId" value={thread.threadId} />
        <input type="hidden" name="institutionId" value={String(institutionId)} />
        <input type="hidden" name="newStatus" value="closed" />
        <StatusActionButton isDisabled={thread.status === 'closed'}>Close</StatusActionButton>
      </form>
      <form action={rootAdminFeedbackDelete}>
        <input type="hidden" name="threadId" value={thread.threadId} />
        <input type="hidden" name="institutionId" value={String(institutionId)} />
        <StatusActionButton isDangerous>Delete</StatusActionButton>
      </form>
    </div>
  </div>
)

// Component: Reply form
const ReplyForm = ({
  thread,
  institutionId,
}: {
  thread: Exclude<Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>, null>['thread']
  institutionId: string | number
}) => (
  <form className={styles.replySection} action={rootAdminFeedbackSendResponse}>
    <div className={styles.sectionHeader}>
      <span className={styles.sectionLabel}>Add Response</span>
    </div>
    <input type="hidden" name="threadId" value={thread.threadId} />
    <input type="hidden" name="institutionId" value={String(institutionId)} />
    <label className={styles.replyLabel}>
      <textarea
        name="content"
        placeholder="Write a reply to this thread…"
        className={styles.replyTextarea}
        required
      />
    </label>
    <div className={styles.replyActions}>
      <button type="submit" className={styles.submitButton}>
        Send message
      </button>
    </div>
  </form>
)

const AdminFeedbackView = ({
  feedbackDetails,
}: {
  feedbackDetails: Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>
}) => {
  if (!feedbackDetails) return null

  const { thread, messages } = feedbackDetails
  const statusClass = styles[`status_${thread.status}` as keyof typeof styles] || ''

  return (
    <div className={styles.threadContainer}>
      {/* Header */}
      <div className={styles.threadCard}>
        <div className={styles.threadHeader}>
          <Text variant="h4">
            {capitalize(thread.category ?? 'feedback')} #{thread.threadId}
          </Text>
          <span className={`${styles.statusBadge} ${statusClass}`}>{thread.status}</span>
        </div>
      </div>

      {/* Initial message */}
      <div className={styles.threadCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Initial Message</span>
        </div>
        <pre className={styles.contentBlock}>{thread.content}</pre>
      </div>

      {/* Metadata */}
      <div className={styles.threadCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Details</span>
        </div>
        <MetadataSection thread={thread} />
      </div>

      {/* Timeline */}
      <div className={styles.threadCard}>
        <MessageTimeline thread={thread} messages={messages} />
      </div>

      {/* Actions */}
      <div className={styles.threadCard}>
        <StatusActions thread={thread} institutionId={thread.institutionId} />
      </div>

      {/* Reply */}
      <div className={styles.threadCard}>
        <ReplyForm thread={thread} institutionId={thread.institutionId} />
      </div>
    </div>
  )
}

export const AdminPanelFeedbackView = async ({
  threadId,
  institutionId,
}: {
  threadId: string
  institutionId: string
}) => {
  if (!threadId || isNaN(Number(threadId))) {
    throw new Error('threadId is required')
  }
  const [feedbackDetails] = await Promise.all([
    rootAdminGetFeedbackDetails(threadId, institutionId),
  ])

  if (!feedbackDetails) {
    return (
      <div className={styles.container}>
        <Text>Feedback thread not found.</Text>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <AdminFeedbackView feedbackDetails={feedbackDetails} />
    </div>
  )
}
