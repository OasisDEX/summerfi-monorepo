import { Emphasis, Text } from '@summerfi/app-earn-ui'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/sub-pages/HeroWrapper'

export default function Integration() {
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
          <TagButton>Integration</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">One integration</Emphasis> to give your users the best of
            DeFi.
          </Text>
          <Text
            variant="p1"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            The Summer.fi institutional Private access RWA vault gives forward thinking institutions
            automated access to DeFi&lsquo;s highest quality yield sources designed for qualified
            investors.
          </Text>
        </div>
      </HeroWrapper>
      <h1>Integration</h1>
    </>
  )
}
