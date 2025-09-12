import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import styles from './EditSummaryListBox.module.css'

interface EditSummaryListBoxProps {
  change: {
    title: string
    from: string
    to: string
  }[]
  type: 'from' | 'to'
}

export const EditSummaryListBox: FC<EditSummaryListBoxProps> = ({ change, type }) => {
  return (
    <Card className={styles.editSummaryListBox} variant="cardPrimary">
      {change.map((item) => (
        <div key={item.title} className={styles.item}>
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            {item.title} {type === 'from' ? 'before' : 'after'}
          </Text>
          <Text as="p" variant="p4semi">
            {type === 'from' ? item.from : item.to}
          </Text>
        </div>
      ))}
    </Card>
  )
}
