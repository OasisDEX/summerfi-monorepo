import { IConfigurationProvider } from '@summerfi/configuration-provider'
import type { IAllowanceManager } from '@summerfi/allowance-common'
import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

import IFleetCommanderABIJSON from '../../../../earn-protocol/abis/IFleetCommander.sol/IFleetCommander.json'
import { Abi, encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-provider'

/**
 * @name AllowanceManager
 * @description This class is the implementation of the IEarnProtocolManager interface. Takes care of choosing the best provider for a price consultation
 */
export class AllowanceManager implements IAllowanceManager {
  private _configProvider: IConfigurationProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private IFleetCommanderABI: Abi

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    blockchainClientProvider: IBlockchainClientProvider
  }) {
    this._configProvider = params.configProvider
    this._blockchainClientProvider = params.blockchainClientProvider

    this.IFleetCommanderABI = IFleetCommanderABIJSON.abi as unknown as Abi
  }

  /** FUNCTIONS */
  async getAllowance(params: {
    chainInfo: IChainInfo
    tokenAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const calldata = encodeFunctionData({
      abi: this.IFleetCommanderABI,
      functionName: 'deposit',
      args: [params.amount.toBaseUnit(), params.user.wallet.address.value],
    })

    // TODO: erc20 wrapper

    return [
      {
        transaction: {
          target: params.tokenAddress,
          calldata: calldata,
          value: '0',
        },
        description:
          'Deposit ' +
          params.amount.toString() +
          ' to Fleet at address: ' +
          params.tokenAddress.value,
      },
    ]
  }
}
