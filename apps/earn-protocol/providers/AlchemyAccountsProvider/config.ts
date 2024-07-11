import { cookieStorage, createConfig } from '@alchemy/aa-alchemy/config'
import { sepolia } from '@alchemy/aa-core'
import { QueryClient } from '@tanstack/react-query'

export const chain = sepolia
export const config = createConfig({
  rpcUrl: `/api/rpc/chain/${chain.id}`,
  signerConnection: {
    // this is for Alchemy Signer requests
    rpcUrl: '/api/rpc/',
  },
  chain,
  ssr: true,
  storage: cookieStorage,
})

// provide a query client for use by the alchemy accounts provider
export const queryClient = new QueryClient()
