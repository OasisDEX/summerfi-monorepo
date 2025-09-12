import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'

import { EditSummaryListBox } from '@/components/molecules/EditSummaryListBox/EditSummaryListBox'

import styles from './EditSummaryListChange.module.css'

interface EditSummaryListChangeProps {
  title: string
  change: {
    title: string
    from: string
    to: string
  }[]
}

export const EditSummaryListChange: FC<EditSummaryListChangeProps> = ({ title, change }) => {
  return (
    <div className={styles.editSummaryListChange}>
      <Text as="p" variant="p3semi">
        {title}
      </Text>
      <div className={styles.boxWrapper}>
        <EditSummaryListBox change={change} type="from" />
        <div className={styles.arrowWrapper}>
          <Icon iconName="arrow_forward_colorful" size={20} />
        </div>
        <EditSummaryListBox change={change} type="to" />
      </div>
    </div>
  )
}
