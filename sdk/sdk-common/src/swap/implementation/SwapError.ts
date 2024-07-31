import { SDKError } from '../../common/implementation/SDKError'
import { SDKErrorType } from '../../common/types/SDKErrorType'
import { SerializationService } from '../../services/SerializationService'
import { SwapErrorType } from '../enums/SwapErrorType'
import { ISwapError, ISwapErrorData, __iswaperror__ } from '../interfaces/ISwapError'

/**
 * @class SwapError
 * @see ISwapError
 */
export class SwapError extends SDKError implements ISwapError {
  /** SIGNATURE */
  readonly [__iswaperror__] = 'ISwapError'

  /** ATTRIBUTES */
  readonly type: SDKErrorType.SwapError
  readonly subtype: SwapErrorType
  readonly apiQuery: string
  readonly statusCode: number

  /** FACTORY */
  static createFrom(params: ISwapErrorData): SwapError {
    return new SwapError(params)
  }

  /** CONSTRUCTOR */
  private constructor(params: ISwapErrorData) {
    super(params)

    this.type = SDKErrorType.SwapError
    this.subtype = params.subtype
    this.apiQuery = params.apiQuery
    this.statusCode = params.statusCode
  }
}

SerializationService.registerClass(SwapError)
