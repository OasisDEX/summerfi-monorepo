import { AddressValue, HexData } from '@summerfi/sdk-common'

export type ActionDefinition = { name: string; hash: HexData; optional: boolean }
export type StrategyDefinition = ActionDefinition[]
export type StrategyDefinitions = StrategyDefinition[]

export type OperationDefinition = { actions: HexData[]; optional: boolean[]; name: string }
export type OperationDefinitions = OperationDefinition[]

export type Transaction = {
  to: AddressValue
  value: string
  data: HexData
}
export type Transactions = Transaction[]
