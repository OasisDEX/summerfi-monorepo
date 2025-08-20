'use client'
import { type FC, useState } from 'react'
import {
  AllocationBar,
  Button,
  Card,
  Icon,
  Text,
  Timeframes,
  VaultExposure,
} from '@summerfi/app-earn-ui'
import {
  type InterestRates,
  type SDKVaultType,
  type TimeframesItem,
  type TimeframesType,
  type VaultApyData,
} from '@summerfi/app-types'

import { getArksAllocation } from './get-arks-allocation'

import styles from './PanelVaultExposure.module.css'

const timeframes: TimeframesItem = {
  '7d': true,
  '30d': true,
  '90d': true,
  '6m': true,
  '1y': true,
  '3y': true,
}

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
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframesType>('7d')

  const handleExportToCSV = () => {
    // TODO: Implement export to CSV
    // eslint-disable-next-line no-console
    console.log('Export to CSV')
  }

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
        <div className={styles.panelVaultExposureHeader}>
          <Timeframes
            timeframes={timeframes}
            activeTimeframe={activeTimeframe}
            setActiveTimeframe={setActiveTimeframe}
          />
          <Button
            variant="secondaryLarge"
            className={styles.headerButton}
            onClick={handleExportToCSV}
          >
            <Icon iconName="sign_out" size={25} />
            Export to CSV
          </Button>
        </div>
        <VaultExposure
          vault={vault}
          arksInterestRates={arkInterestRates}
          vaultApyData={vaultApyData}
          columnsToHide={columnsToHide}
        />
      </Card>
    </Card>
  )
}
