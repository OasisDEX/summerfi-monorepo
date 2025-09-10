import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'

import { EditSummaryBox } from '@/components/molecules/EditSummaryBox/EditSummaryBox'

import styles from './EditSummaryChange.module.css'

interface EditSummaryChangeProps {
  title: string
  change: {
    from: string
    to: string
  }
}

export const EditSummaryChange: FC<EditSummaryChangeProps> = ({ title, change }) => {
  return (
    <div className={styles.editSummaryChange}>
      <Text as="p" variant="p3semi">
        {title}
      </Text>
      <div className={styles.boxWrapper}>
        <EditSummaryBox type="from" value={change.from} />
        <div className={styles.arrowWrapper}>
          <Icon iconName="arrow_forward_colorful" size={20} />
        </div>
        <EditSummaryBox type="to" value={change.to} />
      </div>
    </div>
  )
}
