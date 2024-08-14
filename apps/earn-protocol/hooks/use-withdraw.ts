import { type Token, TokenAmount } from '@summerfi/sdk-common'

import { useSDK } from '@/hooks/use-sdk'

export const useWithdraw = () => {
  const { getFleetClient, getUserClient } = useSDK()

  return async ({
    chainId,
    walletAddress,
    fleetAddress,
    amountString,
    token,
  }: {
    chainId: number
    walletAddress: string
    fleetAddress: string
    amountString: string
    token: Token
  }) => {
    const fleet = await getFleetClient({ chainId, fleetAddress })
    const user = await getUserClient({ chainId, walletAddress })

    return fleet.withdraw({
      user,
      amount: TokenAmount.createFrom({
        amount: amountString,
        token,
      }),
    })
  }
}
