import type { SDKManager } from '@summerfi/sdk-client'
import { type ChainInfo, User, Wallet, Address } from '@summerfi/sdk-common'

export async function prepareData(
  symbol: string,
  swapSymbol: string,
  chainInfo: ChainInfo,
  sdk: SDKManager,
  walletAddress: string,
) {
  const user = User.createFrom({
    wallet: Wallet.createFrom({
      address: Address.createFromEthereum({ value: walletAddress }),
    }),
    chainInfo,
  })

  const chain = await sdk.chains.getChain({ chainInfo })
  const token = await chain.tokens.getTokenBySymbol({ symbol })
  const swapToken = await chain.tokens.getTokenBySymbol({ symbol: swapSymbol })

  return { chain, token, swapToken, user }
}
