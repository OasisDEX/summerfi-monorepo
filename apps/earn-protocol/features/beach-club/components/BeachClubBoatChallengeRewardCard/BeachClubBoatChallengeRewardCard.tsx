import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import { formatWithSeparators } from '@summerfi/app-utils'
import Image from 'next/image'

import { BeachClubProgressBar } from '@/features/beach-club/components/BeachClubProgressBar/BeachClubProgressBar'
import {
  type BeachClubBoatChallengeRewardCardType,
  beachClubRewardCardImages,
  beachClubRewardDescriptions,
} from '@/features/beach-club/constants/reward-cards'

import classNames from './BeachClubBoatChallengeRewardCard.module.css'

import waves from '@/public/img/beach_club/waves.png'

interface BeachClubBoatChallengeRewardCardProps {
  currentPoints: number
  requiredPoints: number
  left: number
  unlocked: boolean
  daysToUnlock: number | string
  reward: {
    type: BeachClubBoatChallengeRewardCardType
  }
}

export const BeachClubBoatChallengeRewardCard = ({
  currentPoints,
  requiredPoints,
  left,
  unlocked,
  daysToUnlock,
  reward,
}: BeachClubBoatChallengeRewardCardProps) => {
  const { type } = reward

  return (
    <div className={classNames.beachClubBoatChallengeRewardCardWrapper}>
      <div className={classNames.top}>
        <div className={classNames.content}>
          <div className={classNames.header}>
            <Text as="h5" variant="h5">
              {unlocked ? 'Unlocked' : <>{formatWithSeparators(requiredPoints)} Points</>}
            </Text>
            <Icon iconName={unlocked ? 'lock_open_beach_colorful' : 'lock_beach_colorful'} />
          </div>
          <Text as="p" variant="p4semiColorfulBeachClub">
            Only {left} left
          </Text>
        </div>
        <Image src={waves} alt="waves" />
        <Image
          src={beachClubRewardCardImages[type]}
          alt={type}
          style={{
            position: 'absolute',
            bottom: '-7px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
      <div className={classNames.bottom}>
        <div className={classNames.textual}>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            Reward
          </Text>
          <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
            {beachClubRewardDescriptions[type]}
          </Text>
        </div>
        {unlocked ? (
          <Button variant="beachClubMedium" style={{ width: '100%' }}>
            Claim {beachClubRewardDescriptions[type]}
          </Button>
        ) : (
          <div className={classNames.progress}>
            <BeachClubProgressBar max={requiredPoints} current={currentPoints} />
            <Text as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
              {typeof daysToUnlock === 'number' ? formatWithSeparators(daysToUnlock) : daysToUnlock}{' '}
              Days to unlock
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
