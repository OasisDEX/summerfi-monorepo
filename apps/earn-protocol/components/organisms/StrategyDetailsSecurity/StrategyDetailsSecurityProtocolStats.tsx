import { useState } from 'react'
import { Card, Dropdown, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import Link from 'next/link'

const securityDropdownOptions: DropdownOption[] = [
  {
    label: 'Aave V2',
    value: 'aavev2',
    iconName: 'aave_circle_color',
  },
  {
    label: 'Aave V3',
    value: 'aavev3',
    iconName: 'aave_circle_color',
  },
  {
    label: 'Spark',
    value: 'spark',
    iconName: 'spark_circle_color',
  },
  {
    label: 'Sky',
    value: 'sky',
    iconName: 'sky',
  },
]

export const StrategyDetailsSecurityProtocolStats = () => {
  const [dropdownOption, setDropdownOption] = useState<DropdownOption>(securityDropdownOptions[0])

  return (
    <Card variant="cardSecondary">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text as="p" variant="p1semi" style={{ marginBottom: 'var(--spacing-space-small)' }}>
            Curate Protocol Stats
          </Text>
          <Dropdown
            options={securityDropdownOptions}
            dropdownValue={securityDropdownOptions[0]}
            onChange={(option) => setDropdownOption(option)}
          />
        </div>
        <Text
          as="p"
          variant="p3"
          style={{
            marginBottom: 'var(--spacing-space-large)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          The Summer Earn protocol only selects the highest quality DeFi protocols to integrate into
          our strategies.
        </Text>

        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-x-small)' }}>
          Why we choose {dropdownOption.label}
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginBottom: 'var(--spacing-space-x-small)',
          }}
        >
          {dropdownOption.label} offers efficient capital utilization, advanced risk management
          features, cross-chain functionality, and deep liquidity, making it ideal for secure,
          scalable integration.
        </Text>
        <Link href="/">
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View {dropdownOption.label}
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
