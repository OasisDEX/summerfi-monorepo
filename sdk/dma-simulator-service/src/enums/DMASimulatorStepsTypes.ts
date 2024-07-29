/**
 * Enum for the different types of simulation steps in the DMA system
 */
export enum DMASimulatorStepsTypes {
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
