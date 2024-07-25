import { SerializationService } from '../../services/SerializationService'
import { SimulationType } from '../enums'
import { IEarnProtocolSimulation } from '../interfaces/IEarnProtocolSimulation'
import { Simulation } from './Simulation'

/**
 * @name EarnProtocolSimulation
 * @see IEarnProtocolSimulation
 */
export class EarnProtocolSimulation extends Simulation implements IEarnProtocolSimulation {
  readonly type: SimulationType.EarnProtocol

  /** Factory method */
  static createFrom(params: IEarnProtocolSimulation): EarnProtocolSimulation {
    return new EarnProtocolSimulation(params)
  }

  /** Sealed constructor */
  private constructor(params: IEarnProtocolSimulation) {
    super(params)

    this.type = params.type
  }
}

SerializationService.registerClass(EarnProtocolSimulation)
