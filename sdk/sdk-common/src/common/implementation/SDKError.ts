import { SerializationService } from '../../services/SerializationService'
import { ISDKError, ISDKErrorData, __signature__ } from '../interfaces/ISDKError'
import { SDKErrorType } from '../enums/SDKErrorType'

/**
 * Type for the parameters of SDKError
 */
export type SDKErrorParameters = Omit<ISDKErrorData, ''>

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
  static createFrom(params: SDKErrorParameters): ISDKError {
    return new SDKError(params)
  }

  /** CONSTRUCTOR */
  protected constructor(params: SDKErrorParameters) {
    super(params.message)

    this.type = params.type
    this.reason = params.reason
    this.message = params.message
  }
}

SerializationService.registerClass(SDKError, { identifier: 'SDKError' })
