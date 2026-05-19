import { type FC } from 'react'
import { type Metadata } from 'next'

interface DCAPositionPageProps {
  params: Promise<{ positionId: string }>
}

const DCAPositionPage: FC<DCAPositionPageProps> = async ({ params }) => {
  const { positionId } = await params

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'var(--general-space-32) var(--general-space-16)',
      }}
    >
      Reserved for DCA Position {positionId}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lazy Summer Protocol - DCA Position',
    description: 'View execution history and performance for your DCA strategy.',
  }
}

export default DCAPositionPage
