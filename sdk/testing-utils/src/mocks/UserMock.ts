import { Address, ChainInfo, Wallet } from '@summerfi/sdk-common/common'
import { IUser } from '@summerfi/sdk-common/user'

export class UserMock implements IUser {
  wallet: Wallet
  chainInfo: ChainInfo

  constructor(params: { chainInfo: ChainInfo; walletAddress: Address }) {
    this.chainInfo = params.chainInfo
    this.wallet = Wallet.createFrom({ address: params.walletAddress })
  }
}
