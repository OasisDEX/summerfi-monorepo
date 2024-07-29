import { AddressValue, ITokenAmount } from '@summerfi/sdk-common/common'
import { ILendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { steps } from '@summerfi/sdk-common/simulation'
import { SimulatedSwapData } from '@summerfi/sdk-common/swap'

export type StepName = string

export type BalancesRecord = Record<AddressValue, ITokenAmount>
export type PositionsRecord = Record<string, ILendingPosition>
export type StepsArray = steps.Steps[]
export type SwapsArray = SimulatedSwapData[]
