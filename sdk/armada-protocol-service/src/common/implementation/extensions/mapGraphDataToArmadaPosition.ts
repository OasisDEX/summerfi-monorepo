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
} from '@summerfi/sdk-common'
import type { GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
import { BigNumber } from 'bignumber.js'

export const mapGraphDataToArmadaPosition =
  ({
    user,
    chainInfo,
    summerToken,
    getTokenBySymbol,
  }: {
    user: IUser
    chainInfo: IChainInfo
    summerToken: IToken
    getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
  }) =>
  (position: GetUserPositionQuery['positions'][number]) => {
    if (position.vault.outputToken == null) {
      throw SDKError.createFrom({
        message: 'outputToken is null on position' + JSON.stringify(position.id),
        reason: 'probably a subgraph error',
        type: SDKErrorType.ArmadaError,
      })
    }

    const fleetBalance = BigNumber(position.inputTokenBalance.toString()).div(
      10 ** position.vault.inputToken.decimals,
    )

    const sharesBalance = BigNumber(position.outputTokenBalance.toString())

    const claimedSummerToken = TokenAmount.createFrom({
      amount: position.claimedSummerTokenNormalized || '0',
      token: summerToken,
    })

    const claimableSummerToken = TokenAmount.createFrom({
      amount: position.claimableSummerTokenNormalized || '0',
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
      shares: TokenAmount.createFrom({
        amount: sharesBalance.toString(),
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
      amount: TokenAmount.createFrom({
        amount: fleetBalance.toString(),
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
      deposits: position.deposits.map((deposit) => {
        const amount = TokenAmount.createFrom({
          amount: BigNumber(deposit.amount.toString())
            .div(10 ** position.vault.inputToken.decimals)
            .toString(),
          token: Token.createFrom({
            chainInfo,
            address: Address.createFromEthereum({
              value: position.vault.inputToken.id,
            }),
            name: position.vault.inputToken.name,
            symbol: position.vault.inputToken.symbol,
            decimals: position.vault.inputToken.decimals,
          }),
        })
        return {
          amount,
          timestamp: Number(deposit.timestamp),
        }
      }),
      withdrawals: position.withdrawals.map((withdrawal) => {
        const amount = TokenAmount.createFrom({
          amount: BigNumber(withdrawal.amount.toString())
            .div(10 ** position.vault.inputToken.decimals)
            .toString(),
          token: Token.createFrom({
            chainInfo,
            address: Address.createFromEthereum({
              value: position.vault.inputToken.id,
            }),
            name: position.vault.inputToken.name,
            symbol: position.vault.inputToken.symbol,
            decimals: position.vault.inputToken.decimals,
          }),
        })
        return {
          amount,
          timestamp: Number(withdrawal.timestamp),
        }
      }),
      claimedSummerToken,
      claimableSummerToken,
      rewards,
    })
  }
