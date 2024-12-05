'use client'

import { type FC, type ReactNode } from 'react'
import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/armada-protocol-common'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getVaultUrl } from '@/helpers/get-vault-url'

import vaultManageGridStyles from './VaultManageGrid.module.scss'

interface VaultManageGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  detailsContent: ReactNode
  sidebarContent: ReactNode
  connectedWalletAddress?: string
  viewWalletAddress: string
  isMobile?: boolean
}

export const VaultManageGrid: FC<VaultManageGridProps> = ({
  vault,
  vaults,
  detailsContent,
  sidebarContent,
  position,
  connectedWalletAddress,
  viewWalletAddress,
  isMobile,
}) => {
  const apr30d = formatDecimalAsPercent(new BigNumber(vault.apr30d).div(100))
  const aprCurrent = formatDecimalAsPercent(new BigNumber(vault.calculatedApr).div(100))
  const noOfDeposits = position.deposits.length.toString()

  const inputTokenPriceUSD = vault.inputTokenPriceUSD ?? 0

  const netContribution = new BigNumber(position.amount.amount)
  const netContributionUSD = netContribution.times(inputTokenPriceUSD)

  const totalDepositedInToken = position.deposits.reduce(
    (acc, deposit) => acc.plus(deposit.amount),
    new BigNumber(0),
  )

  const totalWithdrawnInToken = position.withdrawals.reduce(
    (acc, withdrawal) => acc.plus(withdrawal.amount),
    new BigNumber(0),
  )

  const earnedInToken = netContribution.minus(totalDepositedInToken.minus(totalWithdrawnInToken))
  const earnedInUSD = earnedInToken.times(inputTokenPriceUSD)

  return (
    <>
      <div className={vaultManageGridStyles.vaultManageGridBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/earn">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn
            </Text>
          </Link>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <Link href={getVaultUrl(vault)} style={{ color: 'white' }}>
            <Text as="span" variant="p3">
              {vault.customFields?.name ?? vault.id}
            </Text>
          </Link>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <Text as="span" variant="p3" color="white">
            {viewWalletAddress.toLowerCase() === connectedWalletAddress?.toLowerCase()
              ? 'Your'
              : viewWalletAddress}{' '}
            Position
          </Text>
        </div>
      </div>
      <div className={vaultManageGridStyles.vaultManageGridPositionWrapper}>
        <div>
          <div className={vaultManageGridStyles.vaultManageGridTopLeftWrapper}>
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
          <SimpleGrid
            columns={isMobile ? 1 : 3}
            rows={isMobile ? 3 : 1}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Earned"
                value={
                  <>
                    {formatCryptoBalance(earnedInToken)}&nbsp;{vault.inputToken.symbol}
                  </>
                }
                subValue={`$${formatCryptoBalance(earnedInUSD)}`}
                subValueType="neutral"
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Net Contribution"
                value={`$${formatCryptoBalance(netContributionUSD)}`}
                // TODO: fill data
                subValue={`# of Deposits: ${noOfDeposits}`}
                subValueSize="medium"
                subValueStyle={{ color: 'var(--earn-protocol-success-100)' }}
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="30d APY"
                value={apr30d}
                subValue={`Current APY: ${aprCurrent}`}
                subValueType="neutral"
                subValueSize="medium"
              />
            </Box>
          </SimpleGrid>
          <Box className={vaultManageGridStyles.leftBlock}>{detailsContent}</Box>
        </div>
        <div className={vaultManageGridStyles.rightBlockWrapper}>
          <div className={vaultManageGridStyles.rightBlock}>{sidebarContent}</div>
        </div>
      </div>
      {isMobile && <div className={vaultManageGridStyles.rightBlockMobile}>{sidebarContent}</div>}
    </>
  )
}
