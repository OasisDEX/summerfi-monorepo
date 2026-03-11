'use client'

import { useCallback, useMemo, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { arbitrum, base, type Chain, hyperliquid, mainnet, sonic } from 'viem/chains'
import {
  useAccount as useWagmiAccount,
  useChainId,
  useConnect as useWagmiConnect,
  useDisconnect,
  usePublicClient,
  useSignMessage as useWagmiSignMessage,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

type AccountLike = {
  address?: `0x${string}`
}

type UserLike = {
  address?: `0x${string}`
  type?: 'eoa' | 'sca'
}

type SmartAccountClientLike = {
  address?: `0x${string}`
  checkGasSponsorshipEligibility: (_params: unknown) => Promise<{ eligible: boolean }>
}

const supportedChains: Chain[] = [mainnet, arbitrum, base, sonic, hyperliquid]

const fallbackChain = base

const chainById = (id?: number): Chain => {
  return supportedChains.find((chain) => chain.id === id) ?? fallbackChain
}

export const useUser = (): UserLike | null => {
  const { authenticated } = usePrivy()
  const { address } = useWagmiAccount()

  if (!authenticated || !address) {
    return null
  }

  return {
    address,
    type: 'eoa',
  }
}

export const useAccount = (
  _params?: unknown,
): { account?: AccountLike; isLoadingAccount: boolean } => {
  const { address, isConnecting, isReconnecting } = useWagmiAccount()

  return {
    account: address ? { address } : undefined,
    isLoadingAccount: isConnecting || isReconnecting,
  }
}

export const useChain = () => {
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  const setChain = useCallback(
    async ({ chain }: { chain: Chain }) => {
      await switchChainAsync({ chainId: chain.id })
    },
    [switchChainAsync],
  )

  return {
    chain: chainById(chainId),
    setChain,
    isSettingChain: isPending,
  }
}

export const useAuthModal = () => {
  const { login, ready } = usePrivy()

  const openAuthModal = useCallback(() => {
    if (ready) {
      login()
    }
  }, [login, ready])

  return {
    openAuthModal,
    isOpen: false,
  }
}

export const useLogout = () => {
  const { logout } = usePrivy()
  const { disconnect } = useDisconnect()

  const wrappedLogout = useCallback(() => {
    disconnect()
    logout()
  }, [disconnect, logout])

  return {
    logout: wrappedLogout,
  }
}

export const useSignerStatus = () => {
  const { ready, authenticated } = usePrivy()

  return {
    isInitializing: !ready,
    isAuthenticating: ready && !authenticated,
  }
}

export const useConnect = () => {
  const { connectAsync } = useWagmiConnect()

  const connect = useCallback(
    async (
      params: Parameters<typeof connectAsync>[0],
      callbacks?: {
        onError?: (error: unknown) => void
        onSuccess?: (data: unknown) => void
        onSettled?: () => void
      },
    ) => {
      try {
        const data = await connectAsync(params)

        callbacks?.onSuccess?.(data)

        return data
      } catch (error) {
        callbacks?.onError?.(error)

        throw error
      } finally {
        callbacks?.onSettled?.()
      }
    },
    [connectAsync],
  )

  return {
    connect,
  }
}

export const useSmartAccountClient = (
  _params?: unknown,
): { client: SmartAccountClientLike | undefined } => {
  const { address } = useWagmiAccount()

  const client = useMemo<SmartAccountClientLike | undefined>(() => {
    if (!address) {
      return undefined
    }

    return {
      address,
      checkGasSponsorshipEligibility: async () => ({ eligible: true }),
    }
  }, [address])

  return { client }
}

export const useSigner = () => {
  const { data: walletClient } = useWalletClient()

  if (!walletClient) {
    return undefined
  }

  return {
    signMessage: (message: string) => walletClient.signMessage({ message }),
  }
}

export const useSignMessage = (_params?: unknown) => {
  const { signMessageAsync: wagmiSignMessageAsync } = useWagmiSignMessage()

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

export const useSendUserOperation = ({
  waitForTxn = true,
  onSuccess,
  onError,
}: {
  client?: unknown
  waitForTxn?: boolean
  onSuccess?: (data: { hash: `0x${string}` }) => void
  onError?: (error: unknown) => void
}) => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [isSendingUserOperation, setIsSendingUserOperation] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendUserOperationAsync = useCallback(
    async ({
      uo,
    }: {
      uo: { target: `0x${string}`; data: `0x${string}`; value?: bigint }
      overrides?: unknown
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
          to: uo.target,
          data: uo.data,
          value: uo.value ?? 0n,
          chain: chainById(walletClient.chain.id),
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

export const cookieStorage = {
  getItem: (_key: string) => null,
  removeItem: (_key: string) => undefined,
  setItem: (_key: string, _value: string) => undefined,
}

export const createConfig = (config: unknown) => config
