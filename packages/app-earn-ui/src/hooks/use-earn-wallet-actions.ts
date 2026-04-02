'use client'

import { useCallback, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import {
  type SignAuthorizationReturnType,
  type SignTransactionReturnType,
  type WalletClient,
} from 'viem'
import { type Chain } from 'viem/chains'
import {
  useAccount,
  useChainId,
  useDisconnect,
  usePublicClient,
  useSignMessage,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

import { supportedViemChains } from '@/constants/supported-chains'

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
  const { address, isConnecting } = useAccount()

  return {
    address,
    isLoadingAccount: isConnecting,
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
} = () => {
  const { connectWallet, isModalOpen } = usePrivy()

  return {
    login: connectWallet,
    isOpen: isModalOpen,
  }
}

export const useEarnProtocolLogout: () => {
  logout: () => void
} = () => {
  const { disconnect } = useDisconnect()

  return {
    logout: disconnect,
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
}: {
  waitForTxn?: boolean | undefined
  onSuccess?: ((data: { hash: `0x${string}` }) => void) | undefined
  onError?: ((error: Error) => void) | undefined
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
}) => {
  const { data: walletClient } = useWalletClient()
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
      if (!walletClient) {
        const missingWalletError = new Error('Wallet is not connected')

        setError(missingWalletError)
        onError?.(missingWalletError)

        throw missingWalletError
      }

      try {
        setIsSendingUserOperation(true)
        setError(null)

        const hash = await walletClient.sendTransaction({
          account: walletClient.account,
          to: target,
          data,
          value: value ?? 0n,
          chain: getEarnProtocolChainById(walletClient.chain.id),
        })

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
    [onError, onSuccess, publicClient, waitForTxn, walletClient],
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
