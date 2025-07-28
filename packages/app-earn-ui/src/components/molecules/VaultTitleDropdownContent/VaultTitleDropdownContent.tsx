import type { CSSProperties, FC } from 'react'
import { type SDKVaultishType, type TokenSymbolsList } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { Text } from '@/components/atoms/Text/Text'
import { networkNameIconNameMap } from '@/constants/icon-maps'
import { getDisplayToken } from '@/helpers/get-display-token'

import classNames from './VaultTitleDropdownContent.module.css'

interface VaultDropdownContentProps {
  vault: SDKVaultishType
  link: string
  isDisabled?: boolean
  style?: CSSProperties
}

export const VaultTitleDropdownContentBlock: FC<Omit<VaultDropdownContentProps, 'link'>> = ({
  vault,
  isDisabled,
  style,
}) => (
  <div
    className={classNames.wrapper}
    style={{
      opacity: isDisabled ? 0.5 : 1,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...style,
    }}
  >
    <div className={classNames.iconWithSymbolWrapper}>
      <Icon tokenName={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList} variant="m" />
      <div className={classNames.networkIconWrapper}>
        <Icon
          iconName={networkNameIconNameMap[supportedSDKNetwork(vault.protocol.network)]}
          size={10}
        />
      </div>
      <Text as="p" variant="p1semi">
        {getDisplayToken(vault.inputToken.symbol)}
      </Text>
    </div>
    <Risk risk={vault.customFields?.risk ?? 'lower'} variant="p4semi" />
  </div>
)

export const VaultTitleDropdownContent: FC<VaultDropdownContentProps> = ({
  vault,
  link,
  isDisabled,
  style = {},
}) => {
  return isDisabled ? (
    <VaultTitleDropdownContentBlock vault={vault} isDisabled={isDisabled} style={style} />
  ) : (
    <Link href={link}>
      <VaultTitleDropdownContentBlock vault={vault} isDisabled={isDisabled} style={style} />
    </Link>
  )
}
