'use client'
import { type FC, type PropsWithChildren } from 'react'
import { type AlchemyClientState } from '@account-kit/core'
import { AlchemyAccountProvider } from '@account-kit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { staticConfig } from 'account-kit/config'

const queryClient = new QueryClient()

export const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: AlchemyClientState
  }>
> = ({ initialState, children }) => {
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
