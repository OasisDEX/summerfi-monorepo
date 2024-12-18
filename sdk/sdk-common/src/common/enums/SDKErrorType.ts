/**
 * @description Error types for the SDK
 *
 * Used to categorize errors and provide a more detailed error message for the client
 */
export enum SDKErrorType {
  /** Core types error */
  Core = 'Core',
  /** Swap service errors */
  SwapError = 'SwapError',
  /** Earn protocol service errors */
  ArmadaError = 'ArmadaError',
  /** Order Planner errors */
  OrderPlannerError = 'OrderPlannerError',
  /** Simulator errors */
  Simulator = 'Simulator',
}
