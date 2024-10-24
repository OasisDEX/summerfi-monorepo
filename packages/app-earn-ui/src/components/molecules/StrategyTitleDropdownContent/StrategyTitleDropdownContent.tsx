import type { FC } from 'react'
import { SDKNetwork, type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Text } from '@/components/atoms/Text/Text.tsx'
import { getStrategyUrl } from '@/helpers/get-strategy-url'
import { riskColors } from '@/helpers/risk-colors.ts'

import classNames from './StrategyTitleDropdownContent.module.scss'

interface StrategyDropdownContentProps {
  strategy: SDKVaultsListType[number]
}

const networkNameIconMap = {
  [SDKNetwork.ArbitrumOne]: <Icon iconName="network_arbitrum" size={10} />,
  [SDKNetwork.Base]: <Icon iconName="network_base" size={10} />,
}

export const StrategyTitleDropdownContent: FC<StrategyDropdownContentProps> = ({ strategy }) => (
  <Link href={getStrategyUrl(strategy)}>
    <div className={classNames.wrapper}>
      <div className={classNames.iconWithSymbolWrapper}>
        <Icon tokenName={strategy.inputToken.symbol as TokenSymbolsList} variant="m" />
        <div className={classNames.networkIconWrapper}>
          {networkNameIconMap[strategy.protocol.network]}
        </div>
        <Text as="p" variant="p1semi">
          {strategy.inputToken.symbol}
        </Text>
      </div>
      <Text as="p" variant="p4semi" style={{ color: riskColors.low }}>
        {capitalize('low')} risk
      </Text>
    </div>
  </Link>
)
