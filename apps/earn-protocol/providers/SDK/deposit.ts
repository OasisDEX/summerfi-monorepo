import { TokenAmount } from '@summerfi/sdk-common'

import { useSDK } from './context'

export const useDeposit = () => {
  const { getFleetClient, getTokenBySymbol, getUserClient } = useSDK()

  return async ({
    chainId,
    walletAddress,
    fleetAddress,
    amountString,
    tokenSymbol,
  }: {
    chainId: number
    walletAddress: string
    fleetAddress: string
    amountString: string
    tokenSymbol: string
  }) => {
    const fleet = await getFleetClient({ chainId, fleetAddress })
    const token = await getTokenBySymbol({ chainId, symbol: tokenSymbol })
    const user = await getUserClient({ chainId, walletAddress })

    return fleet.deposit({
      user: {
        wallet: user.wallet,
        chainInfo: user.chainInfo,
      },
      amount: TokenAmount.createFrom({
        amount: amountString,
        token,
      }),
    })
  }
}
