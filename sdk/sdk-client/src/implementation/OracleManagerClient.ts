import { IRPCClient } from '../interfaces/IRPCClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'
import type { IOracleManagerClient } from '../interfaces/IOracleManagerClient'

/**
 * @name OracleManagerClient
 * @description Implementation of the IOracleManagerClient interface for the SDK Client
 */
export class OracleManagerClient extends IRPCClient implements IOracleManagerClient {
  public constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IOracleManagerClient.getSpotPrice */
  public async getSpotPrice(
    params: Parameters<IOracleManagerClient['getSpotPrice']>[0],
  ): ReturnType<IOracleManagerClient['getSpotPrice']> {
    return this.rpcClient.oracle.getSpotPrice.query(params)
  }

  /** @see IOracleManagerClient.getSpotPrices */
  public async getSpotPrices(
    params: Parameters<IOracleManagerClient['getSpotPrices']>[0],
  ): ReturnType<IOracleManagerClient['getSpotPrices']> {
    return this.rpcClient.oracle.getSpotPrices.query(params)
  }
}
