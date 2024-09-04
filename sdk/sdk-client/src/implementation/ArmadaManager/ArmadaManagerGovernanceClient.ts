import { IArmadaPoolId } from '@summerfi/armada-protocol-common'
import { ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
import { IArmadaManagerGovernanceClient } from '../../interfaces/ArmadaManager/IArmadaManagerGovernanceClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerGovernanceClient
 * @description Implementation of the Armada Manager Keepers client interface for Users of the Armada
 */
export class ArmadaManagerGovernanceClient
  extends IRPCClient
  implements IArmadaManagerGovernanceClient
{
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerGovernanceClient.setFleetDepositCap */
  async setFleetDepositCap(params: {
    poolId: IArmadaPoolId
    cap: ITokenAmount
  }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setFleetDepositCap.query(params)
  }

  /** @see IArmadaManagerGovernanceClient.setTipJar */
  async setTipJar(params: { poolId: IArmadaPoolId }): Promise<TransactionInfo> {
    return this.rpcClient.armada.governance.setTipJar.query(params)
  }
}
