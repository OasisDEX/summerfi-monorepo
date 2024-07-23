import { ISimulationManager } from '../../interfaces/simulations/ISimulationManager'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { ImportingSimulationManager } from './ImportingSimulationManager'
import { RefinanceSimulationManager } from './RefinanceSimulationManager'

/**
 * @name SimulationManager
 * @see ISimulationManager
 */
export class SimulationManager implements ISimulationManager {
  public readonly finance: undefined
  public readonly refinance: RefinanceSimulationManager
  public readonly automation: undefined
  public readonly importing: ImportingSimulationManager
  public readonly migration: undefined
  public readonly earn: undefined

  public constructor(params: { rpcClient: RPCMainClientType }) {
    this.refinance = new RefinanceSimulationManager(params)
    this.importing = new ImportingSimulationManager(params)
  }
}
