import { Card, LoadingSpinner, Table, Text } from '@summerfi/app-earn-ui'

import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { allTimeframesNotAvailable } from '@/helpers/timeframes'

import styles from './PanelOverview.module.css'

export const PanelOverviewLoading = () => {
  return (
    <Card variant="cardSecondary" className={styles.panelOverviewWrapper}>
      <div className={styles.panelOverviewItem}>
        <div className={styles.panelOverviewHeader}>
          <Text as="h5" variant="h5">
            Performance
          </Text>
          <ChartHeader
            timeframes={allTimeframesNotAvailable}
            wrapperStyle={{
              width: '70%',
              justifyContent: 'space-between',
            }}
            checkboxValue
            checkboxLabel="Show ark APYs"
          />
        </div>
        <Card>
          <div
            style={{
              height: '270px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingSpinner size={40} style={{ margin: '100px auto', display: 'block' }} />
          </div>
        </Card>
        <Text as="h5" variant="h5">
          APY
        </Text>
        <Card>
          <div
            style={{
              height: '270px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingSpinner size={40} style={{ margin: '100px auto', display: 'block' }} />
          </div>
        </Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          AUM
        </Text>
        <Card>
          <div
            style={{
              height: '270px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingSpinner size={40} style={{ margin: '100px auto', display: 'block' }} />
          </div>
        </Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          Contracts
        </Text>
        <Card>
          <Table
            columns={[
              {
                key: 'contract',
                title: 'Contract',
              },
              {
                key: 'address',
                title: 'Address',
              },
            ]}
            rows={[
              {
                content: {
                  contract: 'Fleet',
                  address: <span style={{ fontFamily: 'monospace' }}>-</span>,
                },
              },
              {
                content: {
                  contract: 'Admirals Quarters',
                  address: <span style={{ fontFamily: 'monospace' }}>-</span>,
                },
              },
              {
                content: {
                  contract: 'Harbor Command',
                  address: <span style={{ fontFamily: 'monospace' }}>-</span>,
                },
              },
            ]}
          />
        </Card>
      </div>
    </Card>
  )
}
