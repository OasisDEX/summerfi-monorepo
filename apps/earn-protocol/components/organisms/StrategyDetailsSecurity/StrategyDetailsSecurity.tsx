import { Card, DataBlock, Text } from '@summerfi/app-earn-ui'

import { StrategyDetailsSecurityAuditsExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityAuditsExpander'
import { StrategyDetailsSecurityMoneyExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityMoneyExpander'
import { StrategyDetailsSecurityProtocolStats } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurityProtocolStats'
import { StrategyDetailsSecuritySupportExpander } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecuritySupportExpander'

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
          <StrategyDetailsSecurityProtocolStats />
          <StrategyDetailsSecurityMoneyExpander />
          <StrategyDetailsSecurityAuditsExpander />
          <StrategyDetailsSecuritySupportExpander />
        </div>
      </div>
    </Card>
  )
}
