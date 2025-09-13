import { type FC } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'

import { EditSummaryChange } from '@/components/molecules/EditSummaryChange/EditSummaryChange'
import { EditSummaryListChange } from '@/components/molecules/EditSummaryListChange/EditSummaryListChange'

import styles from './EditSummary.module.css'

interface EditSummaryProps {
  title: string
  change: (
    | {
        title: string
        from: string
        to: string
      }
    | {
        title: string
        items: {
          title: string
          from: string
          to: string
        }[]
      }
  )[]
  onCancel: () => void
  onConfirm: () => void
}

export const EditSummary: FC<EditSummaryProps> = ({ title, change, onCancel, onConfirm }) => {
  if (Array.isArray(change) && change.length === 0) {
    return null
  }

  const numberOfChanges = change.reduce((acc, item) => {
    if ('items' in item) {
      return acc + item.items.length
    }

    return acc + 1
  }, 0)

  return (
    <div className={styles.editSummary}>
      <Text as="p" variant="p1semi">
        {title}
      </Text>
      {change.map((item) => {
        if ('items' in item) {
          return <EditSummaryListChange key={item.title} title={item.title} change={item.items} />
        }

        return <EditSummaryChange key={item.title} title={item.title} change={item} />
      })}

      <div className={styles.buttons}>
        <Button variant="secondaryMedium" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primaryMedium" onClick={onConfirm}>
          Confirm ({numberOfChanges} changes)
        </Button>
      </div>
    </div>
  )
}
