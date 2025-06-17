import { type FC, useState } from 'react'
import { AnimateHeight, Card, getTwitterShareUrl, Icon, Text } from '@summerfi/app-earn-ui'
import { formatAsShorthandNumbers, formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'
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
  youAreHere?: boolean
  referralCode?: string
}

export const BeachClubTvlChallengeRewardCard: FC<BeachClubTvlChallengeRewardCardProps> = ({
  tvlGroup,
  customTitle,
  rawTvlGroup,
  description,
  boost,
  sumrApy,
  currentGroupTvl,
  youAreHere,
  referralCode,
}) => {
  const groupAchieved = currentGroupTvl >= rawTvlGroup

  const resolvedIsExpanded = youAreHere ? true : !groupAchieved
  const [isExpanded, setIsExpanded] = useState(resolvedIsExpanded)

  const leftToBoost = rawTvlGroup - currentGroupTvl

  return (
    <Card
      className={clsx(
        classNames.beachClubTvlChallengeRewardCardWrapper,
        youAreHere && classNames.colorfulBorder,
        youAreHere && classNames.colorfulBackground,
      )}
      style={{
        ...(!resolvedIsExpanded && {
          opacity: 0.5,
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
            ) : (
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
                {youAreHere ? (
                  <>
                    <Icon iconName="star_solid_beach_club" size={20} /> You are here!
                  </>
                ) : (
                  <>
                    <Icon iconName="checkmark_colorful_beach_club" size={20} /> You reached here
                  </>
                )}
              </Text>
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
                {formatAsShorthandNumbers(leftToBoost, { precision: 2 })} left!
              </Text>
            )}
            {youAreHere && referralCode && (
              <Link
                href={getTwitterShareUrl({
                  url: '',
                  text: `Chill this summer, don't chase yields.

Join me over at the Summer Beach Club🏖️ and earn the best yields in DeFi with none of the effort.

Open a position using my code below and earn even more https://summer.fi/earn?referralCode=${referralCode}`,
                })}
                className={classNames.shareWrapper}
                target="_blank"
              >
                Share on <Icon iconName="x" size={20} />
              </Link>
            )}
          </div>
        </div>
      </AnimateHeight>
    </Card>
  )
}
