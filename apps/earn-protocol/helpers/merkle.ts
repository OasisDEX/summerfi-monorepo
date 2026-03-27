import { type MerklReward } from '@summerfi/armada-protocol-common'

export const getMerkleNowClaimableTokenAmount = (
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
export const getMerkleNowClaimableTokenAddress = (
  merklRewards: MerklReward[] | undefined,
  token: string,
) => {
  if (merklRewards) {
    return merklRewards
      .filter((reward) => reward.token.symbol === token)
      .map((reward) => reward.token.address)[0]
  }

  // eslint-disable-next-line no-console
  console.log('getMerkleNowClaimableTokenAddress: No claimable rewards found for token:', token)

  return ''
}

export const getMerkleTokenUSDAmount = (
  merklRewards: MerklReward[] | undefined,
  tokenAmount: number,
  token: string,
) => {
  if (merklRewards) {
    return merklRewards
      .filter((reward) => reward.token.symbol === token)
      .reduce((acc, reward) => {
        return acc + Number(tokenAmount * (reward.token.price || 0))
      }, 0)
  }

  return 0
}
