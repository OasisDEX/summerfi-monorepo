import { Card, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import logoBeachClub from '@/public/img/branding/logo-beach-club.svg'

import classNames from './BeachClubBigBanner.module.css'

import waves from '@/public/img/beach_club/waves.png'

export const BeachClubBigBanner = () => {
  return (
    <Card className={classNames.beachClubBigBannerWrapper}>
      <div className={classNames.beachClubTextualWrapper}>
        <Image
          src={logoBeachClub}
          alt="Beach Club Big Banner"
          style={{ marginBottom: 'var(--general-space-16)' }}
        />
        <Text as="h3" variant="h3">
          Earn big rewards for sharing
        </Text>
        <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
          When you share, you earn $SUMR and token fee’s with Lazy Summer Beach Club. Generate your
          code below.
        </Text>
      </div>
      <Card className={classNames.beachClubMiniBannerWrapper}>
        <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
          Earn over
        </Text>
        <Text as="h2" variant="h2colorfulBeachClub">
          500,000 $SUMR
        </Text>
        <Text
          as="h5"
          variant="h5"
          style={{ color: 'var(--earn-protocol-secondary-60)', fontSize: '17px' }}
        >
          when you refer {'>'} 100m in TVL
        </Text>
      </Card>
      <Image
        src={waves}
        alt="Beach Club Big Banner"
        className={classNames.beachClubBigBannerBackground}
      />
    </Card>
  )
}
