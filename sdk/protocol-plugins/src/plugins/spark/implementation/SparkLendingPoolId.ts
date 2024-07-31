import { IPrintable, IToken } from '@summerfi/sdk-common/common'
import { LendingPoolId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { EmodeType } from '../../common'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdParameters,
} from '../interfaces/ISparkLendingPoolId'
import { ISparkProtocol } from '../interfaces/ISparkProtocol'

/**
 * @class SparkLendingPoolId
 * @see ISparkLendingPoolIdData
 */
export class SparkLendingPoolId extends LendingPoolId implements ISparkLendingPoolId, IPrintable {
  readonly _signature_2 = 'ISparkLendingPoolId'

  readonly protocol: ISparkProtocol
  readonly emodeType: EmodeType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** Factory method */
  static createFrom(params: ISparkLendingPoolIdParameters): SparkLendingPoolId {
    return new SparkLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkLendingPoolIdParameters) {
    super(params)

    this.protocol = params.protocol
    this.emodeType = params.emodeType
    this.collateralToken = params.collateralToken
    this.debtToken = params.debtToken
  }

  toString(): string {
    return `${LendingPoolId.toString()} [emode: ${this.emodeType}]`
  }
}

SerializationService.registerClass(SparkLendingPoolId)
