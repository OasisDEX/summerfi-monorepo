import { type MerklReward } from '@summerfi/armada-protocol-common'

export const getMerkleFeesUSDClaimableNow = (merklRewards: MerklReward[] | undefined) => {
  if (merklRewards) {
    return merklRewards.reduce((acc, reward) => {
      return (
        acc +
        Number(
          ((Number(reward.amount) - Number(reward.claimed)) / Number(10 ** reward.token.decimals)) *
            reward.token.price,
        )
      )
    }, 0)
  }

  return 0
}
