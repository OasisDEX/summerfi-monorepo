'use client'
import { type FC, type PropsWithChildren, Suspense, useRef } from 'react'
import { type AlchemyClientState } from '@account-kit/core'
import { AlchemyAccountProvider, type AlchemyAccountsConfigWithUI } from '@account-kit/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { getAccountKitConfig, queryClient } from 'account-kit/config'

const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: AlchemyClientState
  }>
> = ({ initialState, children }) => {
  const ref = useRef<AlchemyAccountsConfigWithUI>(getAccountKitConfig({}))

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={ref.current}
          queryClient={queryClient}
          initialState={initialState}
        >
          {children}
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

export default AlchemyAccountsProvider
