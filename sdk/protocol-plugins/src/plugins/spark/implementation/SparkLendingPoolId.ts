import { IPrintable, IToken, LendingPoolId, SerializationService } from '@summerfi/sdk-common'
import { EmodeType } from '../../common/enums/EmodeType'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  __signature__,
} from '../interfaces/ISparkLendingPoolId'
import { ISparkProtocol } from '../interfaces/ISparkProtocol'

/**
 * Type for the parameters of SparkLendingPoolId
 */
export type SparkLendingPoolIdParameters = Omit<ISparkLendingPoolIdData, 'type'>

/**
 * @class SparkLendingPoolId
 * @see ISparkLendingPoolIdData
 */
export class SparkLendingPoolId extends LendingPoolId implements ISparkLendingPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly protocol: ISparkProtocol
  readonly emodeType: EmodeType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** FACTORY */
  static createFrom(params: SparkLendingPoolIdParameters): SparkLendingPoolId {
    return new SparkLendingPoolId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: SparkLendingPoolIdParameters) {
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

SerializationService.registerClass(SparkLendingPoolId, { identifier: 'SparkLendingPoolId' })
