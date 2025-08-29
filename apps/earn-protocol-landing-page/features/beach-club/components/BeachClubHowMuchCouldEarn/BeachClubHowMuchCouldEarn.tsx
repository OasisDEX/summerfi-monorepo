import { BeachClubRewardSimulation, Text } from '@summerfi/app-earn-ui'
import { debounce } from 'lodash-es'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import classNames from './BeachClubHowMuchCouldEarn.module.css'

export const BeachClubHowMuchCouldEarn = () => {
  const pathname = usePathname()
  const setSimulationValueCallback = debounce((value: string) => {
    EarnProtocolEvents.inputChanged({
      inputName: 'lp-beach-club-simulation-slider',
      value,
      page: pathname,
    })
  }, 1000)

  return (
    <div className={classNames.beachClubHowMuchCouldEarnWrapper}>
      <Text as="h3" variant="h3">
        See how much you could earn
      </Text>
      <BeachClubRewardSimulation
        cardBackgroundColor="var(--earn-protocol-neutral-90)"
        setSimulationValueCallback={setSimulationValueCallback}
      />
    </div>
  )
}
