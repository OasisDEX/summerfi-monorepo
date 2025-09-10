'use client'

import { useMemo, useState } from 'react'
import { type DateRange } from 'react-day-picker'
import { Button, Card, DateRangePicker, Table, Text, useMobileCheck } from '@summerfi/app-earn-ui'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  type InstitutionVaultActivityItem,
  InstitutionVaultActivityType,
} from '@/types/institution-data'

import { activityColumns } from './columns'
import { activityMapper } from './mapper'

import styles from './PanelActivity.module.css'

const filterByActivityType = (
  activitiesData: InstitutionVaultActivityItem[],
  activityType: InstitutionVaultActivityType,
) => activitiesData.filter((activity) => activity.type === activityType)

type PanelActivityProps = {
  activitiesData: InstitutionVaultActivityItem[]
}

export const PanelActivity = ({ activitiesData }: PanelActivityProps) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const [activeFilter, setActiveFilter] = useState<InstitutionVaultActivityType | null>(null)

  const handleDateRangeChange = (date: DateRange) => {
    setDateRange(date)
  }

  const handleToggleFilter = (filter: InstitutionVaultActivityType) => {
    if (activeFilter === filter) {
      setActiveFilter(null)
    } else {
      setActiveFilter(filter)
    }
  }

  const filters = [
    {
      label: 'Rebalances',
      value: InstitutionVaultActivityType.REBALANCE,
      onClick: () => {
        handleToggleFilter(InstitutionVaultActivityType.REBALANCE)
      },
    },
    {
      label: 'Deposits',
      value: InstitutionVaultActivityType.DEPOSIT,
      onClick: () => {
        handleToggleFilter(InstitutionVaultActivityType.DEPOSIT)
      },
    },
    {
      label: 'Withdrawals',
      value: InstitutionVaultActivityType.WITHDRAWAL,
      onClick: () => {
        handleToggleFilter(InstitutionVaultActivityType.WITHDRAWAL)
      },
    },
  ]

  const activities = useMemo(() => {
    // to do: handle filters based on date range
    if (activeFilter) {
      const filteredActivities = filterByActivityType(activitiesData, activeFilter)

      return activityMapper(filteredActivities)
    }

    return activityMapper(activitiesData)
  }, [activitiesData, activeFilter])

  return (
    <Card variant="cardSecondary" className={styles.panelActivityWrapper}>
      <Text as="h5" variant="h5">
        Activity
      </Text>
      <div className={styles.headingWrapper}>
        <DateRangePicker
          mode="range"
          isMobile={isMobile}
          onChange={handleDateRangeChange}
          selected={dateRange}
        />
        <div className={styles.filters}>
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="primarySmall"
              onClick={filter.onClick}
              className={activeFilter === filter.value ? styles.active : styles.button}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      <Card>
        <Table
          rows={activities}
          columns={activityColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
    </Card>
  )
}
