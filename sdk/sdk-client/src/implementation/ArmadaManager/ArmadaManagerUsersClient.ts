import {
  IArmadaPool,
  IArmadaPoolId,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
} from '@summerfi/armada-protocol-common'

import { ITokenAmount, IUser, TransactionInfo, type IAddress } from '@summerfi/sdk-common'
import { IArmadaManagerUsersClient } from '../../interfaces/ArmadaManager/IArmadaManagerUsersClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerUsersClient
 * @description Implementation of the Armada Manager client interface for Users of the Armada
 */
export class ArmadaManagerUsersClient extends IRPCClient implements IArmadaManagerUsersClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerClient.getPool */
  public async getPool(params: { poolId: IArmadaPoolId }): Promise<IArmadaPool> {
    return this.rpcClient.armada.users.getPool.query(params)
  }

  /** @see IArmadaManagerClient.getPoolInfo */
  async getPoolInfo(params: { poolId: IArmadaPoolId }): Promise<IArmadaPoolInfo> {
    return this.rpcClient.armada.users.getPoolInfo.query(params)
  }

  /** @see IArmadaManagerClient.getUserPositions */
  async getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]> {
    return this.rpcClient.armada.users.getUserPositions.query(params)
  }

  /** @see IArmadaManagerClient.getUserPositions */
  async getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<IArmadaPosition> {
    return this.rpcClient.armada.users.getUserPosition.query({
      user: params.user,
      fleetAddress: params.fleetAddress,
    })
  }

  /** @see IArmadaManagerClient.getPosition */
  async getPosition(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition> {
    return this.rpcClient.armada.users.getPosition.query(params)
  }

  /** @see IArmadaManagerClient.getNewDepositTX */
  async getNewDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getDepositTX.query(params)
  }

  /** @see IArmadaManagerClient.getUpdateDepositTX */
  async getUpdateDepositTX(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getUpdateDepositTX.query(params)
  }

  /** @see IArmadaManagerClient.getWithdrawTX */
  async getWithdrawTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getWithdrawTX.query(params)
  }
}
