import { Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { rootAdminGetFeedbackList } from '@/app/server-handlers/admin/institution'

import styles from './AdminPanelFeedbackList.module.css'

const AdminFeedbackList = ({
  feedbackList,
}: {
  feedbackList: Awaited<ReturnType<typeof rootAdminGetFeedbackList>>
}) => {
  return (
    <div className={styles.blocksContainer}>
      {feedbackList.length === 0 ? (
        <Text>No feedback submitted yet.</Text>
      ) : (
        <>
          {feedbackList.map((feedback) => {
            const key = `${feedback.authorSub}-${feedback.id}-${Math.random()}`

            return (
              <Link key={key} href={`/admin/feedback/${feedback.institutionId}/${feedback.id}`}>
                <Card style={{ flexDirection: 'column', gap: '12px', padding: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '24px',
                    }}
                  >
                    <Text variant="h4semi">#{feedback.id}</Text>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Text variant="p3semi">{feedback.status}</Text>
                      <Text variant="p3semi">{feedback.category?.replaceAll('-', ' ')}</Text>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Text variant="p3semi">{feedback.authorName}</Text>
                      <Text variant="p4">{feedback.content.slice(0, 40)}...</Text>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </>
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
