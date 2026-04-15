'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { chainIdToSDKNetwork } from '@summerfi/app-utils'
import {
  type SignAuthorizationReturnType,
  type SignTransactionReturnType,
  type WalletClient,
} from 'viem'
import { type Chain } from 'viem/chains'
import {
  useChainId,
  useConnections,
  useDisconnect,
  usePublicClient,
  useSignMessage,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

import { supportedViemChains } from '@/constants/supported-chains'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'

export const getEarnProtocolChainById = (chainId?: number): Chain => {
  const mappedChain = supportedViemChains.find((chain) => chain.id === chainId)

  if (!mappedChain) {
    throw new Error(`Unsupported chainId: ${chainId}`)
  }

  return mappedChain
}

export const useEarnProtocolWallet = (): {
  address?: `0x${string}`
  isLoadingAccount: boolean
} => {
  // use promise based wallet client retrieval to ensure we have the wallet client available, as some actions depend on it being ready
  const [isLoadingAccount, setIsLoadingAccount] = useState(true)
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<`0x${string}` | undefined>(
    undefined,
  )
  const { ready: privyReady } = usePrivy()
  const {
    data: walletClient,
    promise: walletPendingPromise,
    status: walletStatus,
  } = useWalletClient()

  useEffect(() => {
    let isMounted = true

    const checkWalletClient = async () => {
      const walletClientAddress = walletClient
        ? (walletClient.account.address as `0x${string}` | undefined)
        : undefined

      if (walletStatus === 'pending' || !walletClientAddress) {
        setIsLoadingAccount(true)
      }

      let walletClientResolved: WalletClient | null = walletClient ?? null

      try {
        walletClientResolved = await walletPendingPromise
      } catch (error) {
        if ((error as Error).message.startsWith('Connector not connected.')) {
          // This error is expected when the wallet is not connected, so we can ignore it
        } else {
          // eslint-disable-next-line no-console
          console.error('Error while waiting for wallet client:', {
            error,
            errorMessage: (error as Error).message,
          })
        }
      } finally {
        if (isMounted) {
          if (walletClientResolved?.account?.address) {
            setConnectedWalletAddress(
              walletClientResolved.account.address as `0x${string}` | undefined,
            )
            setIsLoadingAccount(false)
          } else {
            setConnectedWalletAddress(undefined)

            const shouldKeepLoading =
              !privyReady || walletStatus === 'pending' || !walletClientResolved?.account?.address

            if (!shouldKeepLoading) {
              // wallet is not connected
            }

            setIsLoadingAccount(shouldKeepLoading)
          }
        }
      }
    }

    checkWalletClient()

    return () => {
      isMounted = false
    }
  }, [privyReady, walletClient, walletPendingPromise, walletStatus])

  useEffect(() => {
    if (walletClient) {
      const walletAddress = walletClient.account.address as `0x${string}` | undefined

      setConnectedWalletAddress(walletAddress)
      setIsLoadingAccount(false)
    } else {
      setConnectedWalletAddress(undefined)
      setIsLoadingAccount(true)
    }
  }, [walletClient])

  return {
    address: connectedWalletAddress,
    isLoadingAccount: isLoadingAccount || !privyReady,
  }
}

export const useEarnProtocolChain: () => {
  chain: Chain
  setChain: ({ chain }: { chain: Chain | number }) => Promise<void>
  isSettingChain: boolean
} = () => {
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  const setChain: ({ chain }: { chain: Chain | number }) => Promise<void> = useCallback(
    async ({ chain }: { chain: Chain | number }) => {
      const nextChainId = typeof chain === 'number' ? chain : chain.id

      await switchChainAsync({ chainId: nextChainId })
    },
    [switchChainAsync],
  )

  return {
    chain: getEarnProtocolChainById(chainId),
    setChain,
    isSettingChain: isPending,
  }
}

export const useEarnProtocolLogin: () => {
  login: () => void
  isOpen: boolean
  logout: () => void
} = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { connectWallet, isModalOpen, ready } = usePrivy()
  const { disconnectAsync } = useDisconnect()
  const connections = useConnections()

  const handleLogout = useCallback(() => {
    connections.forEach(async (connection) => {
      setIsLoading(true)
      try {
        await connection.connector.disconnect()
        await disconnectAsync({ connector: connection.connector })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error during logout:', error)
      } finally {
        setIsLoading(false)
      }
    })
  }, [connections, disconnectAsync])

  useEffect(() => {
    setIsLoading(isModalOpen)
  }, [isModalOpen])

  return {
    login: connectWallet,
    logout: handleLogout,
    isOpen: isLoading || !ready,
  }
}

export const useEarnProtocolSignerStatus: () => {
  isInitializing: boolean
  isAuthenticating: boolean
} = () => {
  const { ready, isModalOpen } = usePrivy()

  return {
    isInitializing: !ready,
    isAuthenticating: isModalOpen,
  }
}

type EarnProtocolSigner = {
  signMessage: (message: string) => Promise<`0x${string}`>
  signTransaction: (
    transaction: Parameters<WalletClient['signTransaction']>[0],
  ) => Promise<SignTransactionReturnType>
  signAuthorization: (
    transaction: Parameters<WalletClient['signAuthorization']>[0],
  ) => Promise<SignAuthorizationReturnType>
}

