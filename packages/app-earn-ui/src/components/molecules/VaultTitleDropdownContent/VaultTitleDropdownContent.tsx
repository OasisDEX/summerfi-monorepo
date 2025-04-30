import type { FC } from 'react'
import { SDKNetwork, type SDKVaultishType, type TokenSymbolsList } from '@summerfi/app-types'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { Text } from '@/components/atoms/Text/Text'
import { getDisplayToken } from '@/helpers/get-display-token'

import classNames from './VaultTitleDropdownContent.module.scss'

interface VaultDropdownContentProps {
  vault: SDKVaultishType
  link: string
  isDisabled?: boolean
}

const networkNameIconMap = {
  [SDKNetwork.Mainnet]: <Icon iconName="earn_network_ethereum" size={10} />,
  [SDKNetwork.ArbitrumOne]: <Icon iconName="earn_network_arbitrum" size={10} />,
  [SDKNetwork.Base]: <Icon iconName="earn_network_base" size={10} />,
  [SDKNetwork.SonicMainnet]: <Icon iconName="earn_network_sonic" size={10} />,
}

export const VaultTitleDropdownContent: FC<VaultDropdownContentProps> = ({
  vault,
  link,
  isDisabled,
}) => {
  const content = (
    <div
      className={classNames.wrapper}
      style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    >
      <div className={classNames.iconWithSymbolWrapper}>
        <Icon
          tokenName={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
          variant="m"
        />
        <div className={classNames.networkIconWrapper}>
          {networkNameIconMap[vault.protocol.network]}
        </div>
        <Text as="p" variant="p1semi">
          {getDisplayToken(vault.inputToken.symbol)}
        </Text>
      </div>
      <Risk risk={vault.customFields?.risk ?? 'lower'} variant="p4semi" />
    </div>
  )

  return isDisabled ? content : <Link href={link}>{content}</Link>
}
