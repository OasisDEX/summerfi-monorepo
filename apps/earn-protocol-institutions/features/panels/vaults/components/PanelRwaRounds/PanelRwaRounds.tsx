'use client'

import {
  type CSSProperties,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  Input,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { formatAddress, formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import { RoundState, RoundsVaultType, type TransactionInfo } from '@summerfi/sdk-common'

import { type RwaRoundPosition } from '@/app/server-handlers/institution/institution-vaults'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { getInstitutionVaultCacheTags } from '@/helpers/get-institution-vault-cache-tags'
import {
  getRwaEmergencyRollbackRoundId,
  getRwaNextRoundId,
  getRwaRetryRoundId,
  getRwaSetRoundSettledId,
} from '@/helpers/get-transaction-id'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { withRetry } from '@/helpers/with-retry'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

// How many rounds below the current one to scan for ones still awaiting settlement. In normal
// operation at most one round trails the open round; the window covers a backlog of un-settled rounds.
const SETTLEMENT_SCAN_WINDOW = 8n

const stateMeta: { [key in RoundState]: { label: string; color: string } } = {
  [RoundState.NotOpened]: { label: 'Not opened', color: 'var(--color-text-secondary)' },
  [RoundState.Opened]: { label: 'Open', color: 'var(--color-text-link)' },
  [RoundState.InSettlement]: { label: 'In settlement', color: 'var(--color-text-warning)' },
  [RoundState.Settled]: { label: 'Settled', color: 'var(--color-text-success)' },
}

const pillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  lineHeight: '18px',
  whiteSpace: 'nowrap',
}

// Each round renders in its own bordered box so adjacent rounds read as distinct groups.
const roundBoxStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '12px',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
}

const StatePill: FC<{ state: RoundState }> = ({ state }) => {
  const meta = stateMeta[state]

  return (
    <span style={{ ...pillStyle, color: meta.color, border: `1px solid ${meta.color}` }}>
      {meta.label}
    </span>
  )
}

type AddTx = (
  item: {
    id: string
    txDescription: ReactNode
    txLabel: { label: string; charge: 'positive' | 'negative' | 'neutral' }
  },
  tx: Promise<TransactionInfo>,
) => void

interface RoundSideProps {
  title: string
  vaultType: RoundsVaultType
  chainId: ReturnType<typeof urlNetworkToChainId>
  fleetAddress: `0x${string}`
  controlsDisabled: boolean
  sdk: ReturnType<typeof useAdminAppRwaSDK>
  addTransaction: AddTx
  refreshNonce: number
  positions: RwaRoundPosition[]
  // Share price (NAV) used to value Output (withdrawal) share positions in USD; null when unavailable.
  navPrice: number | null
}

