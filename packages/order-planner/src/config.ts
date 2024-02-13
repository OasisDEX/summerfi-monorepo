import { WithCollateral, WithDebt } from '~orderplanner/fetchers'
import {
  StrategyShortDefinitions,
  StrategyName,
  ActionType,
  Optionals,
} from '~orderplanner/interfaces'

export const Strategies: StrategyShortDefinitions = {
  /* Action Type, Parameter Fetchers, Storage Keys, Is Optional, Optional Exclusion */
  [StrategyName.DepositBorrow]: {
    steps: [
      [ActionType.PullToken, [WithCollateral], [], Optionals.Optional0, [Optionals.Optional1]],
      [ActionType.PullToken, [WithDebt], [], Optionals.Optional1, [Optionals.Optional0]],
      [ActionType.Deposit, [], [], Optionals.Mandatory],
      [ActionType.Borrow, [], [], Optionals.Mandatory],
    ],
    suffixMap: {
      [Optionals.Optional0]: 'PullCollateral',
      [Optionals.Optional1]: 'PullDebt',
    },
  },
  [StrategyName.AdjustRiskUp]: {
    steps: [
      [ActionType.PullToken, [], [], Optionals.Optional0],
      [ActionType.PullToken, [], [], Optionals.Optional1],
      [ActionType.Deposit, [], [], Optionals.Mandatory],
      [ActionType.Borrow, [], [], Optionals.Mandatory],
    ],
  },
}
