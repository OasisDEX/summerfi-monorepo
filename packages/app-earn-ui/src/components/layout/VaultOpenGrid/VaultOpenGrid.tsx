'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getVaultUrl } from '@/helpers/get-vault-url'

import vaultOpenGridStyles from './VaultOpenGrid.module.scss'

interface VaultOpenGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  displayGraph?: boolean
  simulationGraph: ReactNode
  detailsContent: ReactNode
  sidebarContent: ReactNode
}

export const VaultOpenGrid: FC<VaultOpenGridProps> = ({
  vault,
  vaults,
  displayGraph,
  simulationGraph,
  detailsContent,
  sidebarContent,
}) => {
  const [displayGraphStaggered, setDisplayGraphStaggered] = useState(displayGraph)
  const apr30d = formatDecimalAsPercent(new BigNumber(vault.apr30d).div(100))
  const aprCurrent = formatDecimalAsPercent(new BigNumber(vault.calculatedApr).div(100))
  const totalValueLockedUSDParsed = formatCryptoBalance(new BigNumber(vault.totalValueLockedUSD))
  const totalValueLockedTokenParsed = formatCryptoBalance(
    new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayGraphStaggered(false)
    }, 1000)

    if (displayGraph) {
      clearInterval(timer)
      setDisplayGraphStaggered(true)
    }

    return () => {
      clearInterval(timer)
    }
  }, [displayGraph])

  return (
    <>
      <div className={vaultOpenGridStyles.vaultOpenGridBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/earn">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn / &nbsp;
            </Text>
          </Link>
          <Text as="span" variant="p3" color="white">
            {vault.id}
          </Text>
        </div>
      </div>
      <div className={vaultOpenGridStyles.vaultOpenGridPositionWrapper}>
        <div>
          <div className={vaultOpenGridStyles.vaultOpenGridTopLeftWrapper}>
            <Dropdown
              options={vaults.map((item) => ({
                value: item.id,
                content: <VaultTitleDropdownContent vault={item} link={getVaultUrl(item)} />,
              }))}
              dropdownValue={{
                value: vault.id,
                content: <VaultTitleDropdownContent vault={vault} link={getVaultUrl(vault)} />,
              }}
            >
              <VaultTitleWithRisk
                symbol={vault.inputToken.symbol}
                // TODO: fill data
                risk="low"
                networkName={vault.protocol.network}
              />
            </Dropdown>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              <BonusLabel rays="1,111" />
            </Text>
          </div>
          <AnimateHeight id="simulation-graph" scale show={displayGraphStaggered}>
            {simulationGraph}
          </AnimateHeight>
          <SimpleGrid
            columns={2}
            rows={2}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="30d APY"
                value={apr30d}
                subValue="+2.1% Median DeFi Yield"
                subValueType="positive"
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Current APY"
                value={aprCurrent}
                subValue="+1.7% Median DeFi Yield"
                subValueType="positive"
                subValueSize="medium"
              />
            </Box>
            <Box
              style={{
                gridColumn: '1/3',
              }}
            >
              <DataBlock
                size="large"
                titleSize="small"
                title="Assets in vault"
                value={`$${totalValueLockedUSDParsed}`}
                subValue={`${totalValueLockedTokenParsed} ${vault.inputToken.symbol}`}
                subValueSize="medium"
              />
            </Box>
          </SimpleGrid>
          <Box className={vaultOpenGridStyles.leftBlock}>{detailsContent}</Box>
        </div>
        <div className={vaultOpenGridStyles.rightBlockWrapper}>
          <div className={vaultOpenGridStyles.rightBlock}>{sidebarContent}</div>
        </div>
      </div>
      <div className={vaultOpenGridStyles.rightBlockMobile}>{sidebarContent}</div>
    </>
  )
}