export const useEarnProtocolSigner = (): EarnProtocolSigner | undefined => {
  const { data: walletClient } = useWalletClient()

  if (!walletClient) {
    return undefined
  }

  return {
    signMessage: async (message: string): Promise<`0x${string}`> =>
      await walletClient.signMessage({ message }),
    signTransaction: async (
      transaction: Parameters<WalletClient['signTransaction']>[0],
    ): Promise<SignTransactionReturnType> => await walletClient.signTransaction(transaction),
    signAuthorization: async (
      transaction: Parameters<WalletClient['signAuthorization']>[0],
    ): Promise<SignAuthorizationReturnType> => await walletClient.signAuthorization(transaction),
  }
}

export const useEarnProtocolSignMessage: () => {
  signMessageAsync: ({ message }: { message: string }) => Promise<`0x${string}`>
} = () => {
  const { signMessageAsync: wagmiSignMessageAsync } = useSignMessage()

  const signMessageAsync = useCallback(
    async ({ message }: { message: string }) => {
      return await wagmiSignMessageAsync({ message })
    },
    [wagmiSignMessageAsync],
  )

  return {
    signMessageAsync,
  }
}

type useEarnProtocolSendUserOperationType = ({
  waitForTxn,
  onSuccess,
  onError,
  forceChainId,
}: {
  waitForTxn?: boolean | undefined
  onSuccess?: ((data: { hash: `0x${string}` }) => void) | undefined
  onError?: ((error: Error) => void) | undefined
  forceChainId?: number | undefined
}) => {
  sendUserOperation: (params: {
    target: `0x${string}`
    data: `0x${string}`
    value?: bigint | undefined
  }) => void
  sendUserOperationAsync: ({
    target,
    data,
    value,
  }: {
    target: `0x${string}`
    data: `0x${string}`
    value?: bigint | undefined
  }) => Promise<{
    hash: `0x${string}`
  }>
  error: Error | null
  isSendingUserOperation: boolean
}

export const useEarnProtocolSendUserOperation: useEarnProtocolSendUserOperationType = ({
  waitForTxn = true,
  onSuccess,
  onError,
  forceChainId,
}) => {
  const { promise: walletPendingPromise } = useWalletClient(
    forceChainId
      ? {
          chainId: forceChainId,
        }
      : undefined,
  )
  const publicClient = usePublicClient()
  const [isSendingUserOperation, setIsSendingUserOperation] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendUserOperationAsync = useCallback(
    async ({
      data,
      target,
      value,
    }: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint
    }) => {
      let walletClientResolved: WalletClient | null = null

      try {
        walletClientResolved = await walletPendingPromise
      } catch (pendingError) {
        const resolvedPendingError =
          pendingError instanceof Error ? pendingError : new Error(String(pendingError))

        setError(resolvedPendingError)
        onError?.(resolvedPendingError)

        throw resolvedPendingError
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!walletClientResolved) {
        const missingWalletError = new Error('Wallet is not connected')

        setError(missingWalletError)
        onError?.(missingWalletError)

        throw missingWalletError
      }
      if (!walletClientResolved.account) {
        const missingAccountError = new Error('No account found in wallet')

        setError(missingAccountError)
        onError?.(missingAccountError)

        throw missingAccountError
      }
      if (!walletClientResolved.chain) {
        const missingChainError = new Error('No chain found in wallet')

        setError(missingChainError)
        onError?.(missingChainError)

        throw missingChainError
      }

      try {
        setIsSendingUserOperation(true)
        setError(null)

        const hash = await walletClientResolved.sendTransaction({
          account: walletClientResolved.account,
          to: target,
          data,
          value: value ?? 0n,
          chain: getEarnProtocolChainById(walletClientResolved.chain.id),
        })

        const checkIfSafeHash = await getSafeTxHash(
          hash,
          chainIdToSDKNetwork(walletClientResolved.chain.id),
          1,
        )

        if (checkIfSafeHash && checkIfSafeHash.safe && publicClient) {
          // if the hash corresponds to a safe transaction, we want to wait for the safe transaction hash instead of the original one
          const safeTransactionData = checkIfSafeHash.transactionHash
            ? // it might have resolved already when checking, so we can use the transaction hash from the check, but if it hasn't resolved yet, we need to wait for it with retries, as it can take some time for the safe transaction hash to be available in the subgraph after the original transaction is mined
              checkIfSafeHash
            : await getSafeTxHash(hash, chainIdToSDKNetwork(walletClientResolved.chain.id))

          if (!safeTransactionData || !safeTransactionData.safe) {
            // this is no op, just for type safety, as getSafeTxHash should return false if the hash is not a safe transaction hash, but we already check that above
            return { hash }
          }

          if (safeTransactionData.transactionHash) {
            await publicClient.waitForTransactionReceipt({
              hash: safeTransactionData.transactionHash,
            })
            onSuccess?.({ hash: safeTransactionData.transactionHash as `0x${string}` })

            return { hash: safeTransactionData.transactionHash as `0x${string}` }
          }
        }

        if (waitForTxn && publicClient) {
          await publicClient.waitForTransactionReceipt({ hash })
        }

        onSuccess?.({ hash })

        return { hash }
      } catch (txError) {
        const resolvedError = txError instanceof Error ? txError : new Error(String(txError))

        setError(resolvedError)
        onError?.(resolvedError)

        throw resolvedError
      } finally {
        setIsSendingUserOperation(false)
      }
    },
    [onError, onSuccess, publicClient, waitForTxn, walletPendingPromise],
  )

  const sendUserOperation = useCallback(
    (params: Parameters<typeof sendUserOperationAsync>[0]) => {
      void sendUserOperationAsync(params)
    },
    [sendUserOperationAsync],
  )

  return {
    sendUserOperation,
    sendUserOperationAsync,
    error,
    isSendingUserOperation,
  }
}
