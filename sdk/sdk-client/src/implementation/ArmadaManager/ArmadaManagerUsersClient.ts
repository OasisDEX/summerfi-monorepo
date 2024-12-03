import { IArmadaVaultInfo, IArmadaPosition } from '@summerfi/armada-protocol-common'

import { ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
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

  /** @see IArmadaManagerUsersClient.getUsersActivityRaw */
  async getUsersActivityRaw(
    params: Parameters<IArmadaManagerUsersClient['getUsersActivityRaw']>[0],
  ) {
    return this.rpcClient.armada.users.getUsersActivityRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManagerUsersClient['getUserActivityRaw']>[0]) {
    return this.rpcClient.armada.users.getUserActivityRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getPoolInfo */
  async getPoolInfo(
    params: Parameters<IArmadaManagerUsersClient['getPoolInfo']>[0],
  ): Promise<IArmadaVaultInfo> {
    return this.rpcClient.armada.users.getPoolInfo.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserPositions */
  async getUserPositions(
    params: Parameters<IArmadaManagerUsersClient['getUserPositions']>[0],
  ): Promise<IArmadaPosition[]> {
    return this.rpcClient.armada.users.getUserPositions.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserPositions */
  async getUserPosition(
    params: Parameters<IArmadaManagerUsersClient['getUserPosition']>[0],
  ): Promise<IArmadaPosition> {
    return this.rpcClient.armada.users.getUserPosition.query({
      user: params.user,
      fleetAddress: params.fleetAddress,
    })
  }

  /** @see IArmadaManagerUsersClient.getPosition */
  async getPosition(
    params: Parameters<IArmadaManagerUsersClient['getPosition']>[0],
  ): Promise<IArmadaPosition> {
    return this.rpcClient.armada.users.getPosition.query(params)
  }

  /** @see IArmadaManagerUsersClient.getNewDepositTX */
  async getNewDepositTX(
    params: Parameters<IArmadaManagerUsersClient['getNewDepositTX']>[0],
  ): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getDepositTX.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUpdateDepositTX */
  async getUpdateDepositTX(
    params: Parameters<IArmadaManagerUsersClient['getUpdateDepositTX']>[0],
  ): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getUpdateDepositTX.query(params)
  }

  /** @see IArmadaManagerUsersClient.getWithdrawTX */
  async getWithdrawTX(
    params: Parameters<IArmadaManagerUsersClient['getWithdrawTX']>[0],
  ): Promise<TransactionInfo[]> {
    return this.rpcClient.armada.users.getWithdrawTX.query(params)
  }

  async getStakedBalance(
    params: Parameters<IArmadaManagerUsersClient['getStakedBalance']>[0],
  ): Promise<ITokenAmount> {
    return this.rpcClient.armada.users.getStakedBalance.query(params)
  }

  async getFleetBalance(
    params: Parameters<IArmadaManagerUsersClient['getFleetBalance']>[0],
  ): Promise<ITokenAmount> {
    return this.rpcClient.armada.users.getFleetBalance.query(params)
  }

  getTotalBalance(
    params: Parameters<IArmadaManagerUsersClient['getTotalBalance']>[0],
  ): Promise<ITokenAmount> {
    return this.rpcClient.armada.users.getTotalBalance.query(params)
  }
}
