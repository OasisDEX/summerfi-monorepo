import { Text } from '@summerfi/app-ui'
import { IconArrowRight, IconArrowUpRight, IconTrophyFilled } from '@tabler/icons-react'
import { useConnectWallet } from '@web3-onboard/react'
import Link from 'next/link'

import { formatAddress } from '@/helpers/formatters'
import { LeaderboardResponse } from '@/types/leaderboard'

import topClimbersStyles from './TopClimbers.module.scss'

export const TopClimbers = ({
  topClimbers,
  topClimbersOpen,
  toggleTopClimbers,
}: {
  topClimbers?: LeaderboardResponse
  topClimbersOpen: boolean
  toggleTopClimbers: () => void
}) => {
  const [{ wallet }] = useConnectWallet()

  return (
    <div
      className={topClimbersStyles.topClimbersListWrapper}
      style={{
        maxHeight: !topClimbersOpen ? 0 : `${(topClimbers?.leaderboard.length ?? 5) * 100}px`,
      }}
    >
      {topClimbers?.leaderboard.map((entry, index) => (
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
            <Text
              variant="p4"
              className={`${topClimbersStyles.topClimbersListRankChangeInfo} ${topClimbersStyles.rankChangeInfo}`}
            >
              {entry.rank22h} <IconArrowRight size={10} style={{ marginBottom: '3px' }} />{' '}
              {entry.rank}
            </Text>
            <IconArrowUpRight
              size={16}
              style={{ marginRight: '4px' }}
              className={topClimbersStyles.topClimbersListRankChange}
            />
            <Text variant="p3semi" className={topClimbersStyles.topClimbersListRankChange}>
              {Number(entry.rank22h) - Number(entry.rank)}
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}
