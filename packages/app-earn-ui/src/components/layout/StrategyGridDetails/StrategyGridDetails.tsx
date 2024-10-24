'use client'

import { type ReactNode } from 'react'
import { type SDKVaultType } from '@summerfi/app-types'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { StrategyTitleWithRisk } from '@/components/molecules/StrategyTitleWithRisk/StrategyTitleWithRisk'
import { getStrategyUrl } from '@/helpers/get-strategy-url'

import strategyGridDetailsStyles from './StrategyGridDetails.module.scss'

export const StrategyGridDetails = ({
  strategy,
  children,
}: {
  strategy: SDKVaultType
  children: ReactNode
}) => {
  return (
    <>
      <div className={strategyGridDetailsStyles.strategyGridDetailsBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/earn">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn /
            </Text>
          </Link>
          <Link href={getStrategyUrl(strategy)}>
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              {' '}
              {strategy.id}{' '}
            </Text>
          </Link>
          <Text as="span" variant="p3" color="white">
            / Details
          </Text>
        </div>
      </div>
      <div className={strategyGridDetailsStyles.strategyGridDetailsWrapper}>
        <div className={strategyGridDetailsStyles.strategyGridDetailsHeaderWrapper}>
          <StrategyTitleWithRisk
            symbol={strategy.inputToken.symbol}
            risk="low"
            networkName={strategy.protocol.network}
          />
          <Button variant="primarySmall" style={{ height: '48px', paddingRight: '40px' }}>
            <Link href="/">
              <WithArrow as="span" variant="p2semi">
                Deposit
              </WithArrow>
            </Link>
          </Button>
        </div>
        <div className={strategyGridDetailsStyles.strategyGridDetailsContentWrapper}>
          {children}
        </div>
      </div>
    </>
  )
}
