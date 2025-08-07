'use client'
import { type FC, useState } from 'react'
import {
  AllocationBar,
  Button,
  Card,
  Icon,
  Text,
  Timeframes,
  useMobileCheck,
  VaultExposure,
} from '@summerfi/app-earn-ui'
import {
  type SDKVaultType,
  type TimeframesItem,
  type TimeframesType,
  type VaultApyData,
} from '@summerfi/app-types'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import styles from './PanelVaultExposure.module.css'

const timeframes: TimeframesItem = {
  '7d': true,
  '30d': true,
  '90d': true,
  '6m': true,
  '1y': true,
  '3y': true,
}

const dummyItems = [
  {
    label: 'Morpho USDC Moonwell Flagship',
    percentage: 0.3,
    color: 'var(--earn-protocol-primary-100)',
  },
  {
    label: 'Compound V3 USDC',
    percentage: 0.6,
    color: 'var(--earn-protocol-primary-70)',
  },
  {
    label: 'Euler Prime USDC',
    percentage: 0.1,
    color: 'var(--earn-protocol-primary-40)',
  },
]

interface PanelVaultExposureProps {
  vault: SDKVaultType
  arkInterestRates: GetInterestRatesReturnType
  vaultApyData: VaultApyData
}

export const PanelVaultExposure: FC<PanelVaultExposureProps> = ({
  vault,
  arkInterestRates,
  vaultApyData,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframesType>('7d')
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const handleExportToCSV = () => {
    // TODO: Implement export to CSV
    // eslint-disable-next-line no-console
    console.log('Export to CSV')
  }

  return (
    <Card variant="cardSecondary" className={styles.panelVaultExposureWrapper}>
      <Text as="h5" variant="h5">
        Vault exposure
      </Text>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          Asset allocation
        </Text>
        <AllocationBar items={dummyItems} variant="large" />
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
          isMobile={isMobile}
        />
      </Card>
    </Card>
  )
}
