import { z } from 'zod'
import { SDKErrorType } from '../types/SDKErrorType'
import { IPrintable } from './IPrintable'

/**
 * @name ISDKError
 * @description Represents a custom error of the SDK
 */
export interface ISDKError extends ISDKErrorData, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_0: 'ISDKError'
  /** Error type main category */
  readonly type: SDKErrorType
  /** Free form reason message, used to provide a short description of the problem */
  readonly reason: string
  /** Free form debug message, used to debug the issue through the console */
  readonly message: string
}

/**
 * @description Zod schema for ISDKError
 */
export const SDKErrorDataSchema = z.object({
  type: z.nativeEnum(SDKErrorType),
  reason: z.string(),
  message: z.string(),
})

/**
 * Type for the data part of the ISDKError interface
 */
export type ISDKErrorData = Readonly<z.infer<typeof SDKErrorDataSchema>>

/**
 * Type for the parameters of the ISDKError interface
 */
export type ISDKErrorParameters = Omit<ISDKErrorData, ''>

/**
 * @description Type guard for ISDKError
 * @param maybeErrorData
 * @returns true if the object is an ISDKError
 */
export function isSDKError(maybeErrorData: unknown): maybeErrorData is ISDKErrorData {
  return SDKErrorDataSchema.safeParse(maybeErrorData).success
}
