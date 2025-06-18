'use client'

import { type FC, useEffect, useRef, useState } from 'react'
import { formatWithSeparators } from '@summerfi/app-utils'

import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'

import classNames from './BeachClubRewardSimulation.module.css'

const getMultiplier = (value: number) => {
  if (value < 10000) return 0.001 // 0.1%
  if (value < 100000) return 0.002
  if (value < 250000) return 0.003
  if (value < 500000) return 0.004

  return 0.005
}

const max = 1000000

interface BeachClubRewardSimulationProps {
  cardBackgroundColor?: string
  tvl?: number
}

export const BeachClubRewardSimulation: FC<BeachClubRewardSimulationProps> = ({
  cardBackgroundColor,
  tvl,
}) => {
  const [simulationValue, setSimulationValue] = useState(tvl ? Math.min(tvl, max) : 500000)
  const sliderWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sliderWrapperRef.current) {
      const percentage = (simulationValue / max) * 100

      sliderWrapperRef.current.style.setProperty('--slider-value', `${percentage}%`)
    }
  }, [simulationValue])

  return (
    <div className={classNames.beachClubRewardSimulationWrapper}>
      <Text
        as="p"
        variant="p1semi"
        style={{ color: 'var(--earn-protocol-secondary-60)', textAlign: 'left', width: '100%' }}
      >
        Referral Reward Simulation
      </Text>
      <Card
        style={{
          backgroundColor: cardBackgroundColor ?? 'var(--earn-protocol-neutral-95)',
        }}
        className={classNames.cardWrapper}
      >
        <div className={classNames.textual}>
          <Text as="h2" variant="h2">
            {formatWithSeparators(getMultiplier(simulationValue) * simulationValue, {
              precision: 2,
            })}
          </Text>
          <Text
            as="p"
            variant="p1semi"
            style={{
              color: 'var(--beach-club-link)',
              textAlign: 'center',
            }}
          >
            Projected Yearly SUMR Rewards
          </Text>
        </div>
        <div className={classNames.textual}>
          <Text as="h2" variant="h2">
            <Text as="span" variant="p2semi">
              up to{' '}
            </Text>
            $
            {formatWithSeparators(0.0005 * simulationValue, {
              precision: 2,
            })}
          </Text>
          <Text
            as="p"
            variant="p1semi"
            style={{
              color: 'var(--beach-club-link)',
              textAlign: 'center',
            }}
          >
            Yearly Earned Fees
          </Text>
        </div>
      </Card>
      <div className={classNames.sliderWrapper} ref={sliderWrapperRef}>
        <input
          type="range"
          min={0}
          max={max}
          value={simulationValue}
          onChange={(e) => setSimulationValue(Number(e.target.value))}
          className={classNames.slider}
        />
        <div className={classNames.sliderLabels}>
          {['10k', '250k', '500k', '750k', '1M'].map((value) => (
            <Text
              as="p"
              variant="p1semi"
              style={{ color: 'var(--earn-protocol-secondary-60)' }}
              key={value}
            >
              {value}
            </Text>
          ))}
        </div>
      </div>
      <Text
        as="p"
        variant="p1semi"
        style={{ color: 'var(--earn-protocol-secondary-60)', marginTop: 'var(--general-space-24)' }}
      >
        Cumulative TVL
      </Text>
    </div>
  )
}
