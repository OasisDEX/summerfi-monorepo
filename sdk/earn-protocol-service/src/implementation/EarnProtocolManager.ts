import type { IEarnProtocolManager } from '@summerfi/earn-protocol-common'

/**
 * @name EarnProtocolManager
 * @description This class is the implementation of the IEarnProtocolManager interface. Takes care of choosing the best provider for a price consultation
 */
export class EarnProtocolManager implements IEarnProtocolManager {
  /** CONSTRUCTOR */

  constructor(params) {
    super(params)
  }
}
