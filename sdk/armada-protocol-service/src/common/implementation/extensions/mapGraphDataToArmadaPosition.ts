import {
  type IUser,
  SDKError,
  SDKErrorType,
  TokenAmount,
  Token,
  Address,
  type IChainInfo,
} from '@summerfi/sdk-common'
import type { GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
import { ArmadaPool } from '../ArmadaPool'
import { ArmadaVaultId } from '../ArmadaVaultId'
import { ArmadaPosition } from '../ArmadaPosition'
import { ArmadaPositionId } from '../ArmadaPositionId'
import { BigNumber } from 'bignumber.js'

export const mapGraphDataToArmadaPosition =
  ({ user, chainInfo }: { user: IUser; chainInfo: IChainInfo }) =>
  (position: GetUserPositionQuery['positions'][number]) => {
    if (position.vault.outputToken == null) {
      throw SDKError.createFrom({
        message: 'outputToken is null on position' + JSON.stringify(position.id),
        reason: 'probably a subgraph error',
        type: SDKErrorType.ArmadaError,
      })
    }

    return ArmadaPosition.createFrom({
      id: ArmadaPositionId.createFrom({ id: position.id, user: user }),

      pool: ArmadaPool.createFrom({
        id: ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({
            value: position.vault.id,
          }),
        }),
      }),
      amount: TokenAmount.createFrom({
        amount: BigNumber(position.inputTokenBalance.toString())
          .div(10 ** position.vault.outputToken.decimals)
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
      shares: TokenAmount.createFrom({
        amount: position.outputTokenBalance.toString(),
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
    })
  }
