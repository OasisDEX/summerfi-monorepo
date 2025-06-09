import { type FC, useState } from 'react'
import {
  AnimateHeight,
  Card,
  getTwitterShareUrl,
  Icon,
  SUMR_CAP,
  Text,
  useCurrentUrl,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import {
  formatAsShorthandNumbers,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { BeachClubProgressBar } from '@/features/beach-club/components/BeachClubProgressBar/BeachClubProgressBar'

import classNames from './BeachClubTvlChallengeRewardCard.module.css'

interface BeachClubTvlChallengeRewardCardProps {
  tvlGroup: string
  customTitle?: string
  rawTvlGroup: number
  nextGroupTvl: number
  description: string
  boost: string
  sumrToEarn: number
  currentGroupTvl: number
  colorfulBackground?: boolean
  colorfulBorder?: boolean
}

export const BeachClubTvlChallengeRewardCard: FC<BeachClubTvlChallengeRewardCardProps> = ({
  tvlGroup,
  customTitle,
  rawTvlGroup,
  nextGroupTvl,
  description,
  boost,
  sumrToEarn,
  currentGroupTvl,
  colorfulBackground,
  colorfulBorder,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const currentUrl = useCurrentUrl()
  const groupAchieved = currentGroupTvl >= rawTvlGroup
  const [isExpanded, setIsExpanded] = useState(!groupAchieved)

  const leftToBoost = rawTvlGroup - currentGroupTvl

  return (
    <Card
      className={`${classNames.beachClubTvlChallengeRewardCardWrapper} ${colorfulBorder ? classNames.colorfulBorder : ''} ${colorfulBackground ? classNames.colorfulBackground : ''}`}
      style={{
        opacity: !groupAchieved ? 1 : 0.5,
        ...(colorfulBackground && {
          background: 'var(--gradient-earn-protocol-beach-club-5)',
        }),
      }}
    >
      <div className={classNames.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={classNames.headerLeftWrapper}>
          <Text as="p" variant="p1semi">
            {groupAchieved ? (
              <>You reached a {tvlGroup} Group TVL</>
            ) : customTitle ? (
              <>{customTitle}</>
            ) : (
              <>{tvlGroup} Group TVL</>
            )}
          </Text>
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
              Earn {formatCryptoBalance(sumrToEarn)} SUMR ($
              {formatFiatBalance(sumrToEarn * estimatedSumrPrice)})
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
            {!groupAchieved ? (
              <BeachClubProgressBar max={rawTvlGroup} current={currentGroupTvl} />
            ) : !(currentGroupTvl >= nextGroupTvl) ? (
              <Text
                as="div"
                variant="p1semiColorfulBeachClub"
                style={{
                  display: 'flex',
                  marginRight: 'var(--general-space-32)',
                  alignItems: 'center',
                  gap: 'var(--general-space-4)',
                }}
              >
                <Icon iconName="star_solid_beach_club" size={24} /> You are here!
              </Text>
            ) : null}
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
                {formatAsShorthandNumbers(leftToBoost, { precision: 2 })} left!
              </Text>
            )}
            <Link
              href={getTwitterShareUrl({
                url: currentUrl,
                text: groupAchieved
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
