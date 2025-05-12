import { type FC, Fragment } from 'react'
import { Card, getVaultsProtocolsList, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import classNames from './ProtocolStats.module.css'

interface ProtocolStatsProps {
  vaultsList: SDKVaultsListType
}

export const ProtocolStats: FC<ProtocolStatsProps> = ({ vaultsList }) => {
  const supportedProtocolsCount = getVaultsProtocolsList(vaultsList).length
  const totalAssets = vaultsList.reduce((acc, vault) => acc + Number(vault.totalValueLockedUSD), 0)

  const data = [
    {
      title: 'Total deposits',
      value: `$${formatCryptoBalance(totalAssets)}`,
    },
    {
      title: 'Users',
      value: '3,000+',
    },
    {
      title: 'Markets Optimized',
      value: supportedProtocolsCount,
    },
  ]

  return (
    <Card variant="cardSecondary" className={classNames.protocolStatsWrapper}>
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
              {item.value}
            </Text>
          </div>
          {index !== data.length - 1 && <div className={classNames.divider} />}
        </Fragment>
      ))}
    </Card>
  )
}
