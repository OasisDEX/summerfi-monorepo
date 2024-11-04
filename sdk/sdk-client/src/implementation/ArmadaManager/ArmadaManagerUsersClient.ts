import {
  IArmadaVaultId,
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

  /** @see IArmadaManagerUsersClient.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManagerUsersClient['getVaultsRaw']>[0]) {
    return this.rpcClient.armada.users.getVaultsRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManagerUsersClient['getVaultRaw']>[0]) {
    return this.rpcClient.armada.users.getVaultRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(
    params: Parameters<IArmadaManagerUsersClient['getGlobalRebalancesRaw']>[0],
  ) {
    return this.rpcClient.armada.users.getGlobalRebalancesRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getPoolInfo */
  async getPoolInfo(params: { poolId: IArmadaVaultId }): Promise<IArmadaPoolInfo> {
    return this.rpcClient.armada.users.getPoolInfo.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserPositions */
  async getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]> {
    return this.rpcClient.armada.users.getUserPositions.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserPositions */
  async getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<IArmadaPosition> {
    return this.rpcClient.armada.users.getUserPosition.query({
      user: params.user,
      fleetAddress: params.fleetAddress,
    })
  }

  /** @see IArmadaManagerUsersClient.getPosition */
  async getPosition(params: {
    poolId: IArmadaVaultId
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition> {
    return this.rpcClient.armada.users.getPosition.query(params)
  }

  /** @see IArmadaManagerUsersClient.getNewDepositTX */
  async getNewDepositTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getDepositTX.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUpdateDepositTX */
  async getUpdateDepositTX(params: {
    poolId: IArmadaVaultId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getUpdateDepositTX.query(params)
  }

  /** @see IArmadaManagerUsersClient.getWithdrawTX */
  async getWithdrawTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getWithdrawTX.query(params)
  }
}
