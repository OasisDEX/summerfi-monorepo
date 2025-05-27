import { type FC, useState } from 'react'
import {
  AnimateHeight,
  Button,
  Card,
  getTwitterShareUrl,
  Icon,
  Text,
  useCurrentUrl,
} from '@summerfi/app-earn-ui'
import { formatAsShorthandNumbers, formatDecimalAsPercent } from '@summerfi/app-utils'
import Link from 'next/link'

import { BeachClubProgressBar } from '@/features/beach-club/components/BeachClubProgressBar/BeachClubProgressBar'

import classNames from './BeachClubTvlChallengeRewardCard.module.css'

interface BeachClubTvlChallengeRewardCardProps {
  isLocked: boolean
  tvlGroup: string
  rawTvlGroup: number
  description: string
  boost: string
  sumrToEarn: string
  currentGroupTvl: number
  boostClaimed: boolean
  colorfulBackground?: boolean
  colorfulBorder?: boolean
}

export const BeachClubTvlChallengeRewardCard: FC<BeachClubTvlChallengeRewardCardProps> = ({
  isLocked,
  tvlGroup,
  rawTvlGroup,
  description,
  boost,
  sumrToEarn,
  currentGroupTvl,
  boostClaimed,
  colorfulBackground,
  colorfulBorder,
}) => {
  const currentUrl = useCurrentUrl()
  const [isExpanded, setIsExpanded] = useState(isLocked)

  const readyToBoost = currentGroupTvl >= rawTvlGroup && !boostClaimed

  const leftToBoost = rawTvlGroup - currentGroupTvl

  return (
    <Card
      className={`${classNames.beachClubTvlChallengeRewardCardWrapper} ${colorfulBorder ? classNames.colorfulBorder : ''} ${colorfulBackground ? classNames.colorfulBackground : ''}`}
      style={{
        opacity: isLocked ? 1 : 0.5,
        ...(colorfulBackground && {
          background: 'var(--gradient-earn-protocol-beach-club-5)',
        }),
      }}
    >
      <div className={classNames.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={classNames.headerLeftWrapper}>
          <Text as="p" variant="p1semi">
            {boostClaimed || currentGroupTvl >= rawTvlGroup ? (
              <>You reached a {tvlGroup} Group TVL</>
            ) : (
              <>{tvlGroup} Group TVL</>
            )}
          </Text>
          <div className={classNames.lockIconWrapper}>
            {isLocked ? (
              <Icon iconName="lock" color="var(--earn-protocol-secondary-40)" size={20} />
            ) : (
              <Icon iconName="lock_open" color="var(--earn-protocol-warning-100)" size={20} />
            )}
          </div>
        </div>
        <div className={classNames.headerRightWrapper}>
          <div className={classNames.boostWrapper}>
            <Icon tokenName="SUMR" size={26} />
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Boost: {formatDecimalAsPercent(boost)}
            </Text>
          </div>
          <div className={classNames.earnPill}>
            <Icon iconName="stars" size={24} />
            <Text as="p" variant="p3semi">
              Earn {sumrToEarn} SUMR ($250)
            </Text>
          </div>
          <Icon
            iconName={isExpanded ? 'chevron_up' : 'chevron_down'}
            size={14}
            color="var(--earn-protocol-secondary-70)"
          />
        </div>
      </div>
      <AnimateHeight
        id={`Expander_${typeof tvlGroup === 'string' ? tvlGroup : ''}`}
        show={isExpanded}
        className={classNames.expander}
      >
        <div className={classNames.contentWrapper}>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--earn-protocol-secondary-60)',
              marginBottom: 'var(--general-space-24)',
            }}
          >
            {description}
          </Text>
          <div className={classNames.footer}>
            {readyToBoost ? (
              <Button
                variant="beachClubLarge"
                style={{
                  minWidth: 'unset',
                  marginRight: 'var(--general-space-24)',
                }}
              >
                Earn bonus SUMR
              </Button>
            ) : !boostClaimed ? (
              <BeachClubProgressBar max={rawTvlGroup} current={currentGroupTvl} />
            ) : (
              <Button
                variant="primaryLarge"
                style={{
                  minWidth: 'unset',
                  background: 'var(--beach-club-primary-100)',
                  marginRight: 'var(--general-space-24)',
                  cursor: 'not-allowed',
                }}
              >
                $SUMR Earned
              </Button>
            )}
            {leftToBoost > 0 && (
              <Text
                as="p"
                variant="p4semi"
                style={{
                  color: 'var(--beach-club-link)',
                  marginRight: 'var(--general-space-32)',
                  marginLeft: 'var(--general-space-12)',
                }}
              >
                {formatAsShorthandNumbers(leftToBoost)} left!
              </Text>
            )}
            <Link
              href={getTwitterShareUrl({
                url: currentUrl,
                text: readyToBoost
                  ? `I've reached a ${tvlGroup} Group TVL! 🎉`
                  : `I'm ${leftToBoost} Group TVL away from earning a ${boost} boost! 🎉`,
              })}
              className={classNames.shareWrapper}
              target="_blank"
            >
              Share on <Icon iconName="x" size={20} />
            </Link>
          </div>
        </div>
      </AnimateHeight>
    </Card>
  )
}
