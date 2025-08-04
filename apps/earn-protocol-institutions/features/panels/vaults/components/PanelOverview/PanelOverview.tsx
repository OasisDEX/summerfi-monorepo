import { Card, Text } from '@summerfi/app-earn-ui'

import styles from './PanelOverview.module.css'

export const PanelOverview = () => {
  return (
    <Card variant="cardSecondary" className={styles.panelOverviewWrapper}>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          Performance
        </Text>
        <Card>Performance chart placeholder</Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          AUM (Bn’s)
        </Text>
        <Card>AUM chart placeholder</Card>
      </div>
    </Card>
  )
}
