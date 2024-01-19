import { SupportedTriggers, TriggerData } from '~types'
import { autoBuyValidator } from './auto-buy-validator'
import { autoSellValidator } from './auto-sell-validator'
import { AgainstPositionValidator } from './validators-types'

const againstPositionValidators = {
  [SupportedTriggers.AutoBuy]: autoBuyValidator,
  [SupportedTriggers.AutoSell]: autoSellValidator,
}

export const getAgainstPositionValidator = <
  Trigger extends SupportedTriggers,
  Data extends TriggerData,
>(
  trigger: Trigger,
): AgainstPositionValidator<Data> => {
  return againstPositionValidators[trigger] as AgainstPositionValidator<Data>
}