const RoundSide: FC<RoundSideProps> = ({
  title,
  vaultType,
  chainId,
  fleetAddress,
  controlsDisabled,
  sdk,
  addTransaction,
  refreshNonce,
  positions,
  navPrice,
}) => {
  const { getRwaCurrentRound, getRwaRoundState } = sdk
  const [currentRound, setCurrentRound] = useState<bigint | null>(null)
  const [currentState, setCurrentState] = useState<RoundState | null>(null)
  // Rounds below the current one that are closed but not yet settled — the only ones Settle applies to.
  const [settlementRounds, setSettlementRounds] = useState<bigint[] | null>(null)
  const [recoveryRoundId, setRecoveryRoundId] = useState('')

  const refresh = useCallback(() => {
    const load = async () => {
      const round = await getRwaCurrentRound({ fleetAddress, chainId, vaultType })

      setCurrentRound(round)
      setCurrentState(await getRwaRoundState({ fleetAddress, chainId, roundId: round, vaultType }))

      const floor = round > SETTLEMENT_SCAN_WINDOW ? round - SETTLEMENT_SCAN_WINDOW : 0n
      const ids: bigint[] = []

      for (let r = round - 1n; r >= floor; r -= 1n) ids.push(r)
      const scanned = await Promise.all(
        ids.map((id) =>
          getRwaRoundState({ fleetAddress, chainId, roundId: id, vaultType })
            .then((state) => ({ id, state }))
            .catch(() => null),
        ),
      )

      setSettlementRounds(
        scanned
          .filter((x): x is { id: bigint; state: RoundState } => x !== null)
          .filter((x) => x.state === RoundState.InSettlement)
          .map((x) => x.id),
      )
    }

    withRetry(load).catch(() => {
      setCurrentRound(null)
      setCurrentState(null)
      setSettlementRounds(null)
    })
  }, [getRwaCurrentRound, getRwaRoundState, fleetAddress, chainId, vaultType])

  useEffect(() => {
    refresh()
  }, [refresh, refreshNonce])

  const recoveryRound = useMemo<bigint | null>(() => {
    if (!/^\d+$/u.test(recoveryRoundId.trim())) return null
    try {
      return BigInt(recoveryRoundId.trim())
    } catch {
      return null
    }
  }, [recoveryRoundId])

  // Current standing positions for this side, bucketed by round id for inline display under each round.
  const positionsByRound = useMemo(() => {
    const map = new Map<string, RwaRoundPosition[]>()

    for (const position of positions) {
      const existing = map.get(position.roundId)

      if (existing) existing.push(position)
      else map.set(position.roundId, [position])
    }

    return map
  }, [positions])

  const queue = useCallback(
    (params: {
      id: string
      label: string
      charge: 'positive' | 'negative' | 'neutral'
      description: ReactNode
      tx: Promise<TransactionInfo>
    }) => {
      try {
        addTransaction(
          {
            id: params.id,
            txDescription: params.description,
            txLabel: { label: params.label, charge: params.charge },
          },
          params.tx,
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction],
  )

  const onCloseRound = () =>
    queue({
      id: getRwaNextRoundId({ address: fleetAddress, chainId, vaultType }),
      label: 'Close round',
      charge: 'neutral',
      description: <Text variant="p3">close {title.toLowerCase()} (open next)</Text>,
      tx: sdk.getRwaNextRoundTx({ fleetAddress, chainId, vaultType }),
    })

  const onSettle = (roundId: bigint) =>
    queue({
      id: getRwaSetRoundSettledId({
        address: fleetAddress,
        chainId,
        vaultType,
        roundId: roundId.toString(),
      }),
      label: 'Settle',
      charge: 'positive',
      description: <Text variant="p3">settle round #{roundId.toString()}</Text>,
      tx: sdk.getRwaSetRoundSettledTx({ fleetAddress, chainId, vaultType, roundId }),
    })

  const onRecovery = (action: 'retry' | 'rollback') => {
    if (recoveryRound === null) return
    if (action === 'retry') {
      queue({
        id: getRwaRetryRoundId({
          address: fleetAddress,
          chainId,
          vaultType,
          roundId: recoveryRound.toString(),
        }),
        label: 'Retry',
        charge: 'neutral',
        description: <Text variant="p3">retry round #{recoveryRound.toString()}</Text>,
        tx: sdk.getRwaRetryRoundTx({ fleetAddress, chainId, vaultType, roundId: recoveryRound }),
      })

      return
    }
    queue({
      id: getRwaEmergencyRollbackRoundId({
        address: fleetAddress,
        chainId,
        vaultType,
        roundId: recoveryRound.toString(),
      }),
      label: 'Rollback',
      charge: 'negative',
      description: <Text variant="p3">emergency rollback round #{recoveryRound.toString()}</Text>,
      tx: sdk.getRwaEmergencyRollbackRoundTx({
        fleetAddress,
        chainId,
        vaultType,
        roundId: recoveryRound,
      }),
    })
  }

  const rowBetween: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  }

  const pluralNoun = vaultType === RoundsVaultType.Input ? 'deposits' : 'withdrawals'

  const formatPositionAmount = (position: RwaRoundPosition): string => {
    // Deposits are denominated in the underlying asset — show as-is.
    if (vaultType !== RoundsVaultType.Output) {
      return `${formatCryptoBalance(position.amount)} ${position.tokenSymbol}`
    }

    // Withdrawals are queued in vault shares. Value them in USD via the current NAV (an approximation
    // — pre-settlement rounds have no exchange rate yet). When NAV is unavailable, show the share
    // amount explicitly labelled "shares" rather than the share-token symbol, which can be mistaken
    // for the underlying asset.
    return navPrice !== null
      ? `$${formatFiatBalance(Number(position.amount) * navPrice)}`
      : `${formatCryptoBalance(position.amount)} shares`
  }

  // The standing deposits/withdrawals queued in a given round (account + current amount).
  const renderPositions = (roundId: bigint) => {
    const items = positionsByRound.get(roundId.toString()) ?? []

    if (items.length === 0) {
      return (
        <Text variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
          No {pluralNoun} in this round.
        </Text>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((position) => (
          <div key={`${position.roundId}-${position.account}`} style={rowBetween}>
            <Text
              as="span"
              variant="p4"
              style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}
            >
              {position.account ? formatAddress(position.account) : '—'}
            </Text>
            <Text as="span" variant="p4semi" style={{ whiteSpace: 'nowrap' }}>
              {formatPositionAmount(position)}
            </Text>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          ...rowBetween,
          justifyContent: 'flex-start',
        }}
      >
        <Text as="span" variant="p2semi">
          {title}
        </Text>
        {currentState !== null ? <StatePill state={currentState} /> : null}
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 340px' }}>
        <div style={roundBoxStyle}>
          <div style={rowBetween}>
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Current round&nbsp;
              <Text as="span" variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
                {currentRound === null ? '—' : `#${currentRound.toString()}`}
              </Text>
            </Text>
            <Button variant="secondarySmall" disabled={controlsDisabled} onClick={onCloseRound}>
              Close current round
            </Button>
          </div>
          {currentRound !== null ? renderPositions(currentRound) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text as="span" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
            ROUNDS IN SETTLEMENT
          </Text>
          {settlementRounds === null ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Loading…
            </Text>
          ) : settlementRounds.length === 0 ? (
            <div style={roundBoxStyle}>
              <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
                Nothing waiting for settlement.
              </Text>
            </div>
          ) : (
            settlementRounds
              .sort((roundIdA, roundIdB) => {
                return Number(roundIdA - roundIdB)
              })
              .map((roundId, itemIndex) => (
                <div key={roundId.toString()} style={roundBoxStyle}>
                  <div style={rowBetween}>
                    <Text variant="p3">
                      Round&nbsp;
                      <Text as="span" variant="p3semi">
                        #{roundId.toString()}
                      </Text>
                    </Text>
                    <Button
                      variant="primarySmall"
                      disabled={controlsDisabled || itemIndex !== 0}
                      onClick={() => onSettle(roundId)}
                    >
                      Settle
                    </Button>
                  </div>
                  {renderPositions(roundId)}
                </div>
              ))
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text as="span" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
            RECOVERY · ADVANCED
          </Text>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              variant="withBorder"
              placeholder="round id"
              value={recoveryRoundId}
              onChange={(e) => setRecoveryRoundId(e.target.value)}
              wrapperStyles={{ width: '120px' }}
              inputWrapperStyles={{
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '12px',
              }}
            />
            <Button
              variant="secondarySmall"
              disabled={controlsDisabled || recoveryRound === null}
              onClick={() => onRecovery('retry')}
            >
              Retry
            </Button>
            <Button
              variant="secondarySmall"
              disabled={controlsDisabled || recoveryRound === null}
              onClick={() => onRecovery('rollback')}
              style={{ color: 'var(--color-text-critical)' }}
            >
              Emergency rollback
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

interface PanelRwaRoundsProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
  // Standing per-round deposit/withdrawal positions, fetched server-side from the institutions-v2
  // subgraph and grouped by round under each side.
  positions: RwaRoundPosition[]
  // Share price (NAV) used to value Output (withdrawal) share positions in USD; null when unavailable.
  navPrice: number | null
  // True when the standing-positions fetch hit its per-side cap, so some rows may be omitted.
  positionsTruncated: boolean
}

export const PanelRwaRounds: FC<PanelRwaRoundsProps> = ({
  institutionName,
  clientId,
  vaultAddress,
  network,
  positions,
  navPrice,
  positionsTruncated,
}) => {
  const chainId = urlNetworkToChainId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const sdk = useAdminAppRwaSDK(clientId)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()
  const [refreshNonce, setRefreshNonce] = useState(0)

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain || !userWalletAddress

  const depositPositions = useMemo(
    () => positions.filter((position) => position.side === 'deposit'),
    [positions],
  )
  const withdrawalPositions = useMemo(
    () => positions.filter((position) => position.side === 'withdrawal'),
    [positions],
  )

  const onTxSuccess = () => {
    revalidateTags({
      tags: getInstitutionVaultCacheTags({ institutionName, vaultAddress, network }),
    })
    setRefreshNonce((n) => n + 1)
  }

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {positionsTruncated ? (
        <Text variant="p4" style={{ color: 'var(--color-text-warning)' }}>
          This vault has a large deposit/withdrawal queue — some positions may be omitted from the
          lists below.
        </Text>
      ) : null}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <RoundSide
          title="Deposit round (input)"
          vaultType={RoundsVaultType.Input}
          chainId={chainId}
          fleetAddress={fleetAddress}
          controlsDisabled={controlsDisabled}
          sdk={sdk}
          addTransaction={addTransaction}
          refreshNonce={refreshNonce}
          positions={depositPositions}
          navPrice={navPrice}
        />
        <RoundSide
          title="Withdraw round (output)"
          vaultType={RoundsVaultType.Output}
          chainId={chainId}
          fleetAddress={fleetAddress}
          controlsDisabled={controlsDisabled}
          sdk={sdk}
          addTransaction={addTransaction}
          refreshNonce={refreshNonce}
          positions={withdrawalPositions}
          navPrice={navPrice}
        />
      </div>

      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        transactionQueue={transactionQueue}
        chainId={chainId}
        removeTransaction={removeTransaction}
        onTxSuccess={onTxSuccess}
      />
    </Card>
  )
}
