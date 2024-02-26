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
  PaybackFlashloan = 'PaybackFlashloan',
}

export enum FlashloanProvider {
    Maker = 'Maker',
    Balancer = 'Balancer',
}