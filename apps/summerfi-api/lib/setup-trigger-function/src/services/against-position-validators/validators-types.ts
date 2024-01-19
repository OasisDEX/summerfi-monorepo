import { PositionLike, Price, TriggerData, ValidationResults } from '~types'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'

export type AgainstPositionValidatorParams<Trigger extends TriggerData> = {
  position: PositionLike
  executionPrice: Price
  body: Trigger
  triggers: GetTriggersResponse
}

export type AgainstPositionValidator<Trigger extends TriggerData> = (
  params: AgainstPositionValidatorParams<Trigger>,
) => ValidationResults
