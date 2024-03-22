import { encodeFunctionData } from 'viem'
import { automationBotAbi } from '@summerfi/abis'

export interface AddableTrigger {
  continuous: boolean
  currentId: bigint
  encodedTriggerData: `0x${string}`
  currentTriggerData: `0x${string}`
  triggerType: bigint
}

export interface RemovableTrigger {
  currentId: bigint
  currentData: `0x${string}`
}

export const automationBotHelper = {
  addTriggers(...args: AddableTrigger[]) {
    return encodeFunctionData({
      abi: automationBotAbi,
      functionName: 'addTriggers',
      args: [
        65535,
        args.map((a) => a.continuous),
        args.map((a) => a.currentId),
        args.map((a) => a.encodedTriggerData),
        args.map((a) => a.currentTriggerData),
        args.map((a) => a.triggerType),
      ],
    })
  },
  removeTriggers(removeAllowance: boolean, ...args: RemovableTrigger[]) {
    return encodeFunctionData({
      abi: automationBotAbi,
      functionName: 'removeTriggers',
      args: [args.map((a) => a.currentId), args.map((a) => a.currentData), removeAllowance],
    })
  },
}
