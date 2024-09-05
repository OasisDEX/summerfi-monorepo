import {
  IArmadaPool,
  IArmadaPoolId,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
} from '@summerfi/armada-protocol-common'

import { ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { IArmadaManagerClient } from '../interfaces/IArmadaManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @name ArmadaManagerClient
 * @description Implementation of the IChainsManager interface for the SDK Client
 */
export class ArmadaManagerClient extends IRPCClient implements IArmadaManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerClient.getPool */
  async getPool(params: { poolId: IArmadaPoolId }): Promise<IArmadaPool> {
    return this.rpcClient.armada.getPool.query(params)
  }

  /** @see IArmadaManagerClient.getPoolInfo */
  async getPoolInfo(params: { poolId: IArmadaPoolId }): Promise<IArmadaPoolInfo> {
    return this.rpcClient.armada.getPoolInfo.query(params)
  }

  /** @see IArmadaManagerClient.getUserPositions */
  async getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]> {
    return this.rpcClient.armada.getUserPositions.query(params)
  }

  /** @see IArmadaManagerClient.getPosition */
  async getPosition(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition> {
    return this.rpcClient.armada.getPosition.query(params)
  }

  /** @see IArmadaManagerClient.getNewDepositTX */
  async getNewDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.getNewDepositTX.query(params)
  }

  /** @see IArmadaManagerClient.getUpdateDepositTX */
  async getUpdateDepositTX(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.getUpdateDepositTX.query(params)
  }

  /** @see IArmadaManagerClient.getWithdrawTX */
  async getWithdrawTX(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.getWithdrawTX.query(params)
  }
}
