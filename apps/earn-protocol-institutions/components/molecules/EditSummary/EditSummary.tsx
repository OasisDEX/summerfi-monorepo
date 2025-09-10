import { type FC } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'

import { EditSummaryChange } from '@/components/molecules/EditSummaryChange/EditSummaryChange'

import styles from './EditSummary.module.css'

interface EditSummaryProps {
  title: string
  change: {
    title: string
    from: string
    to: string
  }[]
  onCancel: () => void
  onConfirm: () => void
}

export const EditSummary: FC<EditSummaryProps> = ({ title, change, onCancel, onConfirm }) => {
  return (
    <div className={styles.editSummary}>
      <Text as="p" variant="p1semi">
        {title}
      </Text>
      {change.map((item) => (
        <EditSummaryChange key={item.title} title={item.title} change={item} />
      ))}

      <div className={styles.buttons}>
        <Button variant="secondaryMedium" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primaryMedium" onClick={onConfirm}>
          Confirm ({change.length} changes)
        </Button>
      </div>
    </div>
  )
}
