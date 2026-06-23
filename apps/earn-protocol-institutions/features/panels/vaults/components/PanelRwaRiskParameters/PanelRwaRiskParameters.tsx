'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  Input,
  Text,
  useEarnProtocolChain,
} from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'
import { RoundsVaultType } from '@summerfi/sdk-common'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { getRwaSetMinimumPositionSizeId } from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

interface PanelRwaRiskParametersProps {
  institutionName: string
  vaultAddress: string
  network: NetworkNames
  // Current minimum position size for reference (decimal string in the vault input asset), if known.
  currentMinimumDeposit?: number | null
  inputTokenSymbol?: string
}

export const PanelRwaRiskParameters: FC<PanelRwaRiskParametersProps> = ({
  institutionName,
  vaultAddress,
  network,
  currentMinimumDeposit,
  inputTokenSymbol,
}) => {
  const chainId = networkNameToSDKId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { getRwaSetMinimumPositionSizeTx } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const [minPositionSize, setMinPositionSize] = useState('')

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain
  const isValidAmount = minPositionSize !== '' && Number(minPositionSize) >= 0

  const onSetMinimumPositionSize = useCallback(() => {
    if (!isValidAmount) return

    try {
      addTransaction(
        {
          id: getRwaSetMinimumPositionSizeId({
            address: fleetAddress,
            chainId,
            minimumPositionSize: minPositionSize,
          }),
          txDescription: (
            <Text variant="p3">
              set minimum position size to&nbsp;
              <Text as="span" variant="p4semi">
                {minPositionSize} {inputTokenSymbol ?? ''}
              </Text>
            </Text>
          ),
          txLabel: { label: 'Set', charge: 'neutral' },
        },
        getRwaSetMinimumPositionSizeTx({
          fleetAddress,
          chainId,
          vaultType: RoundsVaultType.Input,
          minimumPositionSize: minPositionSize,
        }),
      )
      setMinPositionSize('')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }, [
    addTransaction,
    chainId,
    fleetAddress,
    getRwaSetMinimumPositionSizeTx,
    inputTokenSymbol,
    isValidAmount,
    minPositionSize,
  ])

  const onTxSuccess = () => {
    revalidateTags({ tags: [`institution-vault-${institutionName.toLowerCase()}`] })
  }

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Minimum position size
        </Text>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Current minimum deposit:&nbsp;
              <Text as="span" variant="p3semi">
                {currentMinimumDeposit != null
                  ? `${currentMinimumDeposit} ${inputTokenSymbol ?? ''}`
                  : 'n/a'}
              </Text>
            </Text>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Input
                variant="withBorder"
                type="number"
                placeholder={`New minimum (in ${inputTokenSymbol ?? 'input asset'})`}
                value={minPositionSize}
                onChange={(e) => setMinPositionSize(e.target.value)}
                wrapperStyles={{ width: '320px' }}
              />
              <Button
                variant="primaryLarge"
                disabled={controlsDisabled || !isValidAmount}
                onClick={onSetMinimumPositionSize}
              >
                <Text variant="p4">Update</Text>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Allocation &amp; deposit caps
        </Text>
        <Card>
          <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
            Ark allocations and fleet/ark deposit caps for RWA vaults are managed by the curator and
            are not configurable from this console.
          </Text>
        </Card>
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
