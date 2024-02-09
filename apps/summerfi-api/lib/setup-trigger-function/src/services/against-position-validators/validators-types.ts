import { PositionLike, Price, SupportedActions, TriggerData, ValidationResults } from '~types'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { ChainId } from '@summerfi/serverless-shared'

export type AgainstPositionValidatorParams<Trigger extends TriggerData> = {
  position: PositionLike
  executionPrice: Price
  triggerData: Trigger
  triggers: GetTriggersResponse
  action: SupportedActions
  chainId: ChainId
}

export type AgainstPositionValidator<Trigger extends TriggerData> = (
  params: AgainstPositionValidatorParams<Trigger>,
) => ValidationResults
