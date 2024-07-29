/**
 * Enum for the different steps that the DMA simulator uses
 */
export enum SimulationSteps {
  Flashloan = 'Flashloan',
  DepositBorrow = 'DepositBorrow',
  PaybackWithdraw = 'PaybackWithdraw',
  Swap = 'Swap',
  PullToken = 'PullToken',
  ReturnFunds = 'ReturnFunds',
  RepayFlashloan = 'RepayFlashloan',
  Import = 'Import',
  NewPositionEvent = 'NewPositionEvent',
  OpenPosition = 'OpenPosition',
  Skipped = 'Skipped',
}

/**
 * Generic type for the simulation steps definitions. Any enum for the steps types
 * must follow this structure:
 *
 *   ```ts
 *      export enum RefinanceSteps {
 *       Step1 = 'Step1',
 *       Step2 = 'Step2',
 *       Step3 = 'Step3',
 *      }
 *  ```
 */
export type SimulationStepsEnum = {
  [id: string]: string
}
