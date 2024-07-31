import { SerializationService } from '../../services/SerializationService'
import { ISDKError, ISDKErrorParameters } from '../interfaces'
import { __signature__ } from '../interfaces/ISDKError'
import { SDKErrorType } from '../types/SDKErrorType'

/**
 * @class SDKError
 * @see ISDKError
 */
export class SDKError extends Error implements ISDKError {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: SDKErrorType
  readonly reason: string
  readonly message: string

  /** FACTORY */
  static createFrom(params: ISDKErrorParameters): ISDKError {
    return new SDKError(params)
  }

  /** CONSTRUCTOR */
  protected constructor(params: ISDKErrorParameters) {
    super(params.message)

    this.type = params.type
    this.reason = params.reason
    this.message = params.message
  }
}

SerializationService.registerClass(SDKError)
