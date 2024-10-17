'use client'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { type AlchemyClientState } from '@account-kit/core'
import { AlchemyAccountProvider } from '@account-kit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getAccountKitConfig } from 'account-kit/config'

const queryClient = new QueryClient()

export const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: AlchemyClientState
    forkRpcUrl?: string
    chainId?: number
  }>
> = ({ initialState, forkRpcUrl, chainId, children }) => {
  const config = useMemo(() => getAccountKitConfig({ forkRpcUrl, chainId }), [chainId, forkRpcUrl])

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={config} queryClient={queryClient} initialState={initialState}>
        {children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  )
}
