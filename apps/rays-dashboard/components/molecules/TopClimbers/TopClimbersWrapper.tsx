'use client'

import { type LeaderboardResponse } from '@summerfi/app-types'
import { Text } from '@summerfi/app-ui'
import { IconChevronDown, IconChevronUp, IconClockHour3 } from '@tabler/icons-react'
import { useToggle } from 'usehooks-ts'

import { TopClimbers } from '@/components/molecules/TopClimbers/TopClimbers'
import { climbersCount } from '@/constants/leaderboard'

import topClimbersStyles from './TopClimbers.module.scss'

export const TopClimbersWrapper = ({ topClimbers }: { topClimbers?: LeaderboardResponse }) => {
  const [topClimbersOpen, toggleTopClimbers] = useToggle(false)

  return topClimbers ? (
    <div className={topClimbersStyles.wrapper}>
      <div
        className={`${topClimbersStyles.flexRowCenter} ${topClimbersStyles.clickableHeader}`}
        onClick={toggleTopClimbers}
      >
        <Text as="h5" variant="h5" className={topClimbersStyles.wrapperTitle}>
          Top {climbersCount} Biggest Climbers
        </Text>
        <div className={topClimbersStyles.flexRowCenter}>
          <div className={topClimbersStyles.wrapperTime}>
            <IconClockHour3 size={16} style={{ stroke: 'var(--color-primary-60)' }} />
            <Text variant="p3semi">In&nbsp;last&nbsp;24h</Text>
          </div>
          {topClimbersOpen ? <IconChevronDown size={18} /> : <IconChevronUp size={18} />}
        </div>
      </div>
      <TopClimbers
        topClimbers={topClimbers}
        topClimbersOpen={topClimbersOpen}
        toggleTopClimbers={toggleTopClimbers}
      />
    </div>
  ) : null
}
