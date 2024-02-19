import { Trigger } from '@summerfi/serverless-contracts/get-triggers-response'

export const getCurrentTrigger = (...args: (Trigger | undefined)[]): Trigger | undefined => {
  return args
    .filter((arg): arg is Trigger => arg !== undefined)
    .map((arg) => {
      return {
        triggerType: arg.triggerType,
        triggerId: arg.triggerId,
        triggerData: arg.triggerData,
      }
    })[0]
}
