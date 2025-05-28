import { BeachClubRewardSimulation, Text } from '@summerfi/app-earn-ui'

import classNames from './BeachClubHowMuchCouldEarn.module.css'

export const BeachClubHowMuchCouldEarn = () => {
  return (
    <div className={classNames.beachClubHowMuchCouldEarnWrapper}>
      <Text as="h3" variant="h3">
        See how much you could earn
      </Text>
      <BeachClubRewardSimulation cardBackgroundColor="var(--earn-protocol-neutral-90)" />
    </div>
  )
}
