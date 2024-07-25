import { z } from 'zod'
import { ISDKError, SDKErrorDataSchema } from '../../common/interfaces/ISDKError'
import { SDKErrorType } from '../../common/types/SDKErrorType'
import { SwapErrorType } from '../enums/SwapErrorType'

/**
 * @name ISwapError
 * @description Represents a custom error of the SDK for the Swap service
 */
export interface ISwapError extends ISDKError, ISwapErrorData {
  readonly type: SDKErrorType.SwapError
  /** Specific error for the swap service */
  readonly subtype: SwapErrorType
  /** Full URL of the API query that generated the error */
  readonly apiQuery: string
  /** GET or POST status code */
  readonly statusCode: number
}

/**
 * @description Zod schema for ISwapError
 */
export const SwapErrorDataSchema = z.object({
  ...SDKErrorDataSchema.shape,
  type: z.literal(SDKErrorType.SwapError),
  subtype: z.nativeEnum(SwapErrorType),
  apiQuery: z.string(),
  statusCode: z.number(),
})

/**
 * Type for the data part of the IError interface
 */
export type ISwapErrorData = Readonly<z.infer<typeof SwapErrorDataSchema>>

/**
 * @description Type guard for ISwapError
 * @param maybeSwapErrorData
 * @returns true if the object is an ISwapError
 */
export function isSwapError(maybeSwapErrorData: unknown): maybeSwapErrorData is ISwapErrorData {
  return SwapErrorDataSchema.safeParse(maybeSwapErrorData).success
}
