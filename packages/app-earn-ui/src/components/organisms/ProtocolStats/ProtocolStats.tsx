import { type FC, Fragment } from 'react'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { getVaultsProtocolsList } from '@/helpers/get-vaults-protocols-list'

import classNames from './ProtocolStats.module.css'

interface ProtocolStatsProps {
  vaultsList?: SDKVaultsListType
  noMargin?: boolean
}

export const ProtocolStats: FC<ProtocolStatsProps> = ({ vaultsList, noMargin = false }) => {
  const supportedProtocolsCount = getVaultsProtocolsList(vaultsList ?? []).length
  const totalAssets = vaultsList?.reduce((acc, vault) => acc + Number(vault.totalValueLockedUSD), 0)

  const data = [
    {
      title: 'Total deposits',
      value: `$${formatCryptoBalance(totalAssets ?? 0)}`,
    },
    {
      title: 'Users',
      value: '5,000+',
    },
    {
      title: 'Markets Optimized',
      value: supportedProtocolsCount,
    },
  ]

  return (
    <Card
      variant="cardSecondary"
      className={clsx(classNames.protocolStatsWrapper, {
        [classNames.noMargin]: noMargin,
      })}
    >
      {data.map((item, index) => (
        <Fragment key={item.title}>
          <div className={classNames.dataBlock}>
            <Text
              as="p"
              variant="p3semi"
              style={{
                color: 'var(--earn-protocol-neutral-40)',
                marginBottom: 'var(--general-space-4)',
              }}
            >
              {item.title}
            </Text>
            <Text as="h3" variant="h3">
              {vaultsList ? (
                item.value
              ) : (
                <SkeletonLine width={146} height={25} style={{ margin: '7px 0 10px 0' }} />
              )}
            </Text>
          </div>
          {index !== data.length - 1 && <div className={classNames.divider} />}
        </Fragment>
      ))}
    </Card>
  )
}
