import { Card, DataBlock, Dropdown, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import Link from 'next/link'

import { StrategyDetailsSecurityAuditsExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityAuditsExpander'
import { StrategyDetailsSecurityMoneyExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityMoneyExpander'
import { StrategyDetailsSecuritySupportExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecuritySupportExpander'

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

export const StrategyDetailsSecurity = () => {
  return (
    <Card variant="cardPrimary">
      <div
        id="security"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Text as="h5" variant="h5" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
          Security
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--spacing-space-x-large)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          The Summer Earn Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield, while diversifying risk.
        </Text>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-small)',
            width: '100%',
          }}
        >
          <Card variant="cardSecondary">
            <div
              style={{
                justifyContent: 'flex-start',
                display: 'flex',
                gap: 'var(--spacing-space-3x-large)',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              <DataBlock title="Total Assets Managed" size="small" value="4.2b" />
              <DataBlock title="30d Volume" size="small" value="11.2b" />
              <DataBlock title="Vault Automated" size="small" value="249.6m" />
              <DataBlock title="Time Operating" size="small" value="6 years" />
            </div>
          </Card>
          <Card variant="cardSecondary">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text
                  as="p"
                  variant="p1semi"
                  style={{ marginBottom: 'var(--spacing-space-small)' }}
                >
                  Curate Protocol Stats
                </Text>
                <Dropdown
                  options={securityDropdownOptions}
                  dropdownValue={securityDropdownOptions[0]}
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
                The Summer Earn protocol only selects the highest quality DeFi protocols to
                integrate into our strategies.
              </Text>

              <Text
                as="p"
                variant="p2semi"
                style={{ marginBottom: 'var(--spacing-space-x-small)' }}
              >
                Why we choose AAVE v3
              </Text>
              <Text
                as="p"
                variant="p3"
                style={{
                  color: 'var(--earn-protocol-secondary-60)',
                  marginBottom: 'var(--spacing-space-x-small)',
                }}
              >
                Aave v3 offers efficient capital utilization, advanced risk management features,
                cross-chain functionality, and deep liquidity, making it ideal for secure, scalable
                integration.
              </Text>
              <Link href="/">
                <WithArrow
                  as="p"
                  variant="p3semi"
                  style={{ color: 'var(--earn-protocol-primary-100)' }}
                >
                  View AAVE v3
                </WithArrow>
              </Link>
            </div>
          </Card>
          <StrategyDetailsSecurityMoneyExpander />
          <StrategyDetailsSecurityAuditsExpander />
          <StrategyDetailsSecuritySupportExpander />
        </div>
      </div>
    </Card>
  )
}
