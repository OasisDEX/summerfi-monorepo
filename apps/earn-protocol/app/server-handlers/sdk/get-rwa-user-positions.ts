import { type IArmadaPosition } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

// RWA (rounds-based) vaults are currently only deployed on Base Mainnet — mirrors the network
// filter used by getRwaVaultsListRaw / getRwaVaultsInfoListRaw. Extend when more networks ship.
const RWA_SUPPORTED_CHAIN_IDS = [8453] as const

/**
 * Fetches the wallet's claimed RWA Fleet positions (shares). These live in the institutional
 * subgraph, so they must be read through {@link backendInstiSDK} (Client-Id + Insti-Version
 * headers) — the public SDK returns nothing for them. The shape is the standard IArmadaPosition,
 * so these positions flow through the same portfolio pipeline as regular vault positions.
 */
export async function getRwaUserPositions({ walletAddress }: { walletAddress: string }) {
  try {
    const positionsByNetwork = await Promise.all(
      RWA_SUPPORTED_CHAIN_IDS.map(async (chainId) => {
        const chainInfo = getChainInfoByChainId(Number(chainId))

        const wallet = Wallet.createFrom({
          address: Address.createFromEthereum({
            value: walletAddress.toLowerCase(),
          }),
        })
        const user = User.createFrom({
          chainInfo,
          wallet,
        })

        return await backendInstiSDK.armada.users.getUserPositions({
          user,
        })
      }),
    )

    const positionsList = positionsByNetwork
      .filter(Boolean)
      .reduce<IArmadaPosition[]>((acc, positions) => [...acc, ...positions], [])

    return positionsList as IArmadaPosition[] | undefined
  } catch (error) {
    // RWA positions are additive to the portfolio — degrade gracefully (return none) rather than
    // throwing, so an institutional-subgraph hiccup never takes down the whole portfolio page.
    // eslint-disable-next-line no-console
    console.error('getRwaUserPositions failed', error)

    return [] as IArmadaPosition[]
  }
}
