import { RefinanceSimulationManager } from './RefinanceSimulationManager'

export class SimulationManager {
  public readonly finance: undefined
  public readonly refinance: RefinanceSimulationManager
  public readonly automation: undefined
  public readonly importing: undefined
  public readonly migration: undefined

  public constructor() {
    this.refinance = new RefinanceSimulationManager()
  }
}
