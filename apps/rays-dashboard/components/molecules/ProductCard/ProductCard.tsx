import { type FC } from 'react'
import { type AutomationFeature } from '@summerfi/app-db'
import { type TokenSymbolsList } from '@summerfi/app-types'
import {
  AutomationIcon,
  Button,
  Card,
  ProtocolLabel,
  ProxyLinkComponent,
  Text,
  TokensGroup,
} from '@summerfi/app-ui'
import Link from 'next/link'

import { type NetworkNames, networksByName } from '@/constants/networks-list'
import { type LendingProtocolConfig } from '@/helpers/lending-protocols-configs'
import { trackButtonClick } from '@/helpers/mixpanel'

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
  userAddress?: string
  currentPath: string
  productType: string
  btn: {
    label: string
    link: string
  }
}

export const ProductCard: FC<ProductCardProps> = ({
  title,
  automation,
  tokens,
  userAddress,
  currentPath,
  productType,
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
        <Link passHref legacyBehavior prefetch={false} href={btn.link} className={classNames.link}>
          <ProxyLinkComponent target="_blank">
            <Button
              variant="colorful"
              onClick={() => {
                trackButtonClick({
                  id: 'ProductCardAction',
                  page: currentPath,
                  userAddress,
                  strategy: title ?? tokens.join('/'),
                  link: btn.link,
                  network,
                  productType,
                  protocol: protocolConfig.label,
                })
              }}
            >
              <span>{btn.label}</span>
            </Button>
          </ProxyLinkComponent>
        </Link>
      </div>
    </Card>
  )
}
