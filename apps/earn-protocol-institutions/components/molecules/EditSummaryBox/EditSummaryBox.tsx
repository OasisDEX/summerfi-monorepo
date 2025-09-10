import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import styles from './EditSummaryBox.module.css'

interface EditSummaryBoxProps {
  type: 'from' | 'to'
  value: string
}

const typeToTitle = {
  from: 'From',
  to: 'To',
}

export const EditSummaryBox: FC<EditSummaryBoxProps> = ({ type, value }) => {
  return (
    <Card className={styles.editSummaryBox} variant="cardPrimary">
      <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        {typeToTitle[type]}
      </Text>
      <Text as="p" variant="p4semi">
        {value}
      </Text>
    </Card>
  )
}
