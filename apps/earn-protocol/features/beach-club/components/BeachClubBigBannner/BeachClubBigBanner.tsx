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
          Beach club is awesome
        </Text>
        <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore
        </Text>
      </div>
      <Card className={classNames.beachClubMiniBannerWrapper}>
        <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
          Earn up to
        </Text>
        <Text as="h2" variant="h2colorfulBeachClub">
          500,000 $SUMR
        </Text>
        <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          $250,030.32
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
