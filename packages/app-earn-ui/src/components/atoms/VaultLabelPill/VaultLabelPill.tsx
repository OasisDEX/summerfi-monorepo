import { type CSSProperties, type FC } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import vaultLabelPillStyles from './VaultLabelPill.module.css'

/**
 * Small outlined pill shown next to a vault title. Reused for the different vault "badges":
 *  - RWA vaults              → `RWA`
 *  - DAO risk-managed vaults → `DAO Risk-Managed`
 *  - otherwise               → `Risk-Managed by Block Analitica`
 *
 * `isRwaVault` takes precedence over the risk-managed labels.
 */
export const VaultLabelPill: FC<{
  isDaoManagedVault?: boolean
  isRwaVault?: boolean
  small?: boolean
  big?: boolean
  style?: CSSProperties
  noNbsp?: boolean
}> = ({ isDaoManagedVault = false, isRwaVault = false, small, big, style, noNbsp = false }) => {
  return (
    <div className={vaultLabelPillStyles.pillWrapper} style={style}>
      <Text
        variant={small ? 'p4semi' : big ? 'p1semi' : 'p3semi'}
        className={vaultLabelPillStyles.pillText}
      >
        {isRwaVault ? (
          <>RWA</>
        ) : isDaoManagedVault ? (
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
