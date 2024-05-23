import { HexData } from '@summerfi/sdk-common'

export type ActionDefinition = { name: string; hash: HexData }
export type StrategyDefinition = ActionDefinition[]
export type StrategyDefinitions = StrategyDefinition[]
