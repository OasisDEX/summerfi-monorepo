'use client'
import { Text } from '@summerfi/app-earn-ui'

import styles from './BridgeFormTitle.module.scss'

const BridgeFormTitle = () => {
  return (
    <div className={styles.titleWrapper}>
      <Text variant="h5" as="h5">
        Bridge{' '}
        <Text variant="p1colorful" className={styles.sumr}>
          $SUMR
        </Text>
      </Text>
    </div>
  )
}

export default BridgeFormTitle
