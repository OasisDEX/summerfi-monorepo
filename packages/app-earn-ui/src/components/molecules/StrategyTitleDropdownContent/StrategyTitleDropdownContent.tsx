import type { FC } from 'react'
import { type EarnProtocolStrategy, NetworkNames } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Text } from '@/components/atoms/Text/Text.tsx'
import { riskColors } from '@/helpers/risk-colors.ts'

import classNames from './StrategyTitleDropdownContent.module.scss'

interface StrategyDropdownContentProps {
  strategy: EarnProtocolStrategy
}

const networkNameIconMap = {
  [NetworkNames.ethereumMainnet]: <Icon iconName="network_ethereum" size={10} />,
  [NetworkNames.baseMainnet]: <Icon iconName="network_base" size={10} />,
  [NetworkNames.arbitrumMainnet]: <Icon iconName="network_arbitrum" size={10} />,
  [NetworkNames.optimismMainnet]: <Icon iconName="network_optimism" size={10} />,
}

export const StrategyTitleDropdownContent: FC<StrategyDropdownContentProps> = ({ strategy }) => (
  <Link href={`/earn/${strategy.network}/position/${strategy.id}`}>
    <div className={classNames.wrapper}>
      <div className={classNames.iconWithSymbolWrapper}>
        <Icon tokenName={strategy.symbol} variant="m" />
        <div className={classNames.networkIconWrapper}>{networkNameIconMap[strategy.network]}</div>
        <Text as="p" variant="p1semi">
          {strategy.symbol}
        </Text>
      </div>
      <Text as="p" variant="p4semi" style={{ color: riskColors[strategy.risk] }}>
        {capitalize(strategy.risk)} risk
      </Text>
    </div>
  </Link>
)
