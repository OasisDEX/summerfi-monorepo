import { Icon, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'

import controlsPermit2AuthorizationStyles from './ControlsPermit2Authorization.module.css'

type ControlsPermit2AuthorizationProps = {
  tokenSymbol: string
}

export const ControlsPermit2Authorization = ({
  tokenSymbol,
}: ControlsPermit2AuthorizationProps) => {
  return (
    <div className={controlsPermit2AuthorizationStyles.wrapper}>
      <Icon tokenName={tokenSymbol.toUpperCase() as TokenSymbolsList} size={64} />
      <Text variant="p2semi" className={controlsPermit2AuthorizationStyles.tokenName}>
        {tokenSymbol}
      </Text>
      <Text variant="p2" className={controlsPermit2AuthorizationStyles.descriptionText}>
        Allow the Permit2 contract to use your {tokenSymbol}. Permit2 is an industry-standard
        approval contract — this one-time approval enables gasless token permissions across any dApp
        that supports it (Summer.fi included).
      </Text>
    </div>
  )
}
