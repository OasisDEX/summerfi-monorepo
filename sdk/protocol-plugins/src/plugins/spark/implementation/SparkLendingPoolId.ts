import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPoolId, ISparkLendingPoolIdData } from '../interfaces/ISparkLendingPoolId'
import { EmodeType } from '../../common'
import { SparkProtocol } from './SparkProtocol'
import { LendingPoolId } from '@summerfi/sdk-common'
import { IPrintable } from '@summerfi/sdk-common/common'

/**
 * @class SparkLendingPoolId
 * @see ISparkLendingPoolIdData
 */
export class SparkLendingPoolId extends LendingPoolId implements ISparkLendingPoolId, IPrintable {
  readonly protocol: SparkProtocol
  readonly emodeType: EmodeType

  /** Factory method */
  static createFrom(params: ISparkLendingPoolIdData): SparkLendingPoolId {
    return new SparkLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkLendingPoolIdData) {
    super(params)

    this.protocol = SparkProtocol.createFrom(params.protocol)
    this.emodeType = params.emodeType
  }

  toString(): string {
    return `${LendingPoolId.toString()} [emode: ${this.emodeType}]`
  }
}

SerializationService.registerClass(SparkLendingPoolId)
