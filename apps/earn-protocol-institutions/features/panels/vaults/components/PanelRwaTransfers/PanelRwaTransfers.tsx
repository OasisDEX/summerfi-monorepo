'use client'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, ERROR_TOAST_CONFIG, Text, useEarnProtocolChain } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { getRwaSetTransferabilityId } from '@/helpers/get-transaction-id'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

interface PanelRwaTransfersProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
}

export const PanelRwaTransfers: FC<PanelRwaTransfersProps> = ({
  institutionName,
  clientId,
  vaultAddress,
  network,
}) => {
  const chainId = urlNetworkToChainId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { getRwaIsFleetTransfersEnabled, getRwaSetFleetTransferabilityTx } =
    useAdminAppRwaSDK(clientId)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const [transfersEnabled, setTransfersEnabled] = useState<boolean | null>(null)

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain

  const refreshTransfersEnabled = useCallback(() => {
    getRwaIsFleetTransfersEnabled({ fleetAddress, chainId })
      .then(setTransfersEnabled)
      .catch(() => setTransfersEnabled(null))
  }, [getRwaIsFleetTransfersEnabled, fleetAddress, chainId])

  useEffect(() => {
    refreshTransfersEnabled()
  }, [refreshTransfersEnabled])

  const onToggle = useCallback(() => {
    // The contract method is a no-arg flip; the next state is the inverse of the current read.
    const willEnable = transfersEnabled === false

    try {
      addTransaction(
        {
          id: getRwaSetTransferabilityId({ address: fleetAddress, chainId }),
          txDescription: (
            <Text variant="p3">{willEnable ? 'enable' : 'disable'} share transfers</Text>
          ),
          txLabel: {
            label: willEnable ? 'Enable' : 'Disable',
            charge: willEnable ? 'positive' : 'negative',
          },
        },
        getRwaSetFleetTransferabilityTx({ fleetAddress, chainId }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }, [addTransaction, chainId, fleetAddress, getRwaSetFleetTransferabilityTx, transfersEnabled])

  const onTxSuccess = () => {
    revalidateTags({ tags: [`institution-vault-${institutionName.toLowerCase()}`] })
    refreshTransfersEnabled()
  }

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Share-token transferability
        </Text>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <Text variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
            Controls whether holders can transfer the fleet share token.
          </Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Text variant="p2">
              Transfers are currently:&nbsp;
              <Text as="span" variant="p2semi" style={{ color: 'var(--color-text-link)' }}>
                {transfersEnabled === null ? 'unknown' : transfersEnabled ? 'ENABLED' : 'DISABLED'}
              </Text>
            </Text>
            <Button
              variant="secondarySmall"
              disabled={controlsDisabled || transfersEnabled === null}
              onClick={onToggle}
            >
              {transfersEnabled ? 'Disable transfers' : 'Enable transfers'}
            </Button>
          </div>
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
