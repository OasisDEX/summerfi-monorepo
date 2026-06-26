'use client'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'

import { SwitchChainButton } from '@/components/molecules/SwitchChainButton/SwitchChainButton'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { getInstitutionVaultCacheTags } from '@/helpers/get-institution-vault-cache-tags'
import { getRwaSetTransferabilityId } from '@/helpers/get-transaction-id'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { withRetry } from '@/helpers/with-retry'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'

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
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { getRwaIsFleetTransfersEnabled, getRwaSetFleetTransferabilityTx } =
    useAdminAppRwaSDK(clientId)
  const { addTransaction } = useTransactionQueue()

  const revalidateTags = useMemo(
    () => getInstitutionVaultCacheTags({ institutionName, vaultAddress, network }),
    [institutionName, vaultAddress, network],
  )

  const [transfersEnabled, setTransfersEnabled] = useState<boolean | null>(null)

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain || !userWalletAddress

  const refreshTransfersEnabled = useCallback(() => {
    withRetry(() => getRwaIsFleetTransfersEnabled({ fleetAddress, chainId }))
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
          txDescription: 'share transfers',
          txLabel: {
            label: willEnable ? 'Enable' : 'Disable',
            charge: willEnable ? 'positive' : 'negative',
          },
          chainId,
          vaultAddress,
          revalidateTags,
        },
        getRwaSetFleetTransferabilityTx({ fleetAddress, chainId }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }, [
    addTransaction,
    chainId,
    fleetAddress,
    getRwaSetFleetTransferabilityTx,
    revalidateTags,
    transfersEnabled,
    vaultAddress,
  ])

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SwitchChainButton requiredChainId={chainId} />
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
      <TransactionQueue onLocalTxSuccess={() => refreshTransfersEnabled()} />
    </Card>
  )
}
