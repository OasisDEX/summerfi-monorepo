'use client'
import { PropsWithChildren } from 'react'
import { AlchemyAccountProvider, AlchemyAccountsProviderProps } from '@alchemy/aa-alchemy/react'

import { config, queryClient } from './config'

export const Providers = ({
  initialState,
  children,
}: PropsWithChildren<{
  initialState?: AlchemyAccountsProviderProps['initialState']
}>) => {
  return (
    <AlchemyAccountProvider config={config} queryClient={queryClient} initialState={initialState}>
      {children}
    </AlchemyAccountProvider>
  )
}
