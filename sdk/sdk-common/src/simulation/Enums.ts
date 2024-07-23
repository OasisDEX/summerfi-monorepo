export enum SimulationType {
  ImportPosition = 'ImportPosition',
  ColosePosition = 'ColosePosition',
  AddCollateral = 'AddCollateral',
  RemoveAutomation = 'RemoveAutomation',
  AddAutomation = 'AddAutomation',
  Migrate = 'Migrate',
  CreatePosition = 'CreatePosition',
  Refinance = 'Refinance',
  EarnProtocol = 'EarnProtocol',
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
  OpenPosition = 'OpenPosition',
  Skipped = 'Skipped',
}

export enum FlashloanProvider {
  Maker = 0,
  Balancer = 1,
}

export enum TokenTransferTargetType {
  StrategyExecutor = 0,
  PositionsManager = 1,
}
