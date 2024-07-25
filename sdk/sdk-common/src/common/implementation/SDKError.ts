import { SerializationService } from '../../services/SerializationService'
import { ISDKError, ISDKErrorData } from '../interfaces'
import { SDKErrorType } from '../types/SDKErrorType'

/**
 * @class SDKError
 * @see ISDKError
 */
export class SDKError extends Error implements ISDKError {
  readonly type: SDKErrorType
  readonly reason: string
  readonly message: string

  /** FACTORY */
  static createFrom(params: ISDKErrorData): ISDKError {
    return new SDKError(params)
  }

  /** CONSTRUCTOR */
  protected constructor(params: ISDKErrorData) {
    super(params.message)

    this.type = params.type
    this.reason = params.reason
    this.message = params.message
  }
}

SerializationService.registerClass(SDKError)
