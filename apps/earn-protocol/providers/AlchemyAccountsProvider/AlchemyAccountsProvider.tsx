'use client'
import { type FC, type PropsWithChildren } from 'react'
import {
  AlchemyAccountProvider,
  type AlchemyAccountsProviderProps,
} from '@alchemy/aa-alchemy/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { config } from './config'

const queryClient = new QueryClient()

export const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: AlchemyAccountsProviderProps['initialState']
  }>
> = ({ initialState, children }) => (
  <QueryClientProvider client={queryClient}>
    <AlchemyAccountProvider config={config} queryClient={queryClient} initialState={initialState}>
      {children}
    </AlchemyAccountProvider>
  </QueryClientProvider>
)
