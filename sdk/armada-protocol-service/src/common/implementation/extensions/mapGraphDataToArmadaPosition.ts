import type { MerklReward } from '@summerfi/armada-protocol-common'
import {
  type IUser,
  SDKError,
  SDKErrorType,
  TokenAmount,
  Token,
  Address,
  type IChainInfo,
  type IToken,
  ArmadaPosition,
  ArmadaPositionId,
  ArmadaVault,
  ArmadaVaultId,
  type ChainId,
  type AddressValue,
  FiatCurrencyAmount,
  FiatCurrency,
  ChainIds,
} from '@summerfi/sdk-common'
import type { GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
import { BigNumber } from 'bignumber.js'

export const mapGraphDataToArmadaPosition =
  ({
    user,
    summerToken,
    getTokenBySymbol,
    merklSummerRewards,
  }: {
    user: IUser
    summerToken: IToken
    getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
    merklSummerRewards: {
      perChain: Partial<Record<ChainId, MerklReward[]>>
    }
  }) =>
  (position: GetUserPositionQuery['positions'][number]) => {
    const chainInfo = user.chainInfo
    if (position.vault.outputToken == null) {
      throw SDKError.createFrom({
        message: 'outputToken is null on position' + JSON.stringify(position.id),
        reason: 'probably a subgraph error',
        type: SDKErrorType.ArmadaError,
      })
    }
    // merkl rewards are only on base for now
    const merklSummerRewardsForPosition = merklSummerRewards.perChain[ChainIds.Base]?.reduce(
      (acc, reward) => {
        const vaultKey = position.vault.id.toLowerCase() as AddressValue
        // Guard against missing breakdowns for this chain
        const chainBreakdowns = reward.breakdowns[chainInfo.chainId]
        if (!chainBreakdowns) {
          return acc
        }
        const positionRewards = chainBreakdowns[vaultKey]
        if (positionRewards == null) {
          return acc
        }

        return {
          claimableSummerToken:
            acc.claimableSummerToken +
            BigInt(positionRewards.amount || '0') -
            BigInt(positionRewards.claimed || '0'),
          claimedSummerToken: acc.claimedSummerToken + BigInt(positionRewards.claimed || '0'),
        }
      },
      { claimableSummerToken: 0n, claimedSummerToken: 0n },
    )
    const claimedSummerToken = TokenAmount.createFromBaseUnit({
      amount: BigNumber(position.claimedSummerToken || '0')
        .plus(merklSummerRewardsForPosition?.claimedSummerToken.toString() || '0')
        .toFixed(),
      token: summerToken,
    })

    const claimableSummerToken = TokenAmount.createFromBaseUnit({
      amount: BigNumber(position.claimableSummerToken || '0')
        .plus(merklSummerRewardsForPosition?.claimableSummerToken.toString() || '0')
        .toFixed(),
      token: summerToken,
    })

    const rewards = position.rewards.map((reward) => {
      const token = getTokenBySymbol({
        chainInfo,
        symbol: reward.rewardToken.symbol,
      })
      if (token == null) {
        throw SDKError.createFrom({
          message: 'token not found for symbol: ' + reward.rewardToken.symbol,
          reason: 'missing in token list',
          type: SDKErrorType.ArmadaError,
        })
      }

      // for summer token rewards override with the calculated values above
      if (reward.rewardToken.symbol === summerToken.symbol) {
        return {
          claimed: claimedSummerToken,
          claimable: claimableSummerToken,
        }
      }

      return {
        claimed: TokenAmount.createFrom({
          amount: reward.claimedNormalized || '0',
          token: token,
        }),
        claimable: TokenAmount.createFrom({
          amount: reward.claimableNormalized || '0',
          token: token,
        }),
      }
    })

    const fleetBalance = BigNumber(position.inputTokenBalance.toString())
    const sharesBalance = BigNumber(position.outputTokenBalance.toString())

    return ArmadaPosition.createFrom({
      id: ArmadaPositionId.createFrom({ id: position.id, user: user }),
      pool: ArmadaVault.createFrom({
        id: ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({
            value: position.vault.id,
          }),
        }),
      }),
      shares: TokenAmount.createFromBaseUnit({
        amount: sharesBalance.toFixed(),
        token: Token.createFrom({
          chainInfo,
          address: Address.createFromEthereum({
            value: position.vault.outputToken.id,
          }),
          name: position.vault.outputToken.name,
          symbol: position.vault.outputToken.symbol,
          decimals: position.vault.outputToken.decimals,
        }),
      }),
      amount: TokenAmount.createFromBaseUnit({
        amount: fleetBalance.toFixed(),
        token: Token.createFrom({
          chainInfo,
          address: Address.createFromEthereum({
            value: position.vault.inputToken.id,
          }),
          name: position.vault.inputToken.name,
          symbol: position.vault.inputToken.symbol,
          decimals: position.vault.inputToken.decimals,
        }),
      }),
      depositsAmount: TokenAmount.createFromBaseUnit({
        amount: position.inputTokenDeposits.toString(),
        token: Token.createFrom({
          chainInfo,
          address: Address.createFromEthereum({
            value: position.vault.inputToken.id,
          }),
          name: position.vault.inputToken.name,
          symbol: position.vault.inputToken.symbol,
          decimals: position.vault.inputToken.decimals,
        }),
      }),
      withdrawalsAmount: TokenAmount.createFromBaseUnit({
        amount: position.inputTokenWithdrawals.toString(),
        token: Token.createFrom({
          chainInfo,
          address: Address.createFromEthereum({
            value: position.vault.inputToken.id,
          }),
          name: position.vault.inputToken.name,
          symbol: position.vault.inputToken.symbol,
          decimals: position.vault.inputToken.decimals,
        }),
      }),
      depositsAmountUSD: FiatCurrencyAmount.createFrom({
        amount: position.inputTokenDepositsNormalizedInUSD,
        fiat: FiatCurrency.USD,
      }),
      withdrawalsAmountUSD: FiatCurrencyAmount.createFrom({
        amount: position.inputTokenWithdrawalsNormalizedInUSD,
        fiat: FiatCurrency.USD,
      }),
      deposits: [],
      withdrawals: [],
      claimedSummerToken,
      claimableSummerToken,
      rewards,
    })
  }
