import {
  AddressValue,
  ITokenAmount,
  ILendingPosition,
  steps,
  SimulatedSwapData,
} from '@summerfi/sdk-common'

export type StepName = string

export type BalancesRecord = Record<AddressValue, ITokenAmount>
export type PositionsRecord = Record<string, ILendingPosition>
export type StepsArray = steps.Steps[]
export type SwapsArray = SimulatedSwapData[]
