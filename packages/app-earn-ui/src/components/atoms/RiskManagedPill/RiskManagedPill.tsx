import { type CSSProperties, type FC } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import riskManagedPillStyles from './RiskManagedPill.module.css'

export const RiskManagedPill: FC<{
  isDaoManagedVault?: boolean
  small?: boolean
  big?: boolean
  style?: CSSProperties
  noNbsp?: boolean
}> = ({ isDaoManagedVault = false, small, big, style, noNbsp = false }) => {
  return (
    <div className={riskManagedPillStyles.pillWrapper} style={style}>
      <Text
        variant={small ? 'p4semi' : big ? 'p1semi' : 'p3semi'}
        className={riskManagedPillStyles.pillText}
      >
        {isDaoManagedVault ? (
          noNbsp ? (
            <>DAO Risk-Managed</>
          ) : (
            <>DAO&nbsp;Risk-Managed</>
          )
        ) : noNbsp ? (
          <>Risk-Managed by Block Analitica</>
        ) : (
          <>Risk-Managed&nbsp;by&nbsp;Block&nbsp;Analitica</>
        )}
      </Text>
    </div>
  )
}
