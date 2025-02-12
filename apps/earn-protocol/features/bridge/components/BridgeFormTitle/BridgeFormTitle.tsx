'use client'
import { Text } from '@summerfi/app-earn-ui'

import styles from './BridgeFormTitle.module.scss'

export const BridgeFormTitle = () => {
  return (
    <div className={styles.titleWrapper}>
      <Text variant="h5semi" as="h5">
        Bridge{' '}
        <Text variant="p1colorful" className={styles.sumr}>
          $SUMR
        </Text>
      </Text>
      {/* <Text variant="p3semi" className={styles.subtitle}>
        Transfer $SUMR between networks
      </Text> */}
    </div>
  )
}

export default BridgeFormTitle
