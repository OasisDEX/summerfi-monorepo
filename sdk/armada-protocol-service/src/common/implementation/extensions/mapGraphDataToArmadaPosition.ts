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
      amount: position.claimedSummerTokenNormalized,
      token: summerToken,
    })

    const claimableSummerToken = TokenAmount.createFrom({
      amount: position.claimableSummerTokenNormalized,
      token: summerToken,
    })

    const rewards = position.rewards.map((reward) => {
      const token = getTokenBySymbol({
        chainInfo,
        symbol: reward.rewardToken.symbol,
      })
      return {
        claimed: TokenAmount.createFrom({
          amount: reward.claimedNormalized,
          token: token,
        }),
        claimable: TokenAmount.createFrom({
          amount: reward.claimableNormalized,
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
      deposits: position.deposits.map((deposit) =>
        TokenAmount.createFrom({
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
        }),
      ),
      withdrawals: position.withdrawals.map((withdrawal) =>
        TokenAmount.createFrom({
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
        }),
      ),
      claimedSummerToken,
      claimableSummerToken,
      rewards,
    })
  }
