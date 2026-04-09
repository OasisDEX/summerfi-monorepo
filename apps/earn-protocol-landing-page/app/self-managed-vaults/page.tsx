import { Emphasis, Text } from '@summerfi/app-earn-ui'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'

import selfManagedVaultsStyles from './SelfManagedVaults.module.css'

export default function SelfManagedVaults() {
  return (
    <>
      <HeroWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className={selfManagedVaultsStyles.heroBackground}>
          <FractalGlassBackground skewed />
        </div>
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
          <TagButton>Self Managed Vaults</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Unlimited access to DeFi yield,</Emphasis>
            built for forward thinking institutions
          </Text>
          <Text
            variant="p1"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            Self managed vaults by Summer.fi Institutional enable institutions to build their own
            custom vault.
          </Text>
        </div>
      </HeroWrapper>
      <h1>Self Managed Vaults</h1>
    </>
  )
}
