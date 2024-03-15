import { Trigger } from '@summerfi/triggers-shared/contracts'

export const getCurrentTrigger = (...args: (Trigger | undefined)[]): Trigger | undefined => {
  return args
    .filter((arg): arg is Trigger => arg !== undefined)
    .map((arg) => {
      return {
        triggerType: arg.triggerType,
        triggerId: arg.triggerId,
        triggerData: arg.triggerData,
        decodedParams: arg.decodedParams,
        dynamicParams: arg.dynamicParams,
      }
    })[0]
}
