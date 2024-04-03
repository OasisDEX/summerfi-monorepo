import { PublicClient } from 'viem'
import { IPriceService } from './IPriceService'
import { ITokenService } from './ITokenService'
// import { IContractProvider } from './IContractProvider'

export interface IProtocolPluginContext {
  provider: PublicClient
  tokenService: ITokenService
  priceService: IPriceService
}
