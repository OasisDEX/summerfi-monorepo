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
    protocolUsageRewards,
  }: {
    user: IUser
    summerToken: IToken
    getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
    merklSummerRewards: {
      perChain: Partial<Record<ChainId, MerklReward[]>>
    }
    protocolUsageRewards: {
      total: bigint
      perFleet: Record<string, bigint>
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

    const id = ArmadaPositionId.createFrom({ id: position.id, user: user })

    const pool = ArmadaVault.createFrom({
      id: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({
          value: position.vault.id,
        }),
      }),
    })

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

    // get earned summer token from v1 vault usage rewards
    const _claimableSummerToken = protocolUsageRewards.perFleet[position.id]
    const claimableSummerToken = TokenAmount.createFromBaseUnit({
      amount: BigNumber(_claimableSummerToken || '0')
        .plus(merklSummerRewardsForPosition?.claimableSummerToken.toString() || '0')
        .toFixed(),
      token: summerToken,
    })

    const _rewards = [
      {
        rewardToken: claimableSummerToken.token,
        claimedNormalized: claimedSummerToken.amount,
        claimableNormalized: claimableSummerToken.amount,
      },
    ]
    const rewards = _rewards.map((reward) => {
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

    const shares = TokenAmount.createFromBaseUnit({
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
    })

    const assetToken = Token.createFrom({
      chainInfo,
      address: Address.createFromEthereum({
        value: position.vault.inputToken.id,
      }),
      name: position.vault.inputToken.name,
      symbol: position.vault.inputToken.symbol,
      decimals: position.vault.inputToken.decimals,
    })

    const assetPriceUSD = FiatCurrencyAmount.createFrom({
      amount: position.vault.inputTokenPriceUSD || '0',
      fiat: FiatCurrency.USD,
    })

    const assets = TokenAmount.createFromBaseUnit({
      amount: fleetBalance.toFixed(),
      token: assetToken,
    })

    const assetsUSDAmount = assets.toBigNumber().multipliedBy(assetPriceUSD.toBigNumber()).toFixed()
    const assetsUSD = FiatCurrencyAmount.createFrom({
      amount: assetsUSDAmount,
      fiat: FiatCurrency.USD,
    })

    const depositsAmount = TokenAmount.createFromBaseUnit({
      amount: position.inputTokenDeposits.toString(),
      token: assetToken,
    })

    const withdrawalsAmount = TokenAmount.createFromBaseUnit({
      amount: position.inputTokenWithdrawals.toString(),
      token: assetToken,
    })

    const depositsAmountUSD = FiatCurrencyAmount.createFrom({
      amount: position.inputTokenDepositsNormalizedInUSD,
      fiat: FiatCurrency.USD,
    })

    const withdrawalsAmountUSD = FiatCurrencyAmount.createFrom({
      amount: position.inputTokenWithdrawalsNormalizedInUSD,
      fiat: FiatCurrency.USD,
    })

    // Calculate net deposits: deposits - withdrawals
    const netDeposits = TokenAmount.createFromBaseUnit({
      amount: depositsAmount.add(withdrawalsAmount).toSolidityValue().toString(),
      token: assetToken,
    })

    // Calculate net deposits USD: depositsUSD - withdrawalsUSD
    const netDepositsUSD = FiatCurrencyAmount.createFrom({
      amount: depositsAmountUSD.add(withdrawalsAmountUSD).toBigNumber().toFixed(),
      fiat: FiatCurrency.USD,
    })

    // Calculate earnings: assets - netDeposits
    const earnings = TokenAmount.createFromBaseUnit({
      amount: assets.subtract(netDeposits).toSolidityValue().toString(),
      token: assetToken,
    })

    // Calculate earnings USD: assetsUSD - netDepositsUSD
    const earningsUSD = FiatCurrencyAmount.createFrom({
      amount: assetsUSD.subtract(netDepositsUSD).toBigNumber().toFixed(),
      fiat: FiatCurrency.USD,
    })

    return ArmadaPosition.createFrom({
      id,
      pool,
      assets,
      assetPriceUSD,
      assetsUSD,
      shares,
      depositsAmount,
      depositsAmountUSD,
      withdrawalsAmount,
      withdrawalsAmountUSD,
      netDeposits,
      netDepositsUSD,
      earnings,
      earningsUSD,
      claimedSummerToken,
      claimableSummerToken,
      rewards,
      amount: assets,
      deposits: [],
      withdrawals: [],
    })
  }
