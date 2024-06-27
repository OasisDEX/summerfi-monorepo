import { SDKErrorType } from '../../common/enums/SDKErrorType'
import { SDKError } from '../../common/implementation/SDKError'
import { SerializationService } from '../../services/SerializationService'
import { SwapErrorType } from '../enums/SwapErrorType'
import { ISwapError, ISwapErrorData } from '../interfaces/ISwapError'

/**
 * @class SwapError
 * @see ISwapError
 */
export class SwapError extends SDKError implements ISwapError {
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
