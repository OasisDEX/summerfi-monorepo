import { type MerklReward } from '@summerfi/armada-protocol-common'

export const getMerkleFeesUSDClaimableNow = (
  merklRewards: MerklReward[] | undefined,
  token: string,
) => {
  if (merklRewards) {
    return merklRewards
      .filter((reward) => reward.token.symbol === token)
      .reduce((acc, reward) => {
        return (
          acc +
          Number(
            (Number(reward.amount) - Number(reward.claimed)) / Number(10 ** reward.token.decimals),
          )
        )
      }, 0)
  }

  return 0
}
