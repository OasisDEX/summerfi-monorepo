import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import { formatFiatBalance } from '@summerfi/app-utils'
import Image from 'next/image'

import { BeachClubProgressBar } from '@/features/beach-club/components/BeachClubProgressBar/BeachClubProgressBar'
import hoodie from '@/public/img/beach_club/hoodie.svg'
import nft from '@/public/img/beach_club/nft.svg'
import tShirt from '@/public/img/beach_club/t_shirt.svg'

import classNames from './BeachClubBoatChallengeRewardCard.module.css'

import waves from '@/public/img/beach_club/waves.png'

export enum BeachClubBoatChallengeRewardCardType {
  T_SHIRT = 't-shirt',
  HOODIE = 'hoodie',
  BEACH_CLUB_NFT = 'beach-club-nft',
}

const rewardCardImages = {
  [BeachClubBoatChallengeRewardCardType.T_SHIRT]: tShirt,
  [BeachClubBoatChallengeRewardCardType.HOODIE]: hoodie,
  [BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT]: nft,
}

const rewardDescriptions = {
  [BeachClubBoatChallengeRewardCardType.T_SHIRT]: 'T-shirt',
  [BeachClubBoatChallengeRewardCardType.HOODIE]: 'Limited edition hoodie',
  [BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT]: 'Summer.fi Beach Club NFT',
}

interface BeachClubBoatChallengeRewardCardProps {
  requiredPoints: number
  currentPoints: number
  left: number
  unlocked: boolean
  reward: {
    type: BeachClubBoatChallengeRewardCardType
  }
}

export const BeachClubBoatChallengeRewardCard = ({
  requiredPoints,
  currentPoints,
  left,
  unlocked,
  reward,
}: BeachClubBoatChallengeRewardCardProps) => {
  const { type } = reward
  const daysToUnlock = 27

  return (
    <div className={classNames.beachClubBoatChallengeRewardCardWrapper}>
      <div className={classNames.top}>
        <div className={classNames.content}>
          <div className={classNames.header}>
            <Text as="h5" variant="h5">
              {unlocked ? (
                'Unlocked'
              ) : (
                <>{formatFiatBalance(requiredPoints).split('.')[0]} Points</>
              )}
            </Text>
            <Icon iconName={unlocked ? 'lock_open_beach_colorful' : 'lock_beach_colorful'} />
          </div>
          <Text as="p" variant="p4semiColorfulBeachClub">
            Only {left} left
          </Text>
        </div>
        <Image src={waves} alt="waves" />
        <Image
          src={rewardCardImages[type]}
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
            {rewardDescriptions[type]}
          </Text>
        </div>
        {unlocked ? (
          <Button
            variant="primaryMedium"
            style={{ width: '100%', background: 'var(--beach-club-primary-100)' }}
          >
            Claim {rewardDescriptions[type]}
          </Button>
        ) : (
          <div className={classNames.progress}>
            <BeachClubProgressBar max={requiredPoints} current={currentPoints} />
            <Text as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
              {daysToUnlock} Days to unlock
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
