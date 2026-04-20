import { Emphasis, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'

import integrationsStyles from './Integrations.module.css'

import sdkScreenshot from '@/public/img/landing-page/sdk-screenshot.png'

export default function Integrations() {
  return (
    <>
      <HeroWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        large
      >
        <div className={integrationsStyles.heroBackground}>
          <FractalGlassBackground skewed />
        </div>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--spacing-space-3x-large)',
          }}
        >
          <div
            style={{
              textAlign: 'left',
              alignItems: 'start',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-space-small)',
            }}
          >
            <TagButton>Integration</TagButton>
            <Text variant="h1">
              <Emphasis variant="h1colorful">One integration</Emphasis> to give your users the best
              of DeFi.
            </Text>
            <Text
              variant="p1"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              The Summer.fi institutional Private access RWA vault gives forward thinking
              institutions automated access to DeFi&lsquo;s highest quality yield sources designed
              for qualified investors.
            </Text>
          </div>

          <Image
            alt="screenshot of the sdk showing a self managed vault integration"
            src={sdkScreenshot}
          />
        </div>
      </HeroWrapper>
      <h1>Integration</h1>
    </>
  )
}
