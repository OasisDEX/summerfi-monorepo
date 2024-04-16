import { PublicClient } from 'viem'
import { IPriceService } from './IPriceService'
import { ITokenService } from './ITokenService'
import { DeploymentIndex } from '@summerfi/deployment-utils'

export interface IProtocolPluginContext {
  provider: PublicClient
  tokenService: ITokenService
  priceService: IPriceService
  deployments: DeploymentIndex
}
