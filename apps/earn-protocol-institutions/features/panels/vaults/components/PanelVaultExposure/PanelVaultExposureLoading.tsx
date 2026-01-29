import {
  AllocationBar,
  Badge,
  Card,
  LoadingSpinner,
  Text,
  VaultExposureLoading,
} from '@summerfi/app-earn-ui'

import styles from './PanelVaultExposure.module.css'

export const PanelVaultExposureLoading = () => {
  return (
    <Card variant="cardSecondary" className={styles.panelVaultExposureWrapper}>
      <Text as="h5" variant="h5">
        Vault exposure
      </Text>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          Asset allocation
        </Text>
        <AllocationBar
          items={[
            {
              color: 'gray',
              label: 'Loading...',
              percentage: 100,
            },
          ]}
          variant="large"
        />
      </div>
      <Card className={styles.tableSection}>
        <VaultExposureLoading />
      </Card>
      <Text as="h5" variant="h5">
        Arks available on chain
      </Text>
      <Text as="p" variant="p2">
        List of arks that are currently deployed on-chain. Highlighted arks are the ones utilized by
        this vault.
      </Text>
      <Card className={styles.availableArksSection}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className={styles.sortingButtons}>
            <Text as="p" variant="p4semi">
              Sort by:
            </Text>
            <Badge value="APY" isActive />
            <Badge value={<>Protocol&nbsp;TVL</>} isActive={false} />
          </div>
          <div className={styles.sortingButtons}>
            <Text as="p" variant="p4semi">
              Filter tokens:
            </Text>
            <Badge value="-" isActive />
            <Badge value="All" isActive={false} />
          </div>
        </div>
        <div className={styles.availableArksSectionGrid}>
          {Array(12)
            .fill('')
            .map((_, index) => (
              <Card
                variant="cardSecondary"
                key={index}
                style={{
                  height: '250px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LoadingSpinner size={20} style={{ margin: '0 auto', display: 'block' }} />
              </Card>
            ))}
        </div>
      </Card>
    </Card>
  )
}
