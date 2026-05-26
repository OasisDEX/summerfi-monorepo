import { IDcaManagerClient } from '../../interfaces/ArmadaManager/IDcaManagerClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import type { AddressValue, HexData } from '@summerfi/sdk-common'
import { encodePacked, keccak256, type Address as ViemAddress } from 'viem'

const DEFAULT_REBALANCE_AUTHORIZATION_DEADLINE_SECONDS = 315360000 // ~10 years

/**
 * @name DcaManagerClient
 * @description Implementation of the DCA manager client interface
 */
export class DcaManagerClient extends IRPCClient implements IDcaManagerClient {
  private _generateAllowedVaultsRoot(params: {
    fromVault: AddressValue
    toVault: AddressValue
  }): HexData {
    const leaves = [params.fromVault, params.toVault].map((addressValue) =>
      keccak256(encodePacked(['address'], [addressValue as ViemAddress])),
    )
    const [fromLeaf, toLeaf] = leaves
    const [left, right] =
      fromLeaf.toLowerCase() < toLeaf.toLowerCase() ? [fromLeaf, toLeaf] : [toLeaf, fromLeaf]

    return keccak256(encodePacked(['bytes32', 'bytes32'], [left, right])) as HexData
  }

  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  async createStrategyTx(
    params: Parameters<IDcaManagerClient['createStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['createStrategyTx']> {
    return this.rpcClient.armada.dca.createStrategyTx.query(params)
  }

  async editStrategyTx(
    params: Parameters<IDcaManagerClient['editStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['editStrategyTx']> {
    return this.rpcClient.armada.dca.editStrategyTx.query(params)
  }

  async pauseStrategyTx(
    params: Parameters<IDcaManagerClient['pauseStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['pauseStrategyTx']> {
    return this.rpcClient.armada.dca.pauseStrategyTx.query(params)
  }

  async resumeStrategyTx(
    params: Parameters<IDcaManagerClient['resumeStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['resumeStrategyTx']> {
    return this.rpcClient.armada.dca.resumeStrategyTx.query(params)
  }

  async cancelStrategyTx(
    params: Parameters<IDcaManagerClient['cancelStrategyTx']>[0],
  ): ReturnType<IDcaManagerClient['cancelStrategyTx']> {
    return this.rpcClient.armada.dca.cancelStrategyTx.query(params)
  }

  async createAndSaveBuyOrder(
    params: Parameters<IDcaManagerClient['createAndSaveBuyOrder']>[0],
  ): ReturnType<IDcaManagerClient['createAndSaveBuyOrder']> {
    const { signTypedData, ...orderParams } = params

    if (!signTypedData) {
      throw new Error('signTypedData is required to create a DCA buy order.')
    }

    const { admiralsQuarters } = await this.rpcClient.armada.users.getProtocolAddresses.query({
      chainId: params.chainId,
    })
    const rebalanceAuthorizationDeadline =
      params.deadlineUnixTimestamp ??
      Math.floor(Date.now() / 1000) + DEFAULT_REBALANCE_AUTHORIZATION_DEADLINE_SECONDS
    const allowedVaultsRoot = this._generateAllowedVaultsRoot({
      fromVault: params.fromVault,
      toVault: params.toVault,
    })

    const rebalanceAuthorizationSignature = (await signTypedData({
      account: params.userAddress,
      domain: {
        name: 'AdmiralsQuarters',
        version: '1',
        chainId: params.chainId,
        verifyingContract: admiralsQuarters as ViemAddress,
      },
      types: {
        RebalanceAuthorization: [
          { name: 'allowedVaultsRoot', type: 'bytes32' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'RebalanceAuthorization',
      message: {
        allowedVaultsRoot,
        deadline: BigInt(rebalanceAuthorizationDeadline),
      },
    })) as HexData

    return this.rpcClient.armada.dca.createAndSaveBuyOrder.query({
      ...orderParams,
      rebalanceAuthorizationSignature,
    })
  }

  async editBuyOrder(
    params: Parameters<IDcaManagerClient['editBuyOrder']>[0],
  ): ReturnType<IDcaManagerClient['editBuyOrder']> {
    const { signTypedData, bearerToken, ...orderParams } = params

    if (!signTypedData) {
      throw new Error('signTypedData is required to edit a DCA buy order.')
    }

    const { admiralsQuarters } = await this.rpcClient.armada.users.getProtocolAddresses.query({
      chainId: params.chainId,
    })
    const rebalanceAuthorizationDeadline =
      params.deadlineUnixTimestamp ??
      Math.floor(Date.now() / 1000) + DEFAULT_REBALANCE_AUTHORIZATION_DEADLINE_SECONDS
    const allowedVaultsRoot = this._generateAllowedVaultsRoot({
      fromVault: params.fromVault,
      toVault: params.toVault,
    })

    const rebalanceAuthorizationSignature = (await signTypedData({
      account: params.userAddress,
      domain: {
        name: 'AdmiralsQuarters',
        version: '1',
        chainId: params.chainId,
        verifyingContract: admiralsQuarters as ViemAddress,
      },
      types: {
        RebalanceAuthorization: [
          { name: 'allowedVaultsRoot', type: 'bytes32' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'RebalanceAuthorization',
      message: {
        allowedVaultsRoot,
        deadline: BigInt(rebalanceAuthorizationDeadline),
      },
    })) as HexData

    return this.rpcClient.armada.dca.editBuyOrder.mutate({
      ...orderParams,
      rebalanceAuthorizationSignature,
      bearerToken,
    })
  }

  async getStrategies(
    params: Parameters<IDcaManagerClient['getStrategies']>[0],
  ): ReturnType<IDcaManagerClient['getStrategies']> {
    return this.rpcClient.armada.dca.getStrategies.query(params)
  }

  async getStrategy(
    params: Parameters<IDcaManagerClient['getStrategy']>[0],
  ): ReturnType<IDcaManagerClient['getStrategy']> {
    return this.rpcClient.armada.dca.getStrategy.query(params)
  }

  async getExecutions(
    params: Parameters<IDcaManagerClient['getExecutions']>[0],
  ): ReturnType<IDcaManagerClient['getExecutions']> {
    return this.rpcClient.armada.dca.getExecutions.query(params)
  }

  async getExecution(
    params: Parameters<IDcaManagerClient['getExecution']>[0],
  ): ReturnType<IDcaManagerClient['getExecution']> {
    return this.rpcClient.armada.dca.getExecution.query(params)
  }

  async cancelBuyOrder(
    params: Parameters<IDcaManagerClient['cancelBuyOrder']>[0],
  ): ReturnType<IDcaManagerClient['cancelBuyOrder']> {
    return this.rpcClient.armada.dca.cancelBuyOrder.mutate(params)
  }

  async pauseBuyOrder(
    params: Parameters<IDcaManagerClient['pauseBuyOrder']>[0],
  ): ReturnType<IDcaManagerClient['pauseBuyOrder']> {
    return this.rpcClient.armada.dca.pauseBuyOrder.mutate(params)
  }

  async resumeBuyOrder(
    params: Parameters<IDcaManagerClient['resumeBuyOrder']>[0],
  ): ReturnType<IDcaManagerClient['resumeBuyOrder']> {
    return this.rpcClient.armada.dca.resumeBuyOrder.mutate(params)
  }
}
