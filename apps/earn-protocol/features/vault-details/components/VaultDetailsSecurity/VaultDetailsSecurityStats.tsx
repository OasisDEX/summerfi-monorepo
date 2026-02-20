import { type ReactNode, useMemo } from 'react'
import { Card, DataBlock } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, formatWithSeparators } from '@summerfi/app-utils'
import Image from 'next/image'
import Link from 'next/link'

import blockAnalyticaLogo from '@/public/img/misc/block-analytica.svg'

import { VaultDetailsSecurityStatsHeader } from './VaultDetailsSecurityStatsHeader'

import classNames from './VaultDetailsSecurity.module.css'

interface VaultDetailsSecurityStatsProps {
  totalRebalanceActions: number
  totalUsers: number
  tvl: number
  vault?: SDKVaultishType
}

export const VaultDetailsSecurityStats = ({
  totalRebalanceActions,
  totalUsers,
  tvl,
  vault,
}: VaultDetailsSecurityStatsProps) => {
  const totalAssets = useMemo(() => tvl, [tvl])

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
    vault?.isDaoManaged
      ? false
      : {
          title: 'Risk Curators',
          value: (
            <Link href="https://blockanalitica.com/" target="_blank">
              <Image src={blockAnalyticaLogo} alt="Block Analitica" height={30} />
            </Link>
          ),
        },
  ].filter(Boolean) as { title: string; value: ReactNode }[]

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
