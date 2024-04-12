import { PublicClient } from 'viem'
import { IPriceService } from './IPriceService'
import { ITokenService } from './ITokenService'
import { Deployment } from '@summerfi/deployment-utils'

export interface IProtocolPluginContext {
  provider: PublicClient
  tokenService: ITokenService
  priceService: IPriceService
  deployment: Deployment
}
