'use client'
import { type FC, type PropsWithChildren, useEffect } from 'react'
import { type AlchemyClientState, hydrate } from '@account-kit/core'
import { AlchemyAccountProvider } from '@account-kit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { staticConfig } from 'account-kit/config'

const queryClient = new QueryClient()

export const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: AlchemyClientState
  }>
> = ({ initialState, children }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { onMount } = hydrate(staticConfig, initialState)

      void onMount()
    }
  }, [initialState])

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={staticConfig}
        queryClient={queryClient}
        initialState={initialState}
      >
        {children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  )
}
