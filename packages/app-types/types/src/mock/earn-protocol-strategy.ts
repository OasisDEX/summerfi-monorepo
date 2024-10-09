import { TokenSymbolsList } from '../icons'
import { NetworkNames } from '../networks'
import { Risk } from '../risk'

// this is a mocked type just to gget going
// final will be different

export type EarnProtocolStrategy = {
  id: string
  symbol: TokenSymbolsList
  network: NetworkNames
  apy: string
  tokenBonus: string
  bestFor: string
  risk: Risk
  totalAssets: string
}
