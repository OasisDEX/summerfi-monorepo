import type { FC } from 'react'
import { SDKNetwork, type SDKVaultishType, type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { riskColors } from '@/helpers/risk-colors'

import classNames from './VaultTitleDropdownContent.module.scss'

interface VaultDropdownContentProps {
  vault: SDKVaultishType
  link: string
}

const networkNameIconMap = {
  [SDKNetwork.Mainnet]: <Icon iconName="network_ethereum" size={10} />,
  [SDKNetwork.ArbitrumOne]: <Icon iconName="network_arbitrum" size={10} />,
  [SDKNetwork.Base]: <Icon iconName="network_base" size={10} />,
}

export const VaultTitleDropdownContent: FC<VaultDropdownContentProps> = ({ vault, link }) => (
  <Link href={link}>
    <div className={classNames.wrapper}>
      <div className={classNames.iconWithSymbolWrapper}>
        <Icon tokenName={vault.inputToken.symbol as TokenSymbolsList} variant="m" />
        <div className={classNames.networkIconWrapper}>
          {networkNameIconMap[vault.protocol.network]}
        </div>
        <Text as="p" variant="p1semi">
          {vault.inputToken.symbol}
        </Text>
      </div>
      <Text
        as="p"
        variant="p4semi"
        style={{ color: riskColors[vault.customFields?.risk ?? 'medium'] }}
      >
        {capitalize(vault.customFields?.risk ?? 'medium')} risk
      </Text>
    </div>
  </Link>
)
