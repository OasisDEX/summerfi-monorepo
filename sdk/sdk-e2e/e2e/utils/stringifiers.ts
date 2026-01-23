/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IArmadaPosition, IArmadaVaultInfo } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import { SUMR_DECIMALS } from './constants'

export function formatToken(value: bigint, decimals: number): string {
  return BigNumber(value).shiftedBy(-decimals).toFixed()
}

export function formatSumr(value: bigint): string {
  return formatToken(value, Number(SUMR_DECIMALS))
}

export function displayMerklReward(reward: {
  amount: string
  claimed: string
  token: { decimals: number; symbol: string }
}): string {
  let result = reward.token.symbol + ': '
  result += `Amount: ${formatToken(BigInt(reward.amount), reward.token.decimals)}`
  result += `, Claimed: ${formatToken(BigInt(reward.claimed), reward.token.decimals)}`

  return result
}

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
      rewardsApys: vaultInfo.rewardsApys?.map((reward) => ({
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
      assets: position.assets.toString(),
      assetPriceUSD: position.assetPriceUSD.toString(),
      assetsUSD: position.assetsUSD.toString(),
      shares: position.shares.toString(),
      depositsAmount: position.depositsAmount.toString(),
      withdrawalsAmount: position.withdrawalsAmount.toString(),
      depositsAmountUSD: position.depositsAmountUSD.toString(),
      withdrawalsAmountUSD: position.withdrawalsAmountUSD.toString(),
      netDeposits: position.netDeposits.toString(),
      netDepositsUSD: position.netDepositsUSD.toString(),
      earnings: position.earnings.toString(),
      earningsUSD: position.earningsUSD.toString(),
      claimedSummerToken: position.claimedSummerToken.toString(),
      claimableSummerToken: position.claimableSummerToken.toString(),
      rewards: position.rewards.map((reward) => ({
        claimed: reward.claimed.toString(),
        claimable: reward.claimable.toString(),
      })),
      deposits: position.deposits.length,
      withdrawals: position.withdrawals.length,
    },
    null,
    2,
  )
}
