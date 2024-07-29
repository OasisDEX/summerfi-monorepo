import { SimulationStepsEnum } from './SimulationStepsEnum'

/**
 * Type for the steps added to the simulation, in generic form
 */
export interface Step<E extends SimulationStepsEnum[keyof SimulationStepsEnum], I, O = undefined> {
  /** Type fo the stem from the simulation steps enumeration */
  type: E
  /** Free form name of the step */
  name: string
  /** The inputs that the step can accept in object format */
  inputs: I
  /** The outputs that the step can produce in object format */
  outputs: O
  /** If the step should be skipped or not*/
  skip?: boolean
}
