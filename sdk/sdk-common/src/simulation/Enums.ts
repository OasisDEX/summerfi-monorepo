export enum SimulationType {
  ImportPosition = 'ImportPosition',
  ColosePosition = 'ColosePosition',
  AddCollateral = 'AddCollateral',
  RemoveAutomation = 'RemoveAutomation',
  AddAutomation = 'AddAutomation',
  Migrate = 'Migrate',
  CreatePosition = 'CreatePosition',
  Refinance = 'Refinance',
  RefinanceDifferentPair = 'RefinanceDifPair',
  RefinanceDifferentDebt = 'RefinanceDifDebt',
  RefinanceDifferentCollateral = 'RefinanceDifCol',
  RefinanceNoDebt = 'RefinanceNoDebt',
  RefinanceNoDebtDifferentCollateral = 'RefNoDebtDifCol',
}

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
}

export enum FlashloanProvider {
  Maker = 0,
  Balancer = 1,
}

export enum TokenTransferTargetType {
  PositionsManager = 1,
  StrategyExecutor = 0,
}

export type RefinanceSimulationTypes =
  | SimulationType.Refinance
  | SimulationType.RefinanceDifferentPair
  | SimulationType.RefinanceDifferentCollateral
  | SimulationType.RefinanceDifferentDebt
  | SimulationType.RefinanceNoDebt
  | SimulationType.RefinanceNoDebtDifferentCollateral
