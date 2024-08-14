import { SDKError } from '../../common/implementation/SDKError'
import { SDKErrorType } from '../../common/types/SDKErrorType'
import { SerializationService } from '../../services/SerializationService'
import { SwapErrorType } from '../enums/SwapErrorType'
import { ISwapError, ISwapErrorData, __signature__ } from '../interfaces/ISwapError'

/**
 * Type for the parameters of SwapError
 */
export type SwapErrorParams = Omit<ISwapErrorData, ''>

/**
 * @class SwapError
 * @see ISwapError
 */
export class SwapError extends SDKError implements ISwapError {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: SDKErrorType.SwapError
  readonly subtype: SwapErrorType
  readonly apiQuery: string
  readonly statusCode: number

  /** FACTORY */
  static createFrom(params: SwapErrorParams): SwapError {
    return new SwapError(params)
  }

  /** CONSTRUCTOR */
  private constructor(params: SwapErrorParams) {
    super(params)

    this.type = SDKErrorType.SwapError
    this.subtype = params.subtype
    this.apiQuery = params.apiQuery
    this.statusCode = params.statusCode
  }
}

SerializationService.registerClass(SwapError)
