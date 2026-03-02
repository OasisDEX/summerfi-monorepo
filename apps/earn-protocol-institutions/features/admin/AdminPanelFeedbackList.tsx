import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { rootAdminGetFeedbackList } from '@/app/server-handlers/admin/institution'

import styles from './AdminPanelFeedbackList.module.css'

// Component: Feedback card
const FeedbackCard = ({
  feedback,
}: {
  feedback: Awaited<ReturnType<typeof rootAdminGetFeedbackList>>[number]
}) => (
  <Link
    key={`${feedback.authorSub}-${feedback.id}`}
    href={`/admin/feedback/${feedback.institutionId}/${feedback.id}`}
    className={styles.feedbackCardLink}
  >
    <div className={styles.feedbackCard}>
      <div className={styles.feedbackCardHeader}>
        <div className={styles.feedbackIdSection}>
          <span className={styles.feedbackId}>#{feedback.id}</span>
        </div>
        <div className={styles.feedbackMeta}>
          <span className={`${styles.feedbackStatus} ${styles[`status_${feedback.status}`]}`}>
            {feedback.status}
          </span>
          <span className={styles.feedbackCategory}>{feedback.category?.replaceAll('-', ' ')}</span>
        </div>
      </div>

      <div className={styles.feedbackCardBody}>
        <div className={styles.feedbackAuthor}>
          <Text variant="p3semi">{feedback.authorName}</Text>
        </div>
        <div className={styles.feedbackPreview}>
          <Text variant="p4">{feedback.content.slice(0, 60)}...</Text>
        </div>
      </div>
    </div>
  </Link>
)

const AdminFeedbackList = ({
  feedbackList,
}: {
  feedbackList: Awaited<ReturnType<typeof rootAdminGetFeedbackList>>
}) => {
  return (
    <div className={styles.blocksContainer}>
      {feedbackList.length === 0 ? (
        <div className={styles.emptyState}>
          <Text>No feedback submitted yet.</Text>
        </div>
      ) : (
        feedbackList.map((feedback) => (
          <FeedbackCard key={`${feedback.authorSub}-${feedback.id}`} feedback={feedback} />
        ))
      )}
    </div>
  )
}

export const AdminPanelFeedbackList = async () => {
  const [feedbackList] = await Promise.all([rootAdminGetFeedbackList()])

  return (
    <div className={styles.container}>
      <AdminFeedbackList feedbackList={feedbackList} />
    </div>
  )
}
