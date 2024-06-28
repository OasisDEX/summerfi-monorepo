/**
 * @description Swap error types
 *
 * Error types for the swap service
 */
export enum SwapErrorType {
  /** The error is not known or could not be decoded */
  Unknown = 'Unknown',
  /** The swap provider indicates that there is not enough liquidity for the swap */
  NoLiquidity = 'NoLiquidity',
}
