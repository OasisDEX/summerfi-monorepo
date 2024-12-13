import { type FC, useState } from 'react'
import { Card, Dropdown, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
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

interface ContentProps {
  option: DropdownOption
}

const Content: FC<ContentProps> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
    {'iconName' in option && <Icon iconName={option.iconName} />}
    <span>{option.label}</span>
  </>
)

export const VaultDetailsSecurityProtocolStats = () => {
  const [dropdownOption, setDropdownOption] = useState<DropdownRawOption>({
    value: securityDropdownOptions[0].value,
    content: <Content option={securityDropdownOptions[0]} />,
  })

  const resolvedOption =
    securityDropdownOptions.find((option) => dropdownOption.value === option.value) ??
    securityDropdownOptions[0]

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text as="p" variant="p1semi" style={{ marginBottom: 'var(--spacing-space-small)' }}>
            Curate Protocol Stats
          </Text>
          <div>
            <Dropdown
              options={securityDropdownOptions.map((item) => ({
                value: item.value,
                content: <Content option={item} />,
              }))}
              dropdownValue={{
                value: dropdownOption.value,
                content: dropdownOption.content,
              }}
              onChange={(option) => setDropdownOption(option)}
              asPill
            >
              <Content option={resolvedOption} />
            </Dropdown>
          </div>
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
          Why we choose {resolvedOption.label}
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginBottom: 'var(--spacing-space-x-small)',
          }}
        >
          {resolvedOption.label} offers efficient capital utilization, advanced risk management
          features, cross-chain functionality, and deep liquidity, making it ideal for secure,
          scalable integration.
        </Text>
        <Link href="/apps/earn-protocol/public">
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View {resolvedOption.label}
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
