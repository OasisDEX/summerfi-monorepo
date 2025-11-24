'use client'
import { type FC } from 'react'
import { AllocationBar, Card, Text, VaultExposure } from '@summerfi/app-earn-ui'
import { type InterestRates, type SDKVaultType, type VaultApyData } from '@summerfi/app-types'

import { getArksAllocation } from './get-arks-allocation'

import styles from './PanelVaultExposure.module.css'

const columnsToHide = ['yearlyLow', 'yearlyHigh', 'avgApy1y']

interface PanelVaultExposureProps {
  vault: SDKVaultType
  arkInterestRates: InterestRates
  vaultApyData: VaultApyData
}

export const PanelVaultExposure: FC<PanelVaultExposureProps> = ({
  vault,
  arkInterestRates,
  vaultApyData,
}) => {
  const allocation = getArksAllocation(vault)

  return (
    <Card variant="cardSecondary" className={styles.panelVaultExposureWrapper}>
      <Text as="h5" variant="h5">
        Vault exposure
      </Text>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          Asset allocation
        </Text>
        <AllocationBar items={allocation} variant="large" />
      </div>
      <Card className={styles.tableSection}>
        <VaultExposure
          vault={vault}
          arksInterestRates={arkInterestRates}
          vaultApyData={vaultApyData}
          columnsToHide={columnsToHide}
          tableId="vault-exposure"
          buttonClickEventHandler={() => {}}
        />
      </Card>
    </Card>
  )
}
