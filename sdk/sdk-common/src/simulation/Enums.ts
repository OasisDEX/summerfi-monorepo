export enum SimulationType {
  ImportPosition = 'ImportPosition',
  ColosePosition = 'ColosePosition',
  AddCollateral = 'AddCollateral',
  RemoveAutomation = 'RemoveAutomation',
  AddAutomation = 'AddAutomation',
  Migrate = 'Migrate',
  CreatePosition = 'CreatePosition',
  Refinance = 'Refinance',
}

export enum SimulationSteps {
  Flashloan = 'Flashloan',
  DepositBorrow = 'DepositBorrow',
  PaybackWithdraw = 'PaybackWithdraw',
  Swap = 'Swap',
  PullToken = 'PullToken',
  ReturnFunds = 'ReturnFunds',
  RepayFlashloan = 'RepayFlashloan',
  NewPositionEvent = 'NewPositionEvent',
  Import = 'Import',
}

export enum FlashloanProvider {
  Maker = 0,
  Balancer = 1,
}

export enum TokenTransferTargetType {
  PositionsManager = 1,
  StrategyExecutor = 0,
}
