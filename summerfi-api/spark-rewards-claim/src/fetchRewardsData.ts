import { safeParseBigInt } from '@summerfi/serverless-shared'
import { type RewardsData, type SparkRewardsResponse } from './types'
import { getClaimType } from './mappings'
import type { Hex } from 'viem'
import { supportedChainIds, type SupportedChainIds } from './supportedChainIds'

export const fetchRewardsData = async ({
  account,
  chainId,
}: {
  account: Hex
  chainId: SupportedChainIds
}): Promise<RewardsData[]> => {
  if (!supportedChainIds.includes(chainId)) {
    throw new Error(
      `Not supported chain id ${chainId}. Supported chain ids are: ${supportedChainIds.join(', ')}`,
    )
  }

  const [rewardsResponse] = await Promise.all([
    fetch(
      `https://spark2-api.blockanalitica.com/api/v1/spk-airdrop/${account}/?ignition_root=0x0b90e54808c026feb46dabad594c8e2f6625091d82effa5119ea6059dcc5a979&demask_key=580dfbc5609de875ae443c6467ca2539`,
    ),
  ])

  if (!rewardsResponse.ok) {
    throw new Error(`Failed to fetch user rewards: ${rewardsResponse.statusText}`)
  }

  const rewardsResponseData = (await rewardsResponse.json()) as SparkRewardsResponse

  const result: RewardsData[] = []

  rewardsResponseData.forEach((reward) => {
    // check with bignumber if amount is gt 0
    const amount = safeParseBigInt(reward.amount)
    if (amount == null || amount <= 0) {
      console.warn(`Skipping reward with non-positive amount: ${reward.amount}`)
      return
    }

    result.push({
      claimType: getClaimType(reward),
      claimArgs: {
        account: reward.wallet_address as Hex,
        tokenAddress: reward.token_address as Hex,
        amount: amount,
        proof: reward.proof as Hex[],
        rootHash: reward.root_hash as Hex,
        epoch: BigInt(reward.epoch),
      },
    })
  })

  return result
}
