import { useEffect, useRef, useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { formatShorthandNumber } from '@summerfi/app-utils'

import classNames from './BeachClubRewardSimulation.module.css'

const getMultiplier = (value: number) => {
  if (value < 10000) return 0.001 // 0.1%
  if (value < 100000) return 0.002
  if (value < 250000) return 0.003
  if (value < 500000) return 0.004

  return 0.005
}

const max = 1000000

export const BeachClubRewardSimulation = () => {
  const [simulationValue, setSimulationValue] = useState(500000)
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
          backgroundColor: 'var(--earn-protocol-neutral-95)',
          marginBottom: 'var(--general-space-24)',
        }}
      >
        <div className={classNames.textual}>
          <Text as="h1" variant="h1">
            {formatShorthandNumber(getMultiplier(simulationValue) * simulationValue, {
              precision: 2,
            })}
          </Text>
          <Text
            as="h5"
            variant="h5"
            style={{
              color: 'var(--earn-protocol-secondary-60)',
              marginBottom: 'var(--general-space-12)',
            }}
          >
            Base SUMR Rewards
          </Text>
          <Text as="p" variant="p1semi" style={{ color: 'var(--beach-club-link)' }}>
            +100% Lifetime boost on future SUMR rewards
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
