import { Card, SUMR_CAP, Text, useLocalConfig } from '@summerfi/app-earn-ui'
import { formatFiatBalance } from '@summerfi/app-utils'
import Image from 'next/image'

import logoBeachClub from '@/public/img/branding/logo-beach-club.svg'

import classNames from './BeachClubBigBanner.module.css'

import waves from '@/public/img/beach_club/waves.png'

const earnUpTo = 500000

export const BeachClubBigBanner = () => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

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
          {formatFiatBalance(earnUpTo).split('.')[0]} $SUMR
        </Text>
        <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          ${formatFiatBalance(estimatedSumrPrice * earnUpTo)}
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
