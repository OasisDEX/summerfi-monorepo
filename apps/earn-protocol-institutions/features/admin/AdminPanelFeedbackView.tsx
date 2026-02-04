import { Text } from '@summerfi/app-earn-ui'

import {
  rootAdminFeedbackChangeStatus,
  rootAdminFeedbackDelete,
  rootAdminFeedbackSendResponse,
  rootAdminGetFeedbackDetails,
} from '@/app/server-handlers/admin/institution'

import styles from './AdminPanelFeedbackList.module.css'

const AdminFeedbackView = ({
  feedbackDetails,
}: {
  feedbackDetails: Awaited<ReturnType<typeof rootAdminGetFeedbackDetails>>
}) => {
  if (!feedbackDetails) return null

  const { thread, messages } = feedbackDetails

  const statusClass = styles[`status_${thread.status}` as keyof typeof styles] || ''

  const formatDate = (date: string | Date | null): string => {
    if (!date) return '—'

    const parsed = date instanceof Date ? date : new Date(date)

    return isNaN(parsed.getTime()) ? String(date) : parsed.toLocaleString()
  }

  const timeline = [{ ...thread, id: thread.threadId, isRoot: true }, ...messages]

  return (
    <div className={styles.threadContainer}>
      <div className={styles.threadCard}>
        <div className={styles.threadHeader}>
          <div>
            <Text variant="h4">Feedback #{thread.threadId}</Text>
          </div>
          <span className={`${styles.statusBadge} ${statusClass}`}>{thread.status}</span>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Author</span>
            <span className={styles.metaValue}>{thread.authorName || 'Unknown'}</span>
            <span className={styles.metaLabel}>Email</span>
            <span className={styles.metaValue}>{thread.authorEmail || '—'}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Created</span>
            <span className={styles.metaValue}>{formatDate(thread.createdAt)}</span>
            <span className={styles.metaLabel}>Updated</span>
            <span className={styles.metaValue}>{formatDate(thread.updatedAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue}>{thread.category}</span>
            <span className={styles.metaLabel}>URL</span>
            <span className={styles.metaValue}>{thread.url || '—'}</span>
          </div>
        </div>

        <div className={styles.messageContent}>
          <span className={styles.metaLabel}>Initial content</span>
          <pre className={styles.contentBlock}>{thread.content}</pre>
        </div>
      </div>

      <div className={styles.messagesList}>
        {timeline.map((message) => (
          <div key={message.id} className={styles.messageCard}>
            <div className={styles.messageHeader}>
              <div>
                <div className={styles.messageAuthor}>
                  {message.authorName || message.authorType}
                </div>
                {message.authorType !== 'system' && (
                  <div className={styles.messageMetaRow}>
                    <span>{message.authorEmail || 'No email'}</span>
                    <span>{message.authorType}</span>
                  </div>
                )}
              </div>
              <div className={styles.messageTimestamp}>{formatDate(message.createdAt)}</div>
            </div>
            <pre className={styles.contentBlock}>{message.content}</pre>
          </div>
        ))}
      </div>

      <div className={styles.statusActions}>
        Quick actions:
        <form method="post" action={rootAdminFeedbackChangeStatus}>
          <input type="hidden" name="threadId" value={thread.threadId} />
          <input type="hidden" name="institutionId" value={thread.institutionId} />
          <input type="hidden" name="status" value="closed" />
          <button
            type="button"
            className={styles.statusButton}
            disabled={thread.status === 'closed'}
            style={
              thread.status === 'closed'
                ? {
                    opacity: 0.5,
                    pointerEvents: 'none',
                    cursor: 'not-allowed',
                  }
                : undefined
            }
          >
            Close
          </button>
        </form>
        <form method="post" action={rootAdminFeedbackChangeStatus}>
          <input type="hidden" name="threadId" value={thread.threadId} />
          <input type="hidden" name="institutionId" value={thread.institutionId} />
          <input type="hidden" name="status" value="in-progress" />
          <button
            type="submit"
            className={styles.statusButton}
            disabled={thread.status === 'in-progress'}
            style={
              thread.status === 'in-progress'
                ? {
                    opacity: 0.5,
                    pointerEvents: 'none',
                    cursor: 'not-allowed',
                  }
                : undefined
            }
          >
            In Progress
          </button>
        </form>
        <form method="post" action={rootAdminFeedbackChangeStatus}>
          <input type="hidden" name="threadId" value={thread.threadId} />
          <input type="hidden" name="institutionId" value={thread.institutionId} />
          <input type="hidden" name="status" value="resolved" />
          <button
            type="submit"
            className={styles.statusButton}
            disabled={thread.status === 'resolved'}
            style={
              thread.status === 'resolved'
                ? {
                    opacity: 0.5,
                    pointerEvents: 'none',
                    cursor: 'not-allowed',
                  }
                : undefined
            }
          >
            Resolve
          </button>
        </form>
        <form method="post" action={rootAdminFeedbackDelete}>
          <input type="hidden" name="threadId" value={thread.threadId} />
          <input type="hidden" name="institutionId" value={thread.institutionId} />
          <button
            type="submit"
            className={styles.statusButton}
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
              color: '#fff',
            }}
          >
            Delete this
          </button>
        </form>
      </div>

      <form className={styles.replyForm} method="post" action={rootAdminFeedbackSendResponse}>
        <input type="hidden" name="threadId" value={thread.threadId} />
        <input type="hidden" name="institutionId" value={thread.institutionId} />
        <label className={styles.replyLabel}>
          Add message
          <textarea
            name="content"
            placeholder="Write a reply to this thread"
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
