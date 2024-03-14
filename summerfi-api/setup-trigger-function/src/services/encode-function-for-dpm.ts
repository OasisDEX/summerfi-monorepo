import { encodeFunctionData } from 'viem'
import { accountImplementationAbi } from '@summerfi/abis'
import { Address } from '@summerfi/serverless-shared/domain-types'
import { Addresses } from './get-addresses'

export interface EncodeFunctionForDpmParams {
  dpm: Address
  triggerTxData: `0x${string}`
}

export interface TransactionFragment {
  to: `0x${string}`
  data: `0x${string}`
  triggerTxData: `0x${string}`
}

export function encodeFunctionForDpm(
  { dpm, triggerTxData }: EncodeFunctionForDpmParams,
  addresses: Addresses,
): TransactionFragment {
  const dpmData = encodeFunctionData({
    abi: accountImplementationAbi,
    functionName: 'execute',
    args: [addresses.AutomationBot, triggerTxData],
  })

  return {
    to: dpm,
    data: dpmData,
    triggerTxData,
  }
}
