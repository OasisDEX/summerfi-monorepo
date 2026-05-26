/**
 * @name IDcaExecution
 * @description Represents a single execution of a DCA strategy
 */
export interface IDcaExecution {
  /** Unique identifier of this execution */
  id: string
  /** Transaction hash of this execution */
  txHash: string
  /** Unix timestamp of when the execution occurred */
  executionTimestamp: number
  /** Amount of input tokens used in this execution (in token units, as string) */
  amountIn: string
  /** Amount of output tokens received in this execution (in token units, as string) */
  amountOut: string
  /** Total number of trades executed after this execution */
  tradesExecutedAfter: number
}
