import { Emphasis, Text } from '@summerfi/app-earn-ui'

import { TagButton } from '@/components/atoms/TagButton'
import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { HeroWrapper } from '@/components/layout/sub-pages/HeroWrapper'

export default function PermissionlessVaults() {
  return (
    <>
      <HeroWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          <LandingPageBlobs />
        </div>
        <div
          style={{
            maxWidth: '1200px',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-small)',
          }}
        >
          <TagButton>Permisionless DeFi Vaults</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Automated access to DeFi’s best yields,</Emphasis>
            <br />
            continually rebalanced to earn you more.
          </Text>
          <Text
            variant="p1"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            With Lazy Summer permisionless vaults, deposit once and earn the best yields across DeFi
            - automatically rebalanced, built-in risk-management and liquid anytime.
          </Text>
        </div>
        CAROUSEL
      </HeroWrapper>
      <h1>Permissionless Vaults</h1>
    </>
  )
}
