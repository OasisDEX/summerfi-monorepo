import { type FC } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import riskManagedPillStyles from './RiskManagedPill.module.css'

export const RiskManagedPill: FC<{
  isDaoManagedVault?: boolean
  small?: boolean
  big?: boolean
}> = ({ isDaoManagedVault = 'lower', small, big }) => {
  return (
    <div className={riskManagedPillStyles.pillWrapper}>
      <Text
        variant={small ? 'p4semi' : big ? 'p1semi' : 'p3semi'}
        className={riskManagedPillStyles.pillText}
      >
        {isDaoManagedVault ? <>DAO&nbsp;Risk-Managed</> : <>Risk-Managed&nbsp;by&nbsp;BA</>}
      </Text>
    </div>
  )
}
