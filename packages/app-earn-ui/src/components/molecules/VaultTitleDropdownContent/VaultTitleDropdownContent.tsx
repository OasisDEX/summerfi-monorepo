import type { FC } from 'react'
import { SDKNetwork, type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Text } from '@/components/atoms/Text/Text.tsx'
import { riskColors } from '@/helpers/risk-colors.ts'

import classNames from './VaultTitleDropdownContent.module.scss'

interface VaultDropdownContentProps {
  vault: SDKVaultsListType[number]
  link: string
}

const networkNameIconMap = {
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
      <Text as="p" variant="p4semi" style={{ color: riskColors.low }}>
        {capitalize('low')} risk
      </Text>
    </div>
  </Link>
)
