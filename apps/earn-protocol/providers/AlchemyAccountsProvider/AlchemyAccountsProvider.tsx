'use client'
import { type FC, type PropsWithChildren } from 'react'
import {
  AlchemyAccountProvider,
  type AlchemyAccountsProviderProps,
} from '@alchemy/aa-alchemy/react'

import { config, queryClient } from './config'

export const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: AlchemyAccountsProviderProps['initialState']
  }>
> = ({ initialState, children }) => (
  <AlchemyAccountProvider config={config} queryClient={queryClient} initialState={initialState}>
    {children}
  </AlchemyAccountProvider>
)
