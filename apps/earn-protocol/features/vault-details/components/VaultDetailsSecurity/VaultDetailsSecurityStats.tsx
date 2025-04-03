import { useMemo } from 'react'
import { Card, DataBlock, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance, zero } from '@summerfi/app-utils'

import classNames from './VaultDetailsSecurity.module.scss'

interface VaultDetailsSecurityStatsProps {
  vaults: SDKVaultsListType
  totalRebalanceActions: number
  totalUsers: number
}

export const VaultDetailsSecurityStats = ({
  vaults,
  totalRebalanceActions,
  totalUsers,
}: VaultDetailsSecurityStatsProps) => {
  const formattedTotalAssets = useMemo(() => {
    return formatCryptoBalance(
      vaults.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
    )
  }, [vaults])

  const dataBlocks = [
    {
      title: 'Lazy Summer Protocol TVL',
      value: formattedTotalAssets,
    },
    {
      title: 'Total Users',
      value: totalUsers,
    },
    {
      title: 'Rebalancing Actions',
      value: totalRebalanceActions,
    },
    {
      title: 'Risk Curators',
      value: '6 years',
    },
  ]

  return (
    <>
      <Text as="h5" variant="h5" style={{ marginBottom: 'var(--spacing-space-x-small)' }}>
        Security
      </Text>
      <Text
        as="p"
        variant="p2"
        style={{
          marginBottom: 'var(--spacing-space-large)',
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Card>
          <div className={classNames.dataBlockWrapper}>
            {dataBlocks.map((block) => (
              <DataBlock key={block.title} title={block.title} size="small" value={block.value} />
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
