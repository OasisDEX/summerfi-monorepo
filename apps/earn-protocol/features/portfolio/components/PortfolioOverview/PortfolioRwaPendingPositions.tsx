import { Card, getVaultPositionUrl, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { type RoundState, RoundsVaultType } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import Link from 'next/link'

import { type RwaReceiptStatus } from '@/app/server-handlers/sdk/get-rwa-receipts'

import portfolioOverviewStyles from './PortfolioOverview.module.css'

/**
 * A pending RWA position (ERC-1155 receipt) denormalised with the display fields needed to render
 * it in the portfolio: the receipt data plus its vault's token + the link target to manage it.
 * `roundId`/`balance` are strings (JSON-safe) — see {@link RwaServerReceipt}.
 */
export type PortfolioRwaPendingPosition = {
  fleetAddress: string
  network: SupportedSDKNetworks
  // Slug (or address) used to build the vault position URL.
  vaultId: string
  tokenSymbol: string
  tokenDecimals: number
  vaultType: RoundsVaultType
  roundId: string
  balance: string
  roundState: RoundState
  status: RwaReceiptStatus
}

const statusColor: { [key in RwaReceiptStatus]: string } = {
  claimable: 'var(--earn-protocol-success-100)',
  cancellable: 'var(--earn-protocol-secondary-60)',
  pending: 'var(--earn-protocol-secondary-60)',
}

// The "cancellable" (round still open) label depends on the rounds-vault side: an Input receipt is
// a pending deposit, an Output receipt a pending withdrawal.
const statusLabel = (position: PortfolioRwaPendingPosition): string => {
  if (position.status === 'claimable') {
    return 'Claimable'
  }
  if (position.status === 'pending') {
    return 'Settling'
  }

  return position.vaultType === RoundsVaultType.Input ? 'Pending deposit' : 'Pending withdrawal'
}

/**
 * Lists the wallet's pending RWA positions (un-settled deposit/withdraw receipts) in the portfolio.
 * Each row links to the vault's position page, where the claim/cancel actions live — the portfolio
 * surfaces them, the vault page acts on them.
 */
export const PortfolioRwaPendingPositions = ({
  pendingPositions,
  viewWalletAddress,
}: {
  pendingPositions: PortfolioRwaPendingPosition[]
  viewWalletAddress: string
}) => {
  if (pendingPositions.length === 0) {
    return (
      <div className={portfolioOverviewStyles.noPositionsWrapper}>
        <Text as="h5" variant="h5">
          You don’t have any pending positions
        </Text>
        <Text as="p" variant="p2">
          RWA deposits and withdrawals enter a round and become claimable once it settles.
        </Text>
      </div>
    )
  }

  return (
    <div className={portfolioOverviewStyles.portfolioDcaPositionsListWrapper}>
      {pendingPositions.map((position) => {
        const typeLabel = position.vaultType === RoundsVaultType.Input ? 'Deposit' : 'Withdrawal'
        const humanBalance = new BigNumber(position.balance).shiftedBy(-position.tokenDecimals)
        const manageUrl = getVaultPositionUrl({
          network: position.network,
          vaultId: position.vaultId,
          walletAddress: viewWalletAddress,
        })

        return (
          <Card
            key={`${position.fleetAddress}-${position.vaultType}-${position.roundId}`}
            variant="cardPrimary"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-8)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text as="p" variant="p3semi">
                Round #{position.roundId} · {typeLabel}
              </Text>
              <Text as="span" variant="p4semi" style={{ color: statusColor[position.status] }}>
                {statusLabel(position)}
              </Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text as="span" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                {formatCryptoBalance(humanBalance)} {position.tokenSymbol}
              </Text>

              <Link href={manageUrl}>
                <WithArrow as="span" variant="p4semi" style={{ marginRight: '18px' }}>
                  Manage
                </WithArrow>
              </Link>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
