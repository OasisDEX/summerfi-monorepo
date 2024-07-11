import { type LeaderboardResponse } from '@summerfi/app-types'
import { Button, SkeletonLine, Text } from '@summerfi/app-ui'
import { IconArrowRight, IconArrowUpRight, IconTrophyFilled } from '@tabler/icons-react'
import { useConnectWallet } from '@web3-onboard/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import {
  TopClimbersLabels,
  TopClimbersTabs,
} from '@/components/molecules/TopClimbers/TopClimbers.types'
import { climbersCount } from '@/constants/leaderboard'
import { formatAddress, formatAsShorthandNumbers } from '@/helpers/formatters'

import topClimbersStyles from './TopClimbers.module.scss'

export const TopClimbers = ({
  topClimbers,
  topClimbersOpen,
  toggleTopClimbers,
  setTopClimbersTab,
  topClimbersTab,
}: {
  topClimbers?: LeaderboardResponse
  topClimbersOpen: boolean
  toggleTopClimbers: () => void
  setTopClimbersTab: (tab: TopClimbersTabs) => void
  topClimbersTab: TopClimbersTabs
}) => {
  const [{ wallet }] = useConnectWallet()

  const topClimbersSwitcher = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        margin: '10px 20px 30px',
      }}
    >
      {Object.values(TopClimbersTabs).map((tab) => (
        <Button
          variant={topClimbersTab === tab ? 'primarySmall' : 'secondarySmall'}
          key={tab}
          onClick={() => setTopClimbersTab(tab as TopClimbersTabs)}
        >
          {TopClimbersLabels[tab].replace('Biggest', '')}
        </Button>
      ))}
    </div>
  )

  if (!topClimbers) {
    return (
      <div
        className={topClimbersStyles.topClimbersListWrapper}
        style={{
          maxHeight: !topClimbersOpen ? 0 : `${climbersCount * 100}px`,
        }}
      >
        {Array(climbersCount)
          .fill('')
          .map((_, loadingIndex) => (
            <div
              key={`TopClimbersLoading_%${loadingIndex}`}
              className={topClimbersStyles.topClimbersListRankRow}
            >
              <SkeletonLine height={24} width="100%" />
            </div>
          ))}
        {topClimbersSwitcher}
      </div>
    )
  }

  return (
    <div
      className={topClimbersStyles.topClimbersListWrapper}
      style={{
        maxHeight: !topClimbersOpen ? 0 : `${topClimbers.leaderboard.length * 100}px`,
      }}
    >
      {topClimbers.leaderboard.map((entry, index) => (
        <div
          key={entry.userAddress}
          className={`${topClimbersStyles.flexRowCenter} ${topClimbersStyles.topClimbersListRankRow}`}
        >
          <div
            className={`${topClimbersStyles.flexRowCenter} ${topClimbersStyles.topClimbersListRank}`}
          >
            <Text variant="p2semi">{index + 1}</Text>
            {[1, 2, 3].includes(index + 1) && (
              <IconTrophyFilled
                style={{ marginLeft: '4px' }}
                color={
                  {
                    1: 'gold',
                    2: 'silver',
                    3: 'brown',
                  }[(index + 1) as 1 | 2 | 3]
                }
              />
            )}
          </div>
          <Link
            href={{
              pathname: '/',
              query: { userAddress: entry.userAddress },
            }}
            onClick={toggleTopClimbers}
            className={topClimbersStyles.topClimbersListRankRowLink}
          >
            <Text
              variant={
                wallet?.accounts[0].address.toLocaleLowerCase() ===
                entry.userAddress.toLocaleLowerCase()
                  ? 'p2semiColorful'
                  : 'p2semi'
              }
            >
              {entry.ens ?? formatAddress(entry.userAddress)}
            </Text>
          </Link>
          <div className={topClimbersStyles.flexRowCenter}>
            {topClimbersTab !== TopClimbersTabs.top_gainers_points && (
              <Text
                variant="p4"
                className={`${topClimbersStyles.topClimbersListRankChangeInfo} ${topClimbersStyles.rankChangeInfo}`}
              >
                {entry.rank22h} <IconArrowRight size={10} style={{ marginBottom: '3px' }} />{' '}
                {entry.rank}
              </Text>
            )}
            {topClimbersTab !== TopClimbersTabs.top_gainers_points && (
              <IconArrowUpRight
                size={16}
                style={{ marginRight: '4px' }}
                className={topClimbersStyles.topClimbersListRankChange}
              />
            )}
            <Text variant="p3semi" className={topClimbersStyles.topClimbersListRankChange}>
              {topClimbersTab === TopClimbersTabs.top_gainers_points
                ? `+ ${formatAsShorthandNumbers(new BigNumber(entry.points22h), 2)}`
                : `${formatAsShorthandNumbers(new BigNumber(Number(entry.rank22h) - Number(entry.rank)), 0)}`}
            </Text>
          </div>
        </div>
      ))}
      {topClimbersSwitcher}
    </div>
  )
}
