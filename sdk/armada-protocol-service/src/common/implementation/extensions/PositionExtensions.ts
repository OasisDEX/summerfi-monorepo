import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import {
  TokenAmount,
  Token,
  type IUser,
  Address,
  SDKError,
  SDKErrorType,
} from '@summerfi/sdk-common'
import { ArmadaPool } from '../ArmadaPool'
import { ArmadaPoolId } from '../ArmadaPoolId'
import { ArmadaPosition } from '../ArmadaPosition'
import { ArmadaPositionId } from '../ArmadaPositionId'
import { ArmadaProtocol } from '../ArmadaProtocol'
import type { PositionsByAddressQuery } from '@summerfi/subgraph-manager-common'

/**
 * @name PositionExtensions
 * @description Extensions for the position handling logic, like mappers and parsers
 */
export class PositionExtensions {
  static parseUserPositionsQuery = ({
    user,
    query,
  }: {
    user: IUser
    query: PositionsByAddressQuery
  }): IArmadaPosition[] => {
    const chainInfo = user.chainInfo
    return query.positions.map((position) => {
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
          id: ArmadaPoolId.createFrom({
            chainInfo,
            fleetAddress: Address.createFromEthereum({
              value: position.vault.id,
            }),
            protocol: ArmadaProtocol.createFrom({ chainInfo }),
          }),
        }),
        amount: TokenAmount.createFrom({
          amount: position.inputTokenBalance.toString(),
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
    })
  }
}
