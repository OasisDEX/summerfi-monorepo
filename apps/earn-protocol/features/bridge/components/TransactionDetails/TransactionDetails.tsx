'use client'
import { InfoBox, Text } from '@summerfi/app-earn-ui'
import styles from './TransactionDetails.module.scss'

export const TransactionDetails = () => {
  return (
    <div className={styles.infoBox}>
      <InfoBox title="Important Info">
        <Text as="p" variant="p3">
          Bridging fee estimates, network delays, and other vital information will be shown here.
        </Text>
      </InfoBox>
    </div>
  )
}
