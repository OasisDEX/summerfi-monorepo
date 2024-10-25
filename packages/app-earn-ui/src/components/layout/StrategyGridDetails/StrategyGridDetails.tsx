'use client'

import { type ReactNode } from 'react'
import { type SDKVaultsListType, type SDKVaultType } from '@summerfi/app-types'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown.tsx'
import { StrategyTitleDropdownContent } from '@/components/molecules/StrategyTitleDropdownContent/StrategyTitleDropdownContent.tsx'
import { StrategyTitleWithRisk } from '@/components/molecules/StrategyTitleWithRisk/StrategyTitleWithRisk'
import { getStrategyDetailsUrl, getStrategyUrl } from '@/helpers/get-strategy-url'

import strategyGridDetailsStyles from './StrategyGridDetails.module.scss'

export const StrategyGridDetails = ({
  strategy,
  strategies,
  children,
}: {
  strategy: SDKVaultType
  strategies: SDKVaultsListType
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
          <Dropdown
            options={strategies.map((item) => ({
              value: item.id,
              content: (
                <StrategyTitleDropdownContent strategy={item} link={getStrategyDetailsUrl(item)} />
              ),
            }))}
            dropdownValue={{
              value: strategy.id,
              content: (
                <StrategyTitleDropdownContent
                  strategy={strategy}
                  link={getStrategyDetailsUrl(strategy)}
                />
              ),
            }}
          >
            <StrategyTitleWithRisk
              symbol={strategy.inputToken.symbol}
              // TODO: fill data
              risk="low"
              networkName={strategy.protocol.network}
            />
          </Dropdown>
          <Button variant="primarySmall" style={{ height: '48px', paddingRight: '40px' }}>
            <Link href={getStrategyUrl(strategy)}>
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
