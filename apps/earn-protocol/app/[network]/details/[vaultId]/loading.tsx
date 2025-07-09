import { Card, SkeletonLine, Text } from '@summerfi/app-earn-ui'

import { VaultDetailsFaq } from '@/features/vault-details/components/VaultDetailsFaq/VaultDetailsFaq'
import { VaultDetailsHowItWorks } from '@/features/vault-details/components/VaultDetailsHowItWorks/VaultDetailsHowItWorks'
import { VaultDetailsSecurityAuditsExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityAuditsExpander'
import { VaultDetailsSecurityStatsHeader } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurityStatsHeader'
import { VaultDetailsSecuritySupportExpander } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecuritySupportExpander'
import { VaultDetailsYieldsHeader } from '@/features/vault-details/components/VaultDetailsYields/VaultDetailsYieldsHeader'

const VaultDetailsLoadingState = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <SkeletonLine
        width="35%"
        height={25}
        radius="var(--radius-roundish)"
        style={{ marginBottom: 'var(--general-space-8)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SkeletonLine
          width="180px"
          height={50}
          radius="var(--radius-roundish)"
          style={{ marginBottom: 'var(--general-space-32)' }}
        />
        <SkeletonLine
          width="128px"
          height={50}
          radius="var(--radius-roundish)"
          style={{ marginBottom: 'var(--general-space-32)' }}
        />
      </div>

      <VaultDetailsHowItWorks />
      <Card
        style={{
          height: '1000px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-space-x-small)',
        }}
        variant="cardSecondary"
        id="advanced-yield-data"
      >
        <VaultDetailsYieldsHeader
          tokenSymbol={<SkeletonLine width="64px" height={20} radius="var(--radius-roundish)" />}
          risk={<SkeletonLine width="128px" height={20} radius="var(--radius-roundish)" />}
        />
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
          Historical Yields
        </Text>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-space-small)',
            width: '100%',
            flexWrap: 'wrap',
            marginBottom: 'var(--spacing-space-medium)',
          }}
        >
          <SkeletonLine height={31} width={50} radius="var(--radius-roundish)" />
          <SkeletonLine height={31} width={100} radius="var(--radius-roundish)" />
          <SkeletonLine height={31} width={120} radius="var(--radius-roundish)" />
          <SkeletonLine height={31} width={100} radius="var(--radius-roundish)" />
          <SkeletonLine height={31} width={80} radius="var(--radius-roundish)" />
          <SkeletonLine height={31} width={100} radius="var(--radius-roundish)" />
          <SkeletonLine height={31} width={90} radius="var(--radius-roundish)" />
        </div>
        <SkeletonLine width="100%" height={484} radius="var(--radius-roundish)" />
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
          Individual Yield Data
        </Text>
        <SkeletonLine width="100%" height={507} radius="var(--radius-roundish)" />
      </Card>

      <Card
        style={{
          height: '851px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-space-x-small)',
        }}
        variant="cardSecondary"
        id="security"
      >
        <VaultDetailsSecurityStatsHeader />
        <SkeletonLine width="100%" height={100} radius="var(--radius-roundish)" />
        <SkeletonLine width="100%" height={248} radius="var(--radius-roundish)" />
        <SkeletonLine width="100%" height={100} radius="var(--radius-roundish)" />
        <VaultDetailsSecurityAuditsExpander />
        <VaultDetailsSecuritySupportExpander />
      </Card>

      <VaultDetailsFaq id="faq" />
    </div>
  )
}

export default VaultDetailsLoadingState
