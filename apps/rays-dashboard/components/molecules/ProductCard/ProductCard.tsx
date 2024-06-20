import { FC } from 'react'
import type { AutomationFeature } from '@summerfi/app-db'
import {
  AutomationIcon,
  Button,
  Card,
  ProtocolLabel,
  Text,
  TokensGroup,
  TokenSymbolsList,
} from '@summerfi/app-ui'
import Link from 'next/link'

import { NetworkNames, networksByName } from '@/constants/networks-list'
import { LendingProtocolConfig } from '@/helpers/lending-protocols-configs'

import classNames from '@/components/molecules/ProductCard/ProductCard.module.scss'

interface AutomationItem {
  tooltip: string
  label: string
  enabled: boolean
}

const automationItemsMapper = {
  stopLoss: {
    tooltip: 'Stop Loss',
    label: 'Stop Loss',
    enabled: false,
  },
  trailingStopLoss: {
    tooltip: 'Trailing Stop Loss',
    label: 'Trailing Stop Loss',
    enabled: false,
  },
  autoSell: {
    tooltip: 'Auto Sell',
    label: 'Auto Sell',
    enabled: false,
  },
  autoBuy: {
    tooltip: 'Auto Buy',
    label: 'Auto Buy',
    enabled: false,
  },
  partialTakeProfit: {
    tooltip: 'Take Profit',
    label: 'Take Profit',
    enabled: false,
  },
} as { [key in AutomationFeature]: AutomationItem }

interface ProductCardProps {
  title?: string
  automation: AutomationFeature[]
  tokens: TokenSymbolsList[]
  protocolConfig: LendingProtocolConfig
  network: NetworkNames
  btn: {
    label: string
    link: string
  }
}

export const ProductCard: FC<ProductCardProps> = ({
  title,
  automation,
  tokens,
  protocolConfig,
  network,
  btn,
}) => {
  return (
    <Card className={classNames.cardWrapper}>
      <div className={classNames.content}>
        <div className={classNames.headingWrapper}>
          <div className={classNames.generalInfoWrapper}>
            <TokensGroup tokens={tokens} />
            <div className={classNames.groupWrapper}>
              <Text as="h5" variant="h5">
                {title ?? tokens.join('/')}
              </Text>
              <ProtocolLabel
                protocol={{
                  label: protocolConfig.label,
                  logo: { scale: protocolConfig.logoScale, src: protocolConfig.logo },
                }}
                network={{
                  badge: networksByName[network].badge,
                  label: protocolConfig.label,
                }}
              />
            </div>
          </div>
          <div className={classNames.automationWrapper}>
            {automation.map((item) => (
              <div className={classNames.automationItem} key={automationItemsMapper[item].label}>
                <AutomationIcon
                  type={item}
                  tooltip={automationItemsMapper[item].tooltip}
                  enabled={false}
                />
                <Text as="p" variant="p4semi" style={{ color: 'var(--color-primary-30' }}>
                  + {automationItemsMapper[item].label}
                </Text>
              </div>
            ))}
          </div>
        </div>
        <Link href={btn.link} className={classNames.link} target="_blank">
          <Button variant="colorful">
            <span>{btn.label}</span>
          </Button>
        </Link>
      </div>
    </Card>
  )
}
