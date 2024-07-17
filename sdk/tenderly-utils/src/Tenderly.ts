import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { IChainInfo } from '@summerfi/sdk-common'
import { TenderlyFork } from './TenderlyFork'

/**
 * Class that offers utility functions for interacting with Tenderly, including sending transactions
 *
 * It makes use of different utilities across the repo to offer a unified experience
 */
export class Tenderly {
  public readonly configurationProvider: IConfigurationProvider
  public readonly tenderlyUser: string
  public readonly tenderlyProject: string
  public readonly tenderlyApiUrl: string
  public readonly tenderlyAccessKey: string

  /** CONSTRUCTOR */
  constructor(params: { configurationProvider: IConfigurationProvider }) {
    this.configurationProvider = params.configurationProvider

    const tenderlyUser = this.configurationProvider.getConfigurationItem({ name: 'TENDERLY_USER' })
    if (!tenderlyUser) {
      throw new Error('TENDERLY_USER configuration item is required')
    }

    const tenderlyProject = this.configurationProvider.getConfigurationItem({
      name: 'TENDERLY_PROJECT',
    })
    if (!tenderlyProject) {
      throw new Error('TENDERLY_PROJECT configuration item is required')
    }

    const tenderlyAccessKey = this.configurationProvider.getConfigurationItem({
      name: 'TENDERLY_ACCESS_KEY',
    })
    if (!tenderlyAccessKey) {
      throw new Error('TENDERLY_ACCESS_KEY configuration item is required')
    }

    this.tenderlyUser = tenderlyUser
    this.tenderlyProject = tenderlyProject
    this.tenderlyAccessKey = tenderlyAccessKey
    this.tenderlyApiUrl = `https://api.tenderly.co/api/v1/account/${this.tenderlyUser}/project/${this.tenderlyProject}/fork`
  }

  /**
   * @name createFork
   * @description Creates a new Tenderly fork
   */
  async createFork(params: { chainInfo: IChainInfo; atBlock: number }): Promise<TenderlyFork> {
    return TenderlyFork.create({
      tenderlyAccessKey: this.tenderlyAccessKey,
      tenderlyApiUrl: this.tenderlyApiUrl,
      chainInfo: params.chainInfo,
      atBlock: params.atBlock,
    })
  }
}
