import { Emphasis, Text } from '@summerfi/app-earn-ui'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/sub-pages/HeroWrapper'

export default function RwaVault() {
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
            maxWidth: '1200px',
            textAlign: 'left',
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-small)',
          }}
        >
          <TagButton>Permissioned RWA Vault</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Institutional grade DeFi yield.</Emphasis>
            <br />
            Private, diversified and automated.
          </Text>
          <Text
            variant="p1"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            The Summer.fi Institutional private access RWA Vault, managed by M1 Capital, gives
            automated access to the highest quality RWA markets designed exclusively for qualified
            investors.
          </Text>
        </div>
      </HeroWrapper>
      <h1>RWA Vaults</h1>
    </>
  )
}
