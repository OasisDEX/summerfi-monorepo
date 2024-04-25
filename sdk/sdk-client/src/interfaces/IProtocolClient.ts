import { Maybe } from '@summerfi/sdk-common/common'
import { ILendingPoolIdData, IPool, IProtocol } from '@summerfi/sdk-common/protocols'

export interface IProtocolClient extends IProtocol {
  getLendingPool(params: { poolId: ILendingPoolIdData }): Promise<Maybe<IPool>>
}
