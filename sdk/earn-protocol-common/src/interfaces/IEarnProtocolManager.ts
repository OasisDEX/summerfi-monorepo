import type { IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @name IEarnProtocolManager
 * @description This is the highest level interface that will choose and call appropriate provider for a price consultation
 */
export interface IEarnProtocolManager {
  deposit(params: {
    chainInfo: IChainInfo
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>
  withdraw(params: {
    chainInfo: IChainInfo
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>
}
