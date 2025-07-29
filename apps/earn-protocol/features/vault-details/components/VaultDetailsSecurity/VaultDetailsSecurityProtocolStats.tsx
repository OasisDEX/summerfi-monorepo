import { type FC, useState } from 'react'
import { Card, Dropdown, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import Link from 'next/link'

const securityDropdownOptions: DropdownOption[] = [
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
  {
    label: 'Euler',
    value: 'euler',
    iconName: 'euler',
  },
  {
    label: 'Morpho',
    value: 'morpho',
    iconName: 'morpho_circle_color',
  },
  {
    label: 'Compound V3',
    value: 'compoundv3',
    iconName: 'compound_circle_color',
  },
  {
    label: 'Gearbox',
    value: 'gearbox',
    iconName: 'gearbox',
  },
]

const optionDescriptions: { [key: string]: React.ReactNode } = {
  aavev3:
    'Aave V3 is a leading DeFi lending protocol featuring isolated markets, high capital efficiency, and innovative features like eMode for correlated assets. It offers robust security and deep liquidity across multiple chains.',
  spark:
    'Spark Protocol is a specialized lending platform built on Aave V3, focusing on stablecoin lending with optimized risk parameters. It provides competitive rates and enhanced security for stablecoin markets.',
  sky: 'Sky Protocol is a next-generation lending platform that combines traditional DeFi lending with novel features like dynamic interest rates and advanced risk management systems.',
  euler:
    'Euler is a non-custodial protocol that enables permissionless lending and borrowing of any ERC20 token. It features unique risk management through reactive interest rates and tiered asset pools.',
  morpho: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-small)' }}>
      <Text as="span" variant="p3">
        Morpho Blue is a decentralized, permissionless lending protocol that enables anyone to
        create isolated, immutable lending markets on Ethereum. Each Morpho Market is a simple pair:
        one collateral asset and one loan asset. These markets are isolated (risk doesn’t spread
        across markets), immutable (parameters can’t be changed once deployed), and transparent
        (rules are clear and enforced by smart contracts).
      </Text>
      <Text as="span" variant="p3">
        Unlike traditional lending protocols that pool assets and require governance approval to
        list new assets or adjust parameters, Morpho lets anyone create a market without permission.
        Each market selects its own parameters - like loan-to-value ratio and interest rate model -
        from options approved by Morpho Governance, but once chosen, these settings are locked in
        forever.
      </Text>
      <Text as="span" variant="p3">
        This structure makes Morpho highly predictable, efficient, and ideal as a foundational layer
        for DeFi applications that want trust-minimized, overcollateralized lending.
      </Text>
    </div>
  ),
  compoundv3:
    'Compound V3 introduces a new architecture with isolated collateral and borrow positions, enabling more efficient capital utilization and improved risk management for lending markets.',
  gearbox:
    'Gearbox Protocol enables leveraged trading and yield farming through credit accounts, allowing users to multiply their positions while maintaining full control over their assets.',
}

const optionLinks: { [key: string]: string } = {
  aavev3: 'https://aave.com/',
  spark: 'https://spark.fi/',
  sky: 'https://sky.money/',
  euler: 'https://www.euler.finance/',
  morpho: 'https://morpho.org/',
  compoundv3: 'https://compound.finance/',
  gearbox: 'https://gearbox.fi/',
}

interface ContentProps {
  option: DropdownOption
}

const Content: FC<ContentProps> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
    {'iconName' in option && option.iconName && <Icon iconName={option.iconName} />}
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
            Curated Protocol Stats
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
          The Lazy Summer protocol only supports the highest quality DeFi protocols and strategies.
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
          {optionDescriptions[resolvedOption.value]}
        </Text>
        <Link href={optionLinks[resolvedOption.value]} target="_blank">
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View {resolvedOption.label}
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
