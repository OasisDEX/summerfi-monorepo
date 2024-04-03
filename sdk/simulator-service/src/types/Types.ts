import { AddressValue, Position, TokenAmount } from '@summerfi/sdk-common/common'
import { steps } from '@summerfi/sdk-common/simulation'

export type StepName = string

export type BalancesRecord = Record<AddressValue, TokenAmount>
export type PositionsRecord = Record<string, Position>
export type StepsRecord = Record<StepName, steps.Steps>
