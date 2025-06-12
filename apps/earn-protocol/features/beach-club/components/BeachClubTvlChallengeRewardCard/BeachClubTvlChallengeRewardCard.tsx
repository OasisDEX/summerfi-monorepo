import { type FC, useState } from 'react'
import {
  AnimateHeight,
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
  tvlGroup: string
  customTitle?: string
  rawTvlGroup: number
  nextGroupTvl: number
  previousGroupTvl: number
  description: string
  boost?: number
  sumrApy: number
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
  sumrApy,
  currentGroupTvl,
  colorfulBackground,
  colorfulBorder,
}) => {
  const currentUrl = useCurrentUrl()
  const groupAchieved = currentGroupTvl >= rawTvlGroup

  // a special case where we want to show expanded both star earning and 10k card until user reaches 10k
  const resolvedIsExpanded =
    rawTvlGroup === 0 && currentGroupTvl < nextGroupTvl ? true : !groupAchieved
  const [isExpanded, setIsExpanded] = useState(resolvedIsExpanded)

  const leftToBoost = rawTvlGroup - currentGroupTvl

  return (
    <Card
      className={`${classNames.beachClubTvlChallengeRewardCardWrapper} ${colorfulBorder ? classNames.colorfulBorder : ''} ${colorfulBackground ? classNames.colorfulBackground : ''}`}
      style={{
        ...(colorfulBackground && {
          background: 'var(--gradient-earn-protocol-beach-club-5)',
        }),
      }}
    >
      <div className={classNames.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={classNames.headerLeftWrapper}>
          <Text as="p" variant="p1semi">
            {customTitle ? (
              <>{customTitle}</>
            ) : groupAchieved ? (
              <>You reached a {tvlGroup} Group TVL</>
            ) : (
              <>{tvlGroup} Group TVL</>
            )}
          </Text>
          <div className={classNames.chevronMobileWrapper}>
            <Icon
              iconName={isExpanded ? 'chevron_up' : 'chevron_down'}
              size={14}
              color="var(--earn-protocol-secondary-70)"
            />
          </div>
        </div>
        <div className={classNames.headerRightWrapper}>
          {boost && (
            <div className={classNames.boostWrapper}>
              <Icon tokenName="SUMR" size={26} />
              <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                {formatDecimalAsPercent(boost, { precision: 0 })} boost
              </Text>
            </div>
          )}
          <div className={classNames.earnPill}>
            <Icon iconName="stars" size={24} />
            <Text as="p" variant="p3semi">
              {formatDecimalAsPercent(sumrApy, { precision: 1 })} SUMR APY
            </Text>
          </div>
          <div className={classNames.chevronDesktopWrapper}>
            <Icon
              iconName={isExpanded ? 'chevron_up' : 'chevron_down'}
              size={14}
              color="var(--earn-protocol-secondary-70)"
            />
          </div>
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
