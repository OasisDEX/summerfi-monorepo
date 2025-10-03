import type { IArmadaPosition, IArmadaVaultInfo } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

export function stringifyArmadaVaultInfo(vaultInfo: IArmadaVaultInfo): string {
  return JSON.stringify(
    {
      id: vaultInfo.id.toString(),
      address: vaultInfo.id.fleetAddress.toString(),
      token: vaultInfo.token.toString(),
      assetToken: vaultInfo.assetToken.toString(),
      depositCap: vaultInfo.depositCap.toString(),
      totalDeposits: vaultInfo.totalDeposits.toString(),
      totalShares: vaultInfo.totalShares.toString(),
      sharePrice: vaultInfo.sharePrice.toString(),
      apy: vaultInfo.apy?.toString(),
      apys: {
        live: vaultInfo.apys.live?.toString(),
        sma24h: vaultInfo.apys.sma24h?.toString(),
        sma7day: vaultInfo.apys.sma7day?.toString(),
        sma30day: vaultInfo.apys.sma30day?.toString(),
      },
      rewardsApys: vaultInfo.rewardsApys.map((reward) => ({
        token: reward.token.toString(),
        apy: reward.apy?.toString(),
      })),
      merklRewards: vaultInfo.merklRewards?.map((reward) => ({
        token: reward.token.toString(),
        dailyEmission: BigNumber(reward.dailyEmission).div(BigNumber('1e18')).toString(),
      })),
    },
    null,
    2,
  )
}

export function stringifyArmadaPosition(position: IArmadaPosition): string {
  return JSON.stringify(
    {
      id: position.id.id,
      amount: position.amount.toString(),
      depositsAmount: position.depositsAmount.toString(),
      withdrawalsAmount: position.withdrawalsAmount.toString(),
      depositsAmountUSD: position.depositsAmountUSD.toString(),
      withdrawalsAmountUSD: position.withdrawalsAmountUSD.toString(),
      deposits: position.deposits.length,
      withdrawals: position.withdrawals.length,
      rewards: position.rewards.map((reward) => ({
        claimed: reward.claimed.toString(),
        claimable: reward.claimable.toString(),
      })),
      claimed: position.claimedSummerToken.toString(),
      claimable: position.claimableSummerToken.toString(),
    },
    null,
    2,
  )
}
