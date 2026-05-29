import { IRPCClient } from '../interfaces/IRPCClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'
import type { IAllowanceManagerClient } from '../interfaces/IAllowanceManagerClient'

/**
 * @name AllowanceManagerClient
 * @implements IAllowanceManagerClient
 * @description Thin client over the server allowance manager Permit2 procedures
 */
export class AllowanceManagerClient extends IRPCClient implements IAllowanceManagerClient {
  public constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IAllowanceManagerClient.getApproval */
  getApproval: IAllowanceManagerClient['getApproval'] = (params) =>
    this.rpcClient.allowance.getApproval.query(params)

  /** @see IAllowanceManagerClient.isPermit2AuthorizationNeeded */
  isPermit2AuthorizationNeeded: IAllowanceManagerClient['isPermit2AuthorizationNeeded'] = (
    params,
  ) => this.rpcClient.allowance.isPermit2AuthorizationNeeded.query(params)

  /** @see IAllowanceManagerClient.getPermit2AuthorizationTx */
  getPermit2AuthorizationTx: IAllowanceManagerClient['getPermit2AuthorizationTx'] = (params) =>
    this.rpcClient.allowance.getPermit2AuthorizationTx.query(params)

  /** @see IAllowanceManagerClient.getPermit2RevokeTx */
  getPermit2RevokeTx: IAllowanceManagerClient['getPermit2RevokeTx'] = (params) =>
    this.rpcClient.allowance.getPermit2RevokeTx.query(params)

  /** @see IAllowanceManagerClient.getPermit2Data */
  getPermit2Data: IAllowanceManagerClient['getPermit2Data'] = (params) =>
    this.rpcClient.allowance.getPermit2Data.query(params)
}
