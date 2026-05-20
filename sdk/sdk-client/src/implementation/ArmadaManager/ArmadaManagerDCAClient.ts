import { IArmadaManagerDCAClient } from '../../interfaces/ArmadaManager/IArmadaManagerDCAClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import type { AddressValue, HexData } from '@summerfi/sdk-common'
import { encodePacked, keccak256, type Address as ViemAddress } from 'viem'

const DEFAULT_REBALANCE_AUTHORIZATION_DEADLINE_SECONDS = 315360000 // ~10 years

/**
 * @name ArmadaManagerDCAClient
 * @description Implementation of the Armada Manager DCA client interface
 */
export class ArmadaManagerDCAClient extends IRPCClient implements IArmadaManagerDCAClient {
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
    params: Parameters<IArmadaManagerDCAClient['createStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCAClient['createStrategyTx']> {
    return this.rpcClient.armada.dca.createStrategyTx.query(params)
  }

  async editStrategyTx(
    params: Parameters<IArmadaManagerDCAClient['editStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCAClient['editStrategyTx']> {
    return this.rpcClient.armada.dca.editStrategyTx.query(params)
  }

  async pauseStrategyTx(
    params: Parameters<IArmadaManagerDCAClient['pauseStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCAClient['pauseStrategyTx']> {
    return this.rpcClient.armada.dca.pauseStrategyTx.query(params)
  }

  async resumeStrategyTx(
    params: Parameters<IArmadaManagerDCAClient['resumeStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCAClient['resumeStrategyTx']> {
    return this.rpcClient.armada.dca.resumeStrategyTx.query(params)
  }

  async cancelStrategyTx(
    params: Parameters<IArmadaManagerDCAClient['cancelStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCAClient['cancelStrategyTx']> {
    return this.rpcClient.armada.dca.cancelStrategyTx.query(params)
  }

  async executeDCATx(
    params: Parameters<IArmadaManagerDCAClient['executeDCATx']>[0],
  ): ReturnType<IArmadaManagerDCAClient['executeDCATx']> {
    return this.rpcClient.armada.dca.executeDCATx.query(params)
  }

  async createAndSaveBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['createAndSaveBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['createAndSaveBuyOrder']> {
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

  async getBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['getBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['getBuyOrder']> {
    return this.rpcClient.armada.dca.getBuyOrder.query(params)
  }

  async getBuyOrders(
    params: Parameters<IArmadaManagerDCAClient['getBuyOrders']>[0],
  ): ReturnType<IArmadaManagerDCAClient['getBuyOrders']> {
    return this.rpcClient.armada.dca.getBuyOrders.query(params)
  }

  async cancelBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['cancelBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['cancelBuyOrder']> {
    return this.rpcClient.armada.dca.cancelBuyOrder.mutate(params)
  }

  async pauseBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['pauseBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['pauseBuyOrder']> {
    return this.rpcClient.armada.dca.pauseBuyOrder.mutate(params)
  }

  async resumeBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['resumeBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['resumeBuyOrder']> {
    return this.rpcClient.armada.dca.resumeBuyOrder.mutate(params)
  }
}
