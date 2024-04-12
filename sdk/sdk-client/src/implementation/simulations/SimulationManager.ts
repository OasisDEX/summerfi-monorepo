import { RPCClientType } from '../../rpc/SDKClient'
import { ImportingSimulationManager } from './ImportingSimulationManager'
import { RefinanceSimulationManager } from './RefinanceSimulationManager'

export class SimulationManager {
  public readonly finance: undefined
  public readonly refinance: RefinanceSimulationManager
  public readonly automation: undefined
  public readonly importing: ImportingSimulationManager
  public readonly migration: undefined

  public constructor(params: { rpcClient: RPCClientType }) {
    this.refinance = new RefinanceSimulationManager(params)
    this.importing = new ImportingSimulationManager(params)
  }
}
