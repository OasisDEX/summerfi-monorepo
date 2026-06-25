'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { AllocationBar, Button, Card, ERROR_TOAST_CONFIG, Table, Text } from '@summerfi/app-earn-ui'
import { type NetworkNames, type SDKVaultType } from '@summerfi/app-types'
import { formatWithSeparators, networkNameToSDKId } from '@summerfi/app-utils'
import { type TransactionInfo } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import {
  buildRebalanceTransaction,
  type RebalanceMove,
} from '@/app/server-handlers/institution/build-rebalance-transaction'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { getArksAllocation } from '@/features/panels/vaults/components/PanelVaultExposure/get-arks-allocation'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import { assetReallocationColumns } from './columns'
import {
  getAssetReallocationInitialBalanceState,
  getAssetReallocationModifiedVault,
} from './helpers'
import { assetReallocationMapper } from './mapper'

import styles from './PanelAssetReallocation.module.css'

interface PanelAssetReallocationProps {
  vault: SDKVaultType
  institutionName: string
  network: NetworkNames
}

export const PanelAssetReallocation: FC<PanelAssetReallocationProps> = ({
  vault,
  institutionName,
  network,
}) => {
  const [balanceAddChange, setBalanceAddChange] = useState(
    getAssetReallocationInitialBalanceState(vault),
  )
  const [balanceRemoveChange, setBalanceRemoveChange] = useState(
    getAssetReallocationInitialBalanceState(vault),
  )
  const chainId = networkNameToSDKId(network)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const onChange = useCallback(
    ({
      id,
      balanceChange,
      type,
    }: {
      id: string
      balanceChange: string
      type: 'add' | 'remove'
    }) => {
      // Only allow positive numbers (greater than 0) or empty string
      const sanitizedValue =
        balanceChange === '' || parseFloat(balanceChange) > 0 ? balanceChange : ''

      if (type === 'add') {
        setBalanceAddChange((prev) => ({ ...prev, [id]: sanitizedValue }))
      } else {
        setBalanceRemoveChange((prev) => ({ ...prev, [id]: sanitizedValue }))
      }
    },
    [],
  )

  const onCancel = useCallback(() => {
    setBalanceAddChange(getAssetReallocationInitialBalanceState(vault))
    setBalanceRemoveChange(getAssetReallocationInitialBalanceState(vault))
  }, [vault])

  // Convert the per-ark add/remove amounts into discrete ark→ark moves: greedily pour each ark's
  // removed balance (source) into the arks gaining balance (destinations). A valid rebalance is
  // net-zero (total removed === total added), so this fully consumes both sides.
  const buildMoves = useCallback((): RebalanceMove[] => {
    const sources = vault.arks
      .map((ark) => ({ ark: ark.id, remaining: new BigNumber(balanceRemoveChange[ark.id] || '0') }))
      .filter((source) => source.remaining.gt(0))
    const destinations = vault.arks
      .map((ark) => ({ ark: ark.id, remaining: new BigNumber(balanceAddChange[ark.id] || '0') }))
      .filter((destination) => destination.remaining.gt(0))

    const moves: RebalanceMove[] = []
    let sourceIndex = 0
    let destinationIndex = 0

    while (sourceIndex < sources.length && destinationIndex < destinations.length) {
      const source = sources[sourceIndex]
      const destination = destinations[destinationIndex]
      const amount = BigNumber.min(source.remaining, destination.remaining)

      if (amount.gt(0)) {
        moves.push({ fromArk: source.ark, toArk: destination.ark, amount: amount.toString() })
      }

      source.remaining = source.remaining.minus(amount)
      destination.remaining = destination.remaining.minus(amount)

      if (source.remaining.lte(0)) sourceIndex += 1
      if (destination.remaining.lte(0)) destinationIndex += 1
    }

    return moves
  }, [vault.arks, balanceAddChange, balanceRemoveChange])

  const totalBalance = useMemo(
    () =>
      vault.arks.reduce(
        (acc, ark) =>
          // eslint-disable-next-line no-mixed-operators
          acc + Number(ark.inputTokenBalance) / 10 ** vault.inputToken.decimals,
        0,
      ),
    [vault.arks, vault.inputToken.decimals],
  )

  const totalAdded = vault.arks.reduce(
    (acc, ark) => acc.plus(new BigNumber(balanceAddChange[ark.id] || '0')),
    new BigNumber(0),
  )
  const totalRemoved = vault.arks.reduce(
    (acc, ark) => acc.plus(new BigNumber(balanceRemoveChange[ark.id] || '0')),
    new BigNumber(0),
  )
  const netBalanceChange = totalAdded.minus(totalRemoved).toNumber()
  // A rebalance only moves funds between arks, so it must be net-zero with something actually moved.
  const isBalanced = totalRemoved.gt(0) && totalAdded.eq(totalRemoved)
  const hasAnyInput = totalAdded.gt(0) || totalRemoved.gt(0)

  const onConfirm = useCallback(() => {
    const moves = buildMoves()

    if (moves.length === 0) {
      return
    }

    const transactionId = `rebalance-${vault.id}-${chainId}-${moves
      .map((move) => `${move.fromArk}:${move.toArk}:${move.amount}`)
      .join(',')}`

    try {
      addTransaction(
        {
          id: transactionId,
          txDescription: (
            <Text variant="p3">
              rebalance&nbsp;
              <Text as="span" variant="p4semi">
                {moves.length}
              </Text>
              &nbsp;move{moves.length > 1 ? 's' : ''}
            </Text>
          ),
          txLabel: { label: 'Rebalance', charge: 'neutral' },
        },
        buildRebalanceTransaction({
          institutionName,
          network,
          vaultAddress: vault.id,
          moves,
        }).then(
          (plain) =>
            ({
              transaction: {
                target: { value: plain.target },
                calldata: plain.calldata,
                value: plain.value,
              },
              description: plain.description,
            }) as unknown as TransactionInfo,
        ),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add rebalance transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }, [addTransaction, buildMoves, chainId, institutionName, network, vault.id])

  const onTxSuccess = () => {
    revalidateTags({ tags: [`institution-vault-${institutionName.toLowerCase()}`] })
    onCancel()
  }

  const rows = assetReallocationMapper({
    vault,
    onChange,
    balanceAddChange,
    balanceRemoveChange,
  })

  const beforeAllocation = getArksAllocation(vault)

  // Create a modified vault with user input changes applied
  const modifiedVault = useMemo(
    () => getAssetReallocationModifiedVault(vault, balanceAddChange, balanceRemoveChange),
    [vault, balanceAddChange, balanceRemoveChange],
  )

  const afterAllocation = getArksAllocation(modifiedVault)

  return (
    <Card variant="cardSecondary" className={styles.panelAssetReallocationWrapper}>
      <Text as="h5" variant="h5">
        Asset reallocation
      </Text>
      <Card className={styles.contentWrapper}>
        <Table
          rows={rows}
          columns={assetReallocationColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
        <div className={styles.summary}>
          <Text as="p" variant="p3semi">
            Total Balance
          </Text>
          <Text as="p" variant="p3semi">
            {formatWithSeparators(totalBalance, { precision: 2 })}
          </Text>
        </div>
        <div className={styles.summary}>
          <Text as="p" variant="p3semi">
            Net Balance Change
          </Text>
          <Text
            as="p"
            variant="p3semi"
            style={{
              color:
                netBalanceChange === 0 ? 'var(--color-text-primary)' : 'var(--color-text-critical)',
            }}
          >
            {formatWithSeparators(netBalanceChange, { precision: 2, cutOffNegative: false })}
          </Text>
        </div>
        {hasAnyInput && !isBalanced ? (
          <Text as="p" variant="p4" style={{ color: 'var(--color-text-critical)' }}>
            A rebalance must be net-zero — the amount removed must equal the amount added.
          </Text>
        ) : null}
        <div className={styles.buttons}>
          <Button variant="secondarySmall" disabled={!hasAnyInput} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primarySmall" disabled={!isBalanced} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </Card>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          Before asset reallocation
        </Text>
        <AllocationBar items={beforeAllocation} variant="large" />
      </div>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          After asset reallocation
        </Text>
        <AllocationBar items={afterAllocation} variant="large" />
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
