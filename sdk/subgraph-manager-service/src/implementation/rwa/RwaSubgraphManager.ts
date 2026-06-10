import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  type createRwaGraphQLClient,
  type IRwaSubgraphManager,
  SubgraphTypes,
} from '@summerfi/subgraph-manager-common'
import { ArmadaSubgraphManager } from '../armada/ArmadaSubgraphManager'
import type { ChainId } from 'node_modules/@summerfi/sdk-common/src/common/types/ChainId'

/**
 * @name RwaSubgraphManager
 * @implements IRwaSubgraphManager
 */
export class RwaSubgraphManager extends ArmadaSubgraphManager implements IRwaSubgraphManager {
  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    super(params)
  }

  getRwaClient(chainId: ChainId): ReturnType<typeof createRwaGraphQLClient> {
    if (this.config.subgraphType !== SubgraphTypes.rwa) {
      throw new Error(
        `This method is only available using 'rwa' subgraph type. Current subgraph type: ${this.config.subgraphType}`,
      )
    }
    return this.getClient(SubgraphTypes.rwa, chainId)
  }

  getVaults({ chainId, clientId }: Parameters<IRwaSubgraphManager['getVaults']>[0]) {
    return this.getRwaClient(chainId).GetVaults({
      institutionId: this.getInstitutionId(clientId),
    })
  }

  getVault({ chainId, vaultId }: Parameters<IRwaSubgraphManager['getVault']>[0]) {
    return this.getRwaClient(chainId).GetVault({ id: vaultId })
  }

  getReceipts({ chainId, account, vault }: Parameters<IRwaSubgraphManager['getReceipts']>[0]) {
    return this.getRwaClient(chainId).GetRwaReceipts({ account, vault })
  }

  getVaultRounds({ chainId, vault }: Parameters<IRwaSubgraphManager['getVaultRounds']>[0]) {
    return this.getRwaClient(chainId).GetRwaVaultRounds({ vault })
  }

  async getInstitutionById({
    chainId,
    id,
  }: Parameters<IRwaSubgraphManager['getInstitutionById']>[0]) {
    const institutionId = this.getInstitutionId(id)
    return await this.getRwaClient(chainId).GetRwaInstitutionById({
      id: institutionId,
    })
  }
}
