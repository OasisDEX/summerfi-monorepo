/**
 * Generic type for the simulation steps definitions. Any enum for the steps types
 * must follow this structure:
 *
 *   ```ts
 *      export enum RefinanceSteps {
 *       Step1 = 'Step1',
 *       Step2 = 'Step2',
 *       Step3 = 'Step3',
 *      }
 *  ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SimulationStepsEnum = {
  [id: string]: string
}
