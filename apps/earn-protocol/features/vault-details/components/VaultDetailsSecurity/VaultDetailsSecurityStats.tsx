import { useMemo } from 'react'
import { Card, DataBlock } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance, formatWithSeparators, zero } from '@summerfi/app-utils'
import Image from 'next/image'
import Link from 'next/link'

import blockAnalyticaLogo from '@/public/img/misc/block-analytica.svg'

import { VaultDetailsSecurityStatsHeader } from './VaultDetailsSecurityStatsHeader'

import classNames from './VaultDetailsSecurity.module.css'

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
  const totalAssets = useMemo(
    () => vaults.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
    [vaults],
  )

  const dataBlocks = [
    {
      title: 'Lazy Summer Protocol TVL',
      value: formatCryptoBalance(totalAssets),
    },
    {
      title: 'Total Users',
      value: formatWithSeparators(totalUsers),
    },
    {
      title: 'Rebalancing Actions',
      value: formatWithSeparators(totalRebalanceActions),
    },
    {
      title: 'Risk Curators',
      value: (
        <Link href="https://blockanalitica.com/" target="_blank">
          <Image src={blockAnalyticaLogo} alt="Block Analytica" height={30} />
        </Link>
      ),
    },
  ]

  return (
    <>
      <VaultDetailsSecurityStatsHeader />
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
