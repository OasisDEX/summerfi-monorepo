'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type LeaderboardResponse,
  MixpanelEventProduct,
  MixpanelEventTypes,
} from '@summerfi/app-types'
import { Text } from '@summerfi/app-ui'
import { IconChevronDown, IconChevronUp, IconClockHour3 } from '@tabler/icons-react'
import { useToggle } from 'usehooks-ts'

import { TopClimbers } from '@/components/molecules/TopClimbers/TopClimbers'
import {
  TopClimbersLabels,
  TopClimbersTabs,
} from '@/components/molecules/TopClimbers/TopClimbers.types'
import { climbersCount } from '@/constants/leaderboard'
import { basePath } from '@/helpers/base-path'
import { trackEvent } from '@/helpers/mixpanel'

import topClimbersStyles from './TopClimbers.module.css'

export const TopClimbersWrapper = ({ topClimbers }: { topClimbers?: LeaderboardResponse }) => {
  const [topClimbersOpen, toggleTopClimbers] = useToggle(false)
  const [topClimbersTab, setTopClimbersTab] = useState<TopClimbersTabs>(
    TopClimbersTabs.top_gainers_rank,
  )
  const [topClimbersOtherTabsData, setTopClimbersOtherTabsData] = useState<{
    [key in TopClimbersTabs]?: LeaderboardResponse
  }>({
    [TopClimbersTabs.top_gainers_rank]: topClimbers,
  })

  const trackedTopClimbers = () => {
    trackEvent(MixpanelEventTypes.RaysTopClimbers, {
      product: MixpanelEventProduct.Rays,
      action: topClimbersOpen ? 'close' : 'open',
    })
    toggleTopClimbers()
  }

  const fetchNewTopClimbers = useCallback(() => {
    if (!topClimbersOtherTabsData[topClimbersTab]) {
      fetch(`${basePath}/api/leaderboard?sortMethod=${topClimbersTab}&limit=${climbersCount}`)
        .then((resp) => resp.json())
        .then((data) => {
          const castedData = data as LeaderboardResponse

          setTopClimbersOtherTabsData((prev) => ({ ...prev, [topClimbersTab]: castedData }))
        })
    }
  }, [topClimbersTab, topClimbersOtherTabsData])

  useEffect(fetchNewTopClimbers, [topClimbersTab, fetchNewTopClimbers])

  const topClimbersData = useMemo(() => {
    if (topClimbersTab === TopClimbersTabs.top_gainers_rank) {
      return topClimbers
    }

    return topClimbersOtherTabsData[topClimbersTab]
  }, [topClimbers, topClimbersTab, topClimbersOtherTabsData])

  return (
    <div className={topClimbersStyles.wrapper}>
      <div
        className={`${topClimbersStyles.flexRowCenter} ${topClimbersStyles.clickableHeader}`}
        onClick={trackedTopClimbers}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text as="h5" variant="h5" className={topClimbersStyles.wrapperTitle}>
            Top {climbersCount} Biggest Gainers
          </Text>
          <Text as="p" variant="p4semiColorful" className={topClimbersStyles.wrapperTitle}>
            {TopClimbersLabels[topClimbersTab]}
          </Text>
        </div>
        <div className={topClimbersStyles.flexRowCenter}>
          <div className={topClimbersStyles.wrapperTime}>
            <IconClockHour3 size={16} style={{ stroke: 'var(--color-primary-60)' }} />
            <Text variant="p3semi">In&nbsp;last&nbsp;24h</Text>
          </div>
          {topClimbersOpen ? <IconChevronDown size={18} /> : <IconChevronUp size={18} />}
        </div>
      </div>
      <TopClimbers
        topClimbers={topClimbersData}
        topClimbersOpen={topClimbersOpen}
        toggleTopClimbers={trackedTopClimbers}
        setTopClimbersTab={setTopClimbersTab}
        topClimbersTab={topClimbersTab}
      />
    </div>
  )
}
