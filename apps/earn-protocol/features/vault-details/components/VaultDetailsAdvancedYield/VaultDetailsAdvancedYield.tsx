import { useMemo, useState } from 'react'
import { InlineButtons, Table, Text } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'

import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import {
  historicalYieldOptions,
  individualYieldOptions,
  yieldsRawData,
} from '@/features/vault-details/components/VaultDetailsAdvancedYield/config'
import { individualYieldsMapper } from '@/features/vault-details/components/VaultDetailsAdvancedYield/mapper'
import { individualYieldsColumns } from '@/features/vault-details/components/VaultDetailsYields/columns'

export const VaultDetailsAdvancedYield = () => {
  const [currentOption, setCurrentOption] = useState<InlineButtonOption<string>>(
    historicalYieldOptions[0],
  )

  const [individualYieldOption, setIndividualYieldOption] = useState<InlineButtonOption<string>>(
    individualYieldOptions[0],
  )
  const rows = useMemo(() => individualYieldsMapper(yieldsRawData), [])

  return (
    <>
      <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
        Historical Yields
      </Text>
      <InlineButtons
        options={historicalYieldOptions}
        currentOption={currentOption}
        handleOption={(option) => setCurrentOption(option)}
        style={{
          marginBottom: 'var(--spacing-space-large)',
        }}
        asButtons
        variant="p4semi"
      />
      <MockedLineChart cardVariant="cardPrimary" />
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
      <InlineButtons
        options={individualYieldOptions}
        currentOption={individualYieldOption}
        handleOption={(option) => setIndividualYieldOption(option)}
        style={{
          paddingBottom: 'var(--spacing-space-small)',
          borderBottom: '1px solid var(--earn-protocol-neutral-70)',
        }}
        asUnstyled
        variant="p3semi"
      />
      <Table
        rows={rows}
        columns={individualYieldsColumns}
        // eslint-disable-next-line no-console
        handleSort={(item) => console.log(item)}
      />
    </>
  )
}
