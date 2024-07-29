import { ValueReference } from '../interfaces/ValueReference'
import { Where } from '../interfaces/helperTypes'
import { Paths } from './Paths'
import { SimulationStepsEnum } from './SimulationStepsEnum'
import { Step } from './Step'
import { StepsAdded } from './StepsAdded'

/**
 * Helper type to extract the value of a referenced step output
 */
export type GetReferencedValue<
  StepsEnum extends SimulationStepsEnum,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
  StepsStore extends StepsAdded<StepsEnum, Steps>,
> = <P extends Paths<StepsEnum, Steps, StepsStore>>(
  path: P,
) => ValueReference<
  Pick<Where<StepsStore[number], { name: P[0] }>['step']['outputs'], P[1]>[keyof Pick<
    Where<StepsStore[number], { name: P[1] }>['step']['outputs'],
    P[1]
  >]
>
