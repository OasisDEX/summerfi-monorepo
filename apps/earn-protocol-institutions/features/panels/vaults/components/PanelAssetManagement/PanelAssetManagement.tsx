'use client'

import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  Input,
  SkeletonLine,
  Text,
  useAmount,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { type SDKVaultType, type SupportedNetworkIds } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import { Address, getChainInfoByChainId, TokenAmount, TransactionType } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { getDepositId, getWithdrawId } from '@/helpers/get-transaction-id'
import { getInstitutionVaultUrl } from '@/helpers/get-url'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useNetworkAlignedClient } from '@/hooks/useNetworkAlignedClient'
import { usePosition } from '@/hooks/usePosition'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'
import { useTokenBalance } from '@/hooks/useTokenBalance'

import panelAssetManagementStyles from './PanelAssetManagement.module.css'

interface PanelAssetManagementProps {
  vault: SDKVaultType
  institutionName: string
}

export const PanelAssetManagement: FC<PanelAssetManagementProps> = ({ vault, institutionName }) => {
  const { chain, isSettingChain } = useChain()
  const { addTransaction, removeTransaction, updateTransaction, transactionQueue } =
    useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()
  const { isLoadingAccount, userWalletAddress } = useUserWallet()
  const { publicClient } = useNetworkAlignedClient()
  const { getDepositTx, getWithdrawTx, isWhitelisted } = useAdminAppSDK(institutionName)
  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))
  const sdkNetworkName = chainIdToSDKNetwork(vaultChainId)
  const vaultInputToken = vault.inputToken.symbol
  const vaultOutputToken = vault.outputToken?.symbol
  const inputTokenBalance = new BigNumber(vault.inputTokenBalance.toString())
    .div(ten.pow(vault.inputToken.decimals))
    .toNumber()
  const [isWalletWhitelisted, setIsWalletWhitelisted] = useState<boolean | null>(null)
  const whitelistWalletsMapCheckRef = useRef<{ [key: string]: boolean }>({})
  const inFlightWhitelistChecksRef = useRef<{ [key: string]: Promise<boolean> }>({})

  const isProperChain = useMemo(() => {
    return chain.id === vaultChainId
  }, [chain.id, vaultChainId])

  const {
    isLoading: isLoadingPosition,
    position,
    reFetchPosition,
  } = usePosition({
    chainId: vaultChainId as SupportedNetworkIds,
    institutionName,
    vaultId: vault.id,
  })

  const {
    vaultToken,
    token: selectedToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
    refetch: refetchSelectedTokenBalance,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: vault.inputToken.symbol,
    tokenSymbol: vault.inputToken.symbol,
    chainId: vaultChainId,
    institutionName,
  })

  const {
    amountDisplay: amountDepositDisplay,
    amountParsed: amountDepositParsed,
    manualSetAmount: manualSetAmountDeposit,
    onBlur: onDepositBlur,
    onFocus: onDepositFocus,
  } = useAmount({
    inputName: `insti-${vault.id}-deposit`,
    tokenDecimals: vault.inputToken.decimals,
    inputChangeHandler: () => {},
  })

  const {
    amountDisplay: amountWithdrawDisplay,
    amountParsed: amountWithdrawParsed,
    manualSetAmount: manualSetAmountWithdraw,
    onBlur: onWithdrawBlur,
    onFocus: onWithdrawFocus,
  } = useAmount({
    inputName: `insti-${vault.id}-withdraw`,
    tokenDecimals: vault.inputToken.decimals,
    inputChangeHandler: () => {},
  })

  const getWalletWhitelist = useCallback(
    (address: string) => {
      const cached = whitelistWalletsMapCheckRef.current[address]

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (cached !== undefined) return Promise.resolve(cached)

      const inFlight = inFlightWhitelistChecksRef.current[address]

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (inFlight) return inFlight

      const whitelistCheckPromise = (async () => {
        const whitelisted = await isWhitelisted({
          targetAddress: address as `0x${string}`,
          chainId: vaultChainId,
          fleetCommanderAddress: vault.id as `0x${string}`,
        })

        whitelistWalletsMapCheckRef.current[address] = whitelisted
        delete inFlightWhitelistChecksRef.current[address]

        return whitelisted
      })()

      inFlightWhitelistChecksRef.current[address] = whitelistCheckPromise

      return whitelistCheckPromise
    },
    [isWhitelisted, vault.id, vaultChainId],
  )

  useEffect(() => {
    if (!userWalletAddress || isLoadingAccount) {
      setIsWalletWhitelisted(null)
    } else {
      getWalletWhitelist(userWalletAddress).then((whitelisted) => {
        setIsWalletWhitelisted(whitelisted)
      })
    }
  }, [userWalletAddress, isLoadingAccount, getWalletWhitelist])

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value

    if (nextValue === '' || Number(nextValue) < 0 || isNaN(Number(nextValue))) {
      manualSetAmountDeposit('0')

      return
    }

    manualSetAmountDeposit(nextValue)
  }

  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value

    if (nextValue === '' || Number(nextValue) < 0 || isNaN(Number(nextValue))) {
      manualSetAmountWithdraw('0')

      return
    }

    manualSetAmountWithdraw(nextValue)
  }

  const positionTokenBalance = useMemo(() => {
    if (!position) return 0

    return new BigNumber(position.amount.amount).toNumber()
  }, [position])

  const positionBalanceLabel = useMemo(() => {
    if (!userWalletAddress) {
      return <WalletLabel />
    }
    if (isLoadingAccount || isLoadingPosition) {
      return <SkeletonLine width={100} height={20} style={{ margin: '10px 0' }} />
    }

    return positionTokenBalance > 0 ? (
      <>
        {formatCryptoBalance(positionTokenBalance)} {vaultInputToken}
      </>
    ) : (
      0
    )
  }, [
    isLoadingAccount,
    isLoadingPosition,
    positionTokenBalance,
    userWalletAddress,
    vaultInputToken,
  ])

  const positionBalanceToDepositLabel = useMemo(() => {
    return selectedTokenBalanceLoading ? (
      <SkeletonLine width={150} height={14} style={{ margin: '3px 0' }} />
    ) : (
      <>
        <span
          className={panelAssetManagementStyles.clickableBalance}
          onClick={() => {
            manualSetAmountDeposit(selectedTokenBalance?.toString() ?? '0')
          }}
        >
          {formatCryptoBalance(selectedTokenBalance ?? 0)}
        </span>{' '}
        {selectedToken?.symbol} in connected wallet
      </>
    )
  }, [
    selectedTokenBalanceLoading,
    selectedTokenBalance,
    selectedToken?.symbol,
    manualSetAmountDeposit,
  ])

  const positionBalanceToWithdrawLabel = useMemo(() => {
    if (!userWalletAddress) {
      return <WalletLabel />
    }
    if (isLoadingAccount || isLoadingPosition) {
      return <SkeletonLine width={150} height={14} style={{ margin: '3px 0' }} />
    }

    return positionTokenBalance > 0 ? (
      <>
        <span
          className={panelAssetManagementStyles.clickableBalance}
          onClick={() => {
            manualSetAmountWithdraw(positionTokenBalance.toString())
          }}
        >
          {formatCryptoBalance(positionTokenBalance)}
        </span>{' '}
        {vaultInputToken} to withdraw
      </>
    ) : (
      0
    )
  }, [
    isLoadingAccount,
    isLoadingPosition,
    positionTokenBalance,
    userWalletAddress,
    vaultInputToken,
    manualSetAmountWithdraw,
  ])

  const onTxSuccess = (txId: string) => {
    if (!txId.includes(TransactionType.Approve)) {
      revalidateTags({
        tags: [
          `vault-details-${institutionName.toLowerCase()}-${vault.id.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
        ],
      })
      reFetchPosition()
      refetchSelectedTokenBalance()
    }
  }

  const onDeposit = useCallback(
    ({ address }: { address: string }) => {
      if (!userWalletAddress || amountDepositParsed.isZero() || !vaultToken) return

      const transactionId = getDepositId({
        address,
        chainId: vaultChainId,
        depositAmount: amountDepositParsed.toNumber(),
      })

      const approveTxId = `${transactionId}-${TransactionType.Approve}`
      const approveTxDescription = (
        <Text variant="p3">
          {formatCryptoBalance(amountDepositParsed)}&nbsp;{vaultInputToken}
        </Text>
      )
      const approveNotNeededTxDescription = (
        <Text variant="p3">
          {formatCryptoBalance(amountDepositParsed)}&nbsp;{vaultInputToken} approved already
        </Text>
      )
      const approveTxLabel = {
        label: capitalize(TransactionType.Approve),
        charge: 'positive' as const,
      }

      const depositTxId = `${transactionId}-${TransactionType.Deposit}`
      const depositTxDescription = (
        <Text variant="p3">
          {formatCryptoBalance(amountDepositParsed)}&nbsp;{vaultInputToken}
          &nbsp;from&nbsp;
          <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
            {address}
          </Text>
        </Text>
      )
      const depositTxLabel = {
        label: capitalize(TransactionType.Deposit),
        charge: 'positive' as const,
      }

      try {
        // first we update the list quickly with optimistic txs (two entries: approval and deposit)
        addTransaction({
          id: approveTxId,
          txDescription: approveTxDescription,
          txLabel: approveTxLabel,
        })
        addTransaction({
          id: depositTxId,
          txDescription: depositTxDescription,
          txLabel: depositTxLabel,
        })

        // then we get the real txs and update the entries accordingly
        getDepositTx({
          walletAddress: Address.createFromEthereum({
            value: userWalletAddress,
          }),
          amount: TokenAmount.createFrom({
            token: vaultToken,
            amount: amountDepositParsed.toString(),
          }),
          fleetAddress: vault.id,
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: 0.05,
        })
          .then((transactions) => {
            if (transactions.length === 1) {
              updateTransaction(approveTxId, {
                id: approveTxId,
                txDescription: approveNotNeededTxDescription,
                txInitialState: 'txSuccess',
              })
            }
            transactions.forEach((tx) => {
              updateTransaction(tx.type === TransactionType.Approve ? approveTxId : depositTxId, {
                id: tx.type === TransactionType.Approve ? approveTxId : depositTxId,
                txDescription:
                  tx.type === TransactionType.Approve ? approveTxDescription : depositTxDescription,
                txLabel: tx.type === TransactionType.Approve ? approveTxLabel : depositTxLabel,
                txData: tx,
              })
            })
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to get deposit transaction', error)
            toast.error('Failed to get deposit transaction', ERROR_TOAST_CONFIG)
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [
      userWalletAddress,
      amountDepositParsed,
      vaultToken,
      vaultChainId,
      vaultInputToken,
      addTransaction,
      getDepositTx,
      vault.id,
      updateTransaction,
    ],
  )

  const onWithdraw = useCallback(
    ({ address }: { address: string }) => {
      if (!userWalletAddress || amountWithdrawParsed.isZero() || !vaultToken || !selectedToken)
        return

      const transactionId = getWithdrawId({
        address,
        chainId: vaultChainId,
        withdrawAmount: amountWithdrawParsed.toNumber(),
      })

      const approveTxId = `${transactionId}-${TransactionType.Approve}`
      const approveTxDescription = (
        <Text variant="p3">
          {formatCryptoBalance(amountWithdrawParsed)}&nbsp;{vaultOutputToken}
        </Text>
      )
      const approveNotNeededTxDescription = (
        <Text variant="p3">
          {formatCryptoBalance(amountWithdrawParsed)}&nbsp;{vaultOutputToken} approved already
        </Text>
      )
      const approveTxLabel = {
        label: capitalize(TransactionType.Approve),
        charge: 'positive' as const,
      }

      const withdrawTxId = `${transactionId}-${TransactionType.Withdraw}`
      const withdrawTxDescription = (
        <Text variant="p3">
          {formatCryptoBalance(amountWithdrawParsed)}&nbsp;{vaultInputToken}
          &nbsp;from&nbsp;
          <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
            {address}
          </Text>
        </Text>
      )
      const withdrawTxLabel = {
        label: capitalize(TransactionType.Withdraw),
        charge: 'positive' as const,
      }

      try {
        // first we update the list quickly with optimistic txs (two entries: approval and withdraw (yes, withdraw can have approval too))
        addTransaction({
          id: approveTxId,
          txDescription: approveTxDescription,
          txLabel: approveTxLabel,
        })
        addTransaction({
          id: withdrawTxId,
          txDescription: withdrawTxDescription,
          txLabel: withdrawTxLabel,
        })

        // then we get the real txs and update the entries accordingly
        getWithdrawTx({
          walletAddress: Address.createFromEthereum({
            value: userWalletAddress,
          }),
          amount: TokenAmount.createFrom({
            token: vaultToken,
            amount: amountWithdrawParsed.toString(),
          }),
          toToken: selectedToken,
          fleetAddress: vault.id,
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: 0.05,
        })
          .then((transactions) => {
            if (transactions.length === 1) {
              updateTransaction(approveTxId, {
                id: approveTxId,
                txDescription: approveNotNeededTxDescription,
                txInitialState: 'txSuccess',
              })
            }
            transactions.forEach((tx) => {
              updateTransaction(tx.type === TransactionType.Approve ? approveTxId : withdrawTxId, {
                id: tx.type === TransactionType.Approve ? approveTxId : withdrawTxId,
                txDescription:
                  tx.type === TransactionType.Approve
                    ? approveTxDescription
                    : withdrawTxDescription,
                txLabel: tx.type === TransactionType.Approve ? approveTxLabel : withdrawTxLabel,
                txData: tx,
              })
            })
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to get withdraw transaction', error)
            toast.error('Failed to get withdraw transaction', ERROR_TOAST_CONFIG)
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [
      userWalletAddress,
      amountWithdrawParsed,
      vaultToken,
      selectedToken,
      vaultChainId,
      vaultInputToken,
      vaultOutputToken,
      addTransaction,
      getWithdrawTx,
      vault.id,
      updateTransaction,
    ],
  )

  return (
    <Card
      variant="cardSecondary"
      className={panelAssetManagementStyles.panelAssetManagementWrapper}
    >
      <div className={panelAssetManagementStyles.assetManagementBlocks}>
        <div className={panelAssetManagementStyles.statsSection}>
          <Card style={{ flexDirection: 'column' }}>
            <Text variant="p3semi" style={{ opacity: 0.7 }}>
              Vault Assets Balance
            </Text>
            <Text variant="h4">
              {formatCryptoBalance(inputTokenBalance)} {vaultInputToken}
            </Text>
          </Card>
          <Card style={{ flexDirection: 'column' }}>
            <Text variant="p3semi" style={{ opacity: 0.7 }}>
              Connected Wallet Deposits
            </Text>
            <Text variant="h4">{positionBalanceLabel}</Text>
          </Card>
        </div>

        <div className={panelAssetManagementStyles.actionsSection}>
          <Card style={{ flexDirection: 'column' }}>
            <div className={panelAssetManagementStyles.actionCardHeader}>
              <Text variant="p3semi" style={{ opacity: 0.7 }}>
                Deposit
              </Text>
              <Text variant="p4" style={{ opacity: 0.6 }}>
                {positionBalanceToDepositLabel}
              </Text>
            </div>
            <div className={panelAssetManagementStyles.actionCardContent}>
              <Input
                variant="dark"
                inputWrapperStyles={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
                placeholder="Amount to deposit"
                value={amountDepositDisplay}
                onChange={handleDepositAmountChange}
                onBlur={onDepositBlur}
                onFocus={onDepositFocus}
              />
              <Button
                variant="primarySmall"
                disabled={
                  isLoadingAccount ||
                  isSettingChain ||
                  !isProperChain ||
                  amountDepositParsed.isZero() ||
                  amountDepositParsed.isGreaterThan(selectedTokenBalance ?? new BigNumber(0))
                }
                onClick={() => {
                  if (userWalletAddress) {
                    onDeposit({ address: userWalletAddress })
                    manualSetAmountDeposit('0')
                  }
                }}
              >
                Add deposit transaction
              </Button>
            </div>
          </Card>

          <Card style={{ flexDirection: 'column' }}>
            <div className={panelAssetManagementStyles.actionCardHeader}>
              <Text variant="p3semi" style={{ opacity: 0.7 }}>
                Withdraw
              </Text>
              <Text variant="p4" style={{ opacity: 0.6 }}>
                {positionBalanceToWithdrawLabel}
              </Text>
            </div>
            <div className={panelAssetManagementStyles.actionCardContent}>
              <Input
                variant="dark"
                inputWrapperStyles={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
                placeholder="Amount to withdraw"
                value={amountWithdrawDisplay}
                onChange={handleWithdrawAmountChange}
                onBlur={onWithdrawBlur}
                onFocus={onWithdrawFocus}
              />
              <Button
                variant="primarySmall"
                disabled={
                  isLoadingAccount ||
                  isSettingChain ||
                  !isProperChain ||
                  amountWithdrawParsed.isZero() ||
                  amountWithdrawParsed.isGreaterThan(positionTokenBalance)
                }
                onClick={() => {
                  if (userWalletAddress) {
                    onWithdraw({ address: userWalletAddress })
                    manualSetAmountWithdraw('0')
                  }
                }}
              >
                Add withdraw transaction
              </Button>
            </div>
          </Card>
        </div>
      </div>
      {userWalletAddress && (
        <Card style={{ flexDirection: 'column' }}>
          <Text
            variant="p3"
            style={{
              color:
                isWalletWhitelisted === null
                  ? 'inherit'
                  : !isWalletWhitelisted
                    ? 'var(--color-text-warning)'
                    : 'var(--color-text-success)',
            }}
          >
            {isWalletWhitelisted === null ? (
              'Checking wallet whitelist status...'
            ) : isWalletWhitelisted ? (
              <>Your wallet is whitelisted for asset management actions.</>
            ) : (
              <>
                Your wallet is not whitelisted for asset management actions. Manage access{' '}
                <Link
                  href={getInstitutionVaultUrl({
                    institutionName,
                    vault,
                    page: 'user-admin',
                  })}
                  style={{ textDecoration: 'underline' }}
                >
                  here
                </Link>
                .
              </>
            )}
          </Text>
        </Card>
      )}
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        transactionQueue={transactionQueue}
        chainId={vaultChainId}
        removeTransaction={removeTransaction}
        onTxSuccess={onTxSuccess}
      />
    </Card>
  )
}
