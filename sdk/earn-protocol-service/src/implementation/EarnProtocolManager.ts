import { IConfigurationProvider } from '@summerfi/configuration-provider'
import type { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

import IFleetCommanderABIJSON from '../../../../earn-protocol/abis/IFleetCommander.sol/IFleetCommander.json'
import { Abi, encodeFunctionData } from 'viem'

/**
 * @name EarnProtocolManager
 * @description This class is the implementation of the IEarnProtocolManager interface. Takes care of choosing the best provider for a price consultation
 */
export class EarnProtocolManager implements IEarnProtocolManager {
  private _configProvider: IConfigurationProvider
  private IFleetCommanderABI: Abi

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider

    this.IFleetCommanderABI = IFleetCommanderABIJSON.abi as unknown as Abi
  }

  /** FUNCTIONS */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deposit(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    // TODO: validate that the given token is actually the token for this Fleet
    const calldata = encodeFunctionData({
      abi: this.IFleetCommanderABI,
      functionName: 'deposit',
      args: [params.amount.toBaseUnit(), params.user.wallet.address.value],
    })

    return [
      {
        transaction: {
          target: params.fleetAddress,
          calldata: calldata,
          value: '0',
        },
        description:
          'Deposit ' +
          params.amount.toString() +
          ' to Fleet at address: ' +
          params.fleetAddress.value,
      },
    ]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async withdraw(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    // TODO: validate that the given token is actually the token for this Fleet
    const calldata = encodeFunctionData({
      abi: this.IFleetCommanderABI,
      functionName: 'withdraw',
      args: [
        params.amount.toBaseUnit(),
        params.user.wallet.address.value,
        params.user.wallet.address.value,
      ],
    })

    return [
      {
        transaction: {
          target: params.fleetAddress,
          calldata: calldata,
          value: '0',
        },
        description:
          'Deposit ' +
          params.amount.toString() +
          ' to Fleet at address: ' +
          params.fleetAddress.value,
      },
    ]
  }
}