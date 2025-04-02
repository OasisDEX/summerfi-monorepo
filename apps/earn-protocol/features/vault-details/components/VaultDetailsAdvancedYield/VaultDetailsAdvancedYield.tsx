import { type FC, useMemo, useState } from 'react'
import { InlineButtons, Text } from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InlineButtonOption,
  type SDKVaultishType,
} from '@summerfi/app-types'

import { VaultDetailsHistoricalYieldChart } from '@/features/vault-details/components/VaultDetailsHistoricalYieldChart/VaultDetailsHistoricalYieldChart'
import { VaultDetailsIndividualYieldData } from '@/features/vault-details/components/VaultDetailsIndividualYieldData/VaultDetailsIndividualYieldData'

interface VaultDetailsAdvancedYieldProps {
  chartData: ArksHistoricalChartData
  summerVaultName: string
  vault: SDKVaultishType
  arksInterestRates: { [key: string]: number }
}

export const VaultDetailsAdvancedYield: FC<VaultDetailsAdvancedYieldProps> = ({
  chartData,
  summerVaultName,
  vault,
  arksInterestRates,
}) => {
  const chartNames = useMemo(() => {
    return [summerVaultName, ...(chartData.dataNames ?? [])]
  }, [chartData.dataNames, summerVaultName])

  const options = useMemo(() => {
    return [
      {
        title: 'All',
        key: 'all',
      },
      ...chartNames.map((value) => ({
        title: value,
        key: value,
      })),
    ]
  }, [chartNames])

  const [currentOptions, setCurrentOptions] = useState<InlineButtonOption<string>[]>([options[1]])

  // const [individualYieldOption, setIndividualYieldOption] = useState<InlineButtonOption<string>>(
  //   individualYieldOptions[0],
  // )
  // const rows = useMemo(() => individualYieldsMapper(yieldsRawData), [])

  return (
    <>
      <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
        Historical Yields
      </Text>
      <InlineButtons
        options={options}
        currentOptions={currentOptions}
        handleOption={(option) => {
          setCurrentOptions((prev) => {
            const isSelected = prev.some((opt) => opt.key === option.key)

            if (isSelected) {
              const filteredOptions = prev.filter((opt) => opt.key !== option.key)

              return filteredOptions.length === 0 ? [options[0]] : filteredOptions
            }

            // If selecting a non-"All" option, remove "All" option and add the new option
            if (option.key !== 'all') {
              return [...prev.filter((opt) => opt.key !== 'all'), option]
            }

            // If selecting "All", remove all other options
            return [option]
          })
        }}
        asButtons
        variant="p4semi"
      />
      <VaultDetailsHistoricalYieldChart
        chartData={chartData}
        summerVaultName={summerVaultName}
        currentOptions={currentOptions}
      />
      <Text
        as="p"
        variant="p2semi"
        style={{
          marginBottom: 'var(--spacing-space-medium)',
          marginTop: 'var(--spacing-space-large)',
        }}
      >
        Individual Yield Data
      </Text>
      <VaultDetailsIndividualYieldData vault={vault} arksInterestRates={arksInterestRates} />
    </>
  )
}
