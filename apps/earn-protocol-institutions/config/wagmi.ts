import { arbitrum, mainnet } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieStorage, createStorage, http } from '@wagmi/core'

export const projectId = '4bf3a1a17d5e2dc4b6bdbb453cac3735'

export const networks = [mainnet, arbitrum]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig
