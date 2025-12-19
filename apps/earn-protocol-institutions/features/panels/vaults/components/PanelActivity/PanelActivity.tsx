'use client'

import { useMemo, useState } from 'react'
import { Button, Card, Icon, LoadingSpinner, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

import { CHART_TIMESTAMP_FORMAT_SHORT } from '@/features/charts/helpers'
import { mapActivityDataToTable } from '@/features/panels/vaults/components/PanelActivity/mapper'
import {
  type ActivityTableColumns,
  InstitutionVaultActivityType,
} from '@/features/panels/vaults/components/PanelActivity/types'
import { type GetVaultActivityLogByTimestampFromQuery } from '@/graphql/clients/vault-history/client'

import { activityColumns } from './columns'

import styles from './PanelActivity.module.css'

type PanelActivityProps = {
  activityLogBaseDataRaw: GetVaultActivityLogByTimestampFromQuery['vault']
  vault: SDKVaultishType
  institutionName: string
}

export const PanelActivity = ({
  activityLogBaseDataRaw,
  vault,
  institutionName,
}: PanelActivityProps) => {
  const { refresh: refreshView } = useRouter()
  const [isLoadingNextWeek, setIsLoadingNextWeek] = useState(false)
  const [loadedWeeksNumber, setLoadedWeeksNumber] = useState(0)
  const [loadedAdditionalActivityLogData, setLoadedAdditionalActivityLogData] = useState<
    GetVaultActivityLogByTimestampFromQuery['vault'][]
  >([])
  const [activeFilter, setActiveFilter] = useState<InstitutionVaultActivityType | null>(null)
  const chainId = subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))

  const activityLogDataTable = useMemo(() => {
    const mergedData = mapActivityDataToTable({
      data: activityLogBaseDataRaw,
      vaultToken: vault.inputToken,
    }).concat(
      ...loadedAdditionalActivityLogData.map((data) =>
        mapActivityDataToTable({ data, vaultToken: vault.inputToken }),
      ),
    )
    const mergedAndFilteredData = activeFilter
      ? mergedData.filter((item) => item.content.type?.toString().toLowerCase() === activeFilter)
      : mergedData

    return mergedAndFilteredData
  }, [activeFilter, activityLogBaseDataRaw, loadedAdditionalActivityLogData, vault.inputToken])

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
    {
      label: 'Risk Changes',
      value: InstitutionVaultActivityType.RISK_CHANGE,
      onClick: () => {
        handleToggleFilter(InstitutionVaultActivityType.RISK_CHANGE)
      },
    },
  ]

  const loadedDateRangeArray = useMemo(() => {
    return {
      from: dayjs().format(CHART_TIMESTAMP_FORMAT_SHORT),
      to: dayjs()
        .subtract(loadedWeeksNumber + 1, 'weeks')
        .format(CHART_TIMESTAMP_FORMAT_SHORT),
    }
  }, [loadedWeeksNumber])

  const vaultInceptionDate = dayjs(Number(vault.createdTimestamp) * 1000)

  const isLoadedToDateHigherThanInceptionDate = useMemo(() => {
    const loadedToDate = dayjs().subtract(loadedWeeksNumber + 1, 'weeks')

    return loadedToDate.isBefore(vaultInceptionDate)
  }, [loadedWeeksNumber, vaultInceptionDate])

  const loadAnotherWeekActivityLog = () => {
    try {
      setIsLoadingNextWeek(true)
      fetch(
        `/api/vault/activity-log/${institutionName}-${chainId}-${vault.id}?weekNo=${
          loadedWeeksNumber + 1
        }`,
      )
        .then((res) => res.json())
        .then((data: GetVaultActivityLogByTimestampFromQuery['vault']) => {
          setLoadedAdditionalActivityLogData((prev) => [...prev, data])
          setLoadedWeeksNumber((prev) => prev + 1)
        })
        .finally(() => {
          setIsLoadingNextWeek(false)
        })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading additional activity log data:', error)
    }
  }

  return (
    <Card variant="cardSecondary" className={styles.panelActivityWrapper}>
      <Text as="h5" variant="h5">
        Activity - {`${loadedDateRangeArray.from} - ${loadedDateRangeArray.to}`}
        <div onClick={refreshView} style={{ display: 'inline-block', cursor: 'pointer' }}>
          <Icon iconName="refresh" size={16} style={{ margin: '0 10px' }} />
        </div>
      </Text>
      <div className={styles.headingWrapper}>
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
      <Card className={styles.tableCard}>
        <Table<ActivityTableColumns>
          rows={activityLogDataTable}
          columns={activityColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <Button
            variant="secondarySmall"
            onClick={loadAnotherWeekActivityLog}
            disabled={isLoadingNextWeek || isLoadedToDateHigherThanInceptionDate}
          >
            {isLoadedToDateHigherThanInceptionDate ? (
              'All activity (until vault inception date) loaded'
            ) : isLoadingNextWeek ? (
              <LoadingSpinner size={18} />
            ) : (
              'Load one more week'
            )}
          </Button>
        </div>
      </Card>
    </Card>
  )
}
