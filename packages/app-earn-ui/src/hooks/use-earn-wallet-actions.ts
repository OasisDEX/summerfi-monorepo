'use client'

import { useCallback, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
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

type AccountLike = {
  address?: `0x${string}`
}

type UserLike = {
  address?: `0x${string}`
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
  }
}

export const useEarnProtocolAccount = (): { account?: AccountLike; isLoadingAccount: boolean } => {
  const { address, isConnecting, isReconnecting } = useWagmiAccount()

  return {
    account: address ? { address } : undefined,
    isLoadingAccount: isConnecting || isReconnecting,
  }
}

export const useEarnProtocolChain: () => {
  chain: Chain
  setChain: ({ chain }: { chain: Chain }) => Promise<void>
  isSettingChain: boolean
} = () => {
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  const setChain: ({ chain }: { chain: Chain }) => Promise<void> = useCallback(
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

export const useEarnProtocolAuthModal: () => {
  openAuthModal: () => void
  isOpen: boolean
} = () => {
  const { login, ready } = usePrivy()

  const openAuthModal: () => void = useCallback(() => {
    if (ready) {
      login()
    }
  }, [login, ready])

  return {
    openAuthModal,
    isOpen: false,
  }
}

export const useEarnProtocolLogout: () => {
  logout: () => void
} = () => {
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

export const useEarnProtocolConnect: () => {
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
} = () => {
  const { connectAsync } = useWagmiConnect()

  const connect: (
    params: {
      chainId?: number | undefined
      connector: CreateConnectorFn | Connector
    },
    callbacks?: {
      onError?: (error: unknown) => void
      onSuccess?: (data: unknown) => void
      onSettled?: () => void
    },
  ) => Promise<ConnectData<Config>> = useCallback(
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

export const useEarnProtocolSigner: () =>
  | {
      signMessage: (message: string) => Promise<`0x${string}`>
    }
  | undefined = () => {
  const { data: walletClient } = useWalletClient()

  if (!walletClient) {
    return undefined
  }

  return {
    signMessage: (message: string) => walletClient.signMessage({ message }),
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
