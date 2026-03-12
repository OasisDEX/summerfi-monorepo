'use client'

import { useCallback, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import {
  type SignAuthorizationReturnType,
  type SignTransactionReturnType,
  type WalletClient,
} from 'viem'
import { arbitrum, base, type Chain, hyperliquid, mainnet, sonic } from 'viem/chains'
import {
  type Config,
  type Connector,
  type CreateConnectorFn,
  useAccount as useWagmiAccount,
  useChainId,
  useConnect as useWagmiConnect,
  useDisconnect,
  usePublicClient,
  useSignMessage as useWagmiSignMessage,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'
import { type ConnectData } from 'wagmi/query'

const supportedChains: Chain[] = [mainnet, arbitrum, base, sonic, hyperliquid]

export const getEarnProtocolChainById = (chainId?: number): Chain => {
  const mappedChain = supportedChains.find((chain) => chain.id === chainId)

  if (!mappedChain) {
    throw new Error(`Unsupported chainId: ${chainId}`)
  }

  return mappedChain
}

export const useEarnProtocolWallet = (): {
  address?: `0x${string}`
  isLoadingAccount: boolean
} => {
  const { address, isConnecting, isReconnecting } = useWagmiAccount()

  return {
    address,
    isLoadingAccount: isConnecting || isReconnecting,
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
  const { login: privyLogin, ready } = usePrivy()

  const login: () => void = useCallback(() => {
    if (ready) {
      privyLogin()
    }
  }, [privyLogin, ready])

  return {
    login,
    isOpen: false,
  }
}

export const useEarnProtocolLogout: () => {
  logout: () => void
} = () => {
  const { logout: privyLogout } = usePrivy()
  const { disconnect } = useDisconnect()

  const logout = useCallback(() => {
    disconnect()
    privyLogout()
  }, [disconnect, privyLogout])

  return {
    logout,
  }
}

export const useEarnProtocolSignerStatus: () => {
  isInitializing: boolean
  isAuthenticating: boolean
} = () => {
  const { ready, authenticated } = usePrivy()

  return {
    isInitializing: !ready,
    isAuthenticating: ready && !authenticated,
  }
}

type UseEarnProtocolConnect = () => {
  connect: (
    params: {
      chainId?: number | undefined
      connector: CreateConnectorFn | Connector
    },
    callbacks?: {
      onError?: (error: unknown) => void
      onSuccess?: (data: unknown) => void
      onSettled?: () => void
    },
  ) => Promise<ConnectData<Config>>
}

export const useEarnProtocolConnect: UseEarnProtocolConnect = () => {
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

export const useEarnProtocolSendUserOperation: ({
  waitForTxn,
  onSuccess,
  onError,
}: {
  client?: unknown
  waitForTxn?: boolean | undefined
  onSuccess?: ((data: { hash: `0x${string}` }) => void) | undefined
  onError?: ((error: unknown) => void) | undefined
}) => {
  sendUserOperation: (params: {
    uo: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint | undefined
    }
    overrides?: unknown
  }) => void
  sendUserOperationAsync: ({
    uo,
  }: {
    uo: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint | undefined
    }
    overrides?: unknown
  }) => Promise<{
    hash: `0x${string}`
  }>
  error: Error | null
  isSendingUserOperation: boolean
} = ({ waitForTxn = true, onSuccess, onError }) => {
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
