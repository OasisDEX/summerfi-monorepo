'use client'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
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
import { formatAddress } from '@summerfi/app-utils'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { getInstitutionVaultCacheTags } from '@/helpers/get-institution-vault-cache-tags'
import {
  getRwaGrantWhitelistId,
  getRwaRevokeWhitelistId,
  getRwaSetWhitelistOpenId,
} from '@/helpers/get-transaction-id'
import { isValidAddress } from '@/helpers/is-valid-address'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { withRetry } from '@/helpers/with-retry'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

interface PanelRwaWhitelistProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
}

export const PanelRwaWhitelist: FC<PanelRwaWhitelistProps> = ({
  institutionName,
  clientId,
  vaultAddress,
  network,
}) => {
  const chainId = urlNetworkToChainId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const {
    getRwaSetWhitelistOpenTx,
    getRwaSetWhitelistedTx,
    getRwaIsWhitelistOpen,
    getRwaIsWhitelisted,
  } = useAdminAppRwaSDK(clientId)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const [whitelistOpen, setWhitelistOpen] = useState<boolean | null>(null)
  const [grantAddress, setGrantAddress] = useState('')
  const [revokeAddress, setRevokeAddress] = useState('')
  const [checkAddress, setCheckAddress] = useState('')
  const [checkResult, setCheckResult] = useState<string | null>(null)

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain || !userWalletAddress

  // Whitelist open/closed reads through the backend proxy and is independent of the connected chain.
  const refreshWhitelistOpen = useCallback(() => {
    withRetry(() => getRwaIsWhitelistOpen({ fleetAddress, chainId }))
      .then(setWhitelistOpen)
      .catch(() => setWhitelistOpen(null))
  }, [getRwaIsWhitelistOpen, fleetAddress, chainId])

  useEffect(() => {
    refreshWhitelistOpen()
  }, [refreshWhitelistOpen])

  const onToggleWhitelistOpen = useCallback(() => {
    const nextOpen = !whitelistOpen

    try {
      addTransaction(
        {
          id: getRwaSetWhitelistOpenId({ address: fleetAddress, chainId, isOpen: nextOpen }),
          txDescription: (
            <Text variant="p3">{nextOpen ? 'open whitelist' : 'close whitelist'}</Text>
          ),
          txLabel: {
            label: nextOpen ? 'Open' : 'Close',
            charge: nextOpen ? 'positive' : 'negative',
          },
        },
        getRwaSetWhitelistOpenTx({ fleetAddress, chainId, isOpen: nextOpen }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }, [addTransaction, chainId, fleetAddress, getRwaSetWhitelistOpenTx, whitelistOpen])

  const onSetWhitelisted = useCallback(
    ({ address, allowed }: { address: `0x${string}`; allowed: boolean }) => {
      const id = allowed
        ? getRwaGrantWhitelistId({ address, chainId })
        : getRwaRevokeWhitelistId({ address, chainId })

      try {
        addTransaction(
          {
            id,
            txDescription: (
              <Text variant="p3">
                {allowed ? 'whitelist' : 'remove'}&nbsp;
                <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                  {address}
                </Text>
              </Text>
            ),
            txLabel: {
              label: allowed ? 'Grant' : 'Revoke',
              charge: allowed ? 'positive' : 'negative',
            },
          },
          getRwaSetWhitelistedTx({ fleetAddress, chainId, accountAddress: address, allowed }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction, chainId, fleetAddress, getRwaSetWhitelistedTx],
  )

  const onCheckWhitelisted = useCallback(() => {
    if (!isValidAddress(checkAddress)) return
    setCheckResult('Checking…')
    getRwaIsWhitelisted({ fleetAddress, chainId, accountAddress: checkAddress as `0x${string}` })
      .then((allowed) =>
        setCheckResult(
          `${formatAddress(checkAddress)} is ${allowed ? 'whitelisted' : 'not whitelisted'}`,
        ),
      )
      .catch(() => setCheckResult('Failed to read whitelist status'))
  }, [checkAddress, chainId, fleetAddress, getRwaIsWhitelisted])

  const onTxSuccess = () => {
    revalidateTags({
      tags: getInstitutionVaultCacheTags({ institutionName, vaultAddress, network }),
    })
    refreshWhitelistOpen()
  }

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Whitelist status
        </Text>
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Text variant="p2">
              Whitelist is currently:&nbsp;
              <Text as="span" variant="p2semi" style={{ color: 'var(--color-text-link)' }}>
                {whitelistOpen === null ? 'unknown' : whitelistOpen ? 'OPEN' : 'CLOSED'}
              </Text>
            </Text>
            <Button
              variant="secondarySmall"
              disabled={controlsDisabled || whitelistOpen === null}
              onClick={onToggleWhitelistOpen}
            >
              {whitelistOpen ? 'Close whitelist' : 'Open whitelist'}
            </Button>
          </div>
        </Card>
        <Text variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
          When the whitelist is open, deposits are permissionless. When closed, only whitelisted
          addresses can deposit.
        </Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Add address to whitelist
        </Text>
        <Card>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              variant="withBorder"
              placeholder="0x..."
              value={grantAddress}
              onChange={(e) => setGrantAddress(e.target.value)}
              wrapperStyles={{ width: '405px' }}
              inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <Button
              variant="primaryLarge"
              disabled={controlsDisabled || !isValidAddress(grantAddress)}
              onClick={() => {
                onSetWhitelisted({ address: grantAddress as `0x${string}`, allowed: true })
                setGrantAddress('')
              }}
            >
              <Text variant="p4">Add</Text>
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Remove address from whitelist
        </Text>
        <Card>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              variant="withBorder"
              placeholder="0x..."
              value={revokeAddress}
              onChange={(e) => setRevokeAddress(e.target.value)}
              wrapperStyles={{ width: '405px' }}
              inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <Button
              variant="secondaryLarge"
              disabled={controlsDisabled || !isValidAddress(revokeAddress)}
              onClick={() => {
                onSetWhitelisted({ address: revokeAddress as `0x${string}`, allowed: false })
                setRevokeAddress('')
              }}
            >
              <Text variant="p4">Remove</Text>
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Check address
        </Text>
        <Card>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Input
              variant="withBorder"
              placeholder="0x..."
              value={checkAddress}
              onChange={(e) => {
                setCheckAddress(e.target.value)
                setCheckResult(null)
              }}
              wrapperStyles={{ width: '405px' }}
              inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <Button
              variant="secondaryLarge"
              disabled={!isValidAddress(checkAddress)}
              onClick={onCheckWhitelisted}
            >
              <Text variant="p4">Check</Text>
            </Button>
            {checkResult ? <Text variant="p3">{checkResult}</Text> : null}
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
