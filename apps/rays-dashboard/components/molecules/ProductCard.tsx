import { FC } from 'react'
import { AutomationIcon, Button, Card, ProtocolLabel, Text, TokensGroup } from '@summerfi/app-ui'
import Link from 'next/link'

import { NetworkNames, networksByName } from '@/constants/networks-list'
import { LendingProtocolConfig } from '@/helpers/lending-protocols-configs'

import classNames from '@/components/molecules/ProductCard.module.scss'

interface AutomationItem {
  type: 'stopLoss' | 'autoBuy' | 'autoSell' | 'takeProfit'
  tooltip: string
  label: string
  enabled: boolean
}

// dummy for now
export const automationItems: AutomationItem[] = [
  {
    type: 'stopLoss',
    tooltip: 'Stop Loss',
    label: 'Stop Loss',
    enabled: false,
  },
  {
    type: 'autoBuy',
    tooltip: 'Auto Buy',
    label: 'Auto Buy',
    enabled: true,
  },
  {
    type: 'autoSell',
    tooltip: 'Auto Sell',
    label: 'Auto Sell',
    enabled: false,
  },
  {
    type: 'takeProfit',
    tooltip: 'Take Profit',
    label: 'Take Profit',
    enabled: false,
  },
]

interface ProductCardProps {
  automation: AutomationItem[]
  tokens: string[]
  protocolConfig: LendingProtocolConfig
  network: NetworkNames
  btn: {
    label: string
    link: '/'
  }
}

export const ProductCard: FC<ProductCardProps> = ({
  automation,
  tokens,
  protocolConfig,
  network,
  btn,
}) => {
  return (
    <div className={classNames.cardWrapper}>
      <Card>
        <div className={classNames.content}>
          <div className={classNames.headingWrapper}>
            <div className={classNames.generalInfoWrapper}>
              <TokensGroup tokens={tokens} />
              <div className={classNames.groupWrapper}>
                <Text as="h5" variant="h5">
                  {tokens.join('/')}
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
                <div className={classNames.automationItem} key={item.label}>
                  <AutomationIcon type={item.type} tooltip={item.tooltip} enabled={item.enabled} />
                  <Text as="p" variant="p4semi" style={{ color: 'var(--color-primary-30' }}>
                    + {item.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <Link href={btn.link} className={classNames.link}>
            <Button variant="colorful">
              <span>{btn.label}</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
