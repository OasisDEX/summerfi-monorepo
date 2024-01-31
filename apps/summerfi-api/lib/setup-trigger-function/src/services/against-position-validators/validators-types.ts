import { PositionLike, Price, SupportedActions, TriggerData, ValidationResults } from '~types'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'

export type AgainstPositionValidatorParams<Trigger extends TriggerData> = {
  position: PositionLike
  executionPrice: Price
  triggerData: Trigger
  triggers: GetTriggersResponse
  action: SupportedActions
}

export type AgainstPositionValidator<Trigger extends TriggerData> = (
  params: AgainstPositionValidatorParams<Trigger>,
) => ValidationResults
