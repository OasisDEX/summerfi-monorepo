import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { type IRwaSubgraphManager, SubgraphTypes } from '@summerfi/subgraph-manager-common'
import { ArmadaSubgraphManager } from '../armada/ArmadaSubgraphManager'

/**
 * @name RwaSubgraphManager
 * @implements IRwaSubgraphManager
 */
export class RwaSubgraphManager extends ArmadaSubgraphManager implements IRwaSubgraphManager {
  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    super(params)
  }

  getVaults({ chainId, clientId }: Parameters<IRwaSubgraphManager['getVaults']>[0]) {
    return this.getClient(SubgraphTypes.rwa, chainId).GetVaults({
      institutionId: this.getInstitutionId(clientId),
    })
  }

  getVault({ chainId, vaultId }: Parameters<IRwaSubgraphManager['getVault']>[0]) {
    return this.getClient(SubgraphTypes.rwa, chainId).GetVault({ id: vaultId })
  }

  getReceipts({ chainId, account, vault }: Parameters<IRwaSubgraphManager['getReceipts']>[0]) {
    return this.getClient(SubgraphTypes.rwa, chainId).GetRwaReceipts({ account, vault })
  }

  getInstitutionById({ chainId, id }: Parameters<IRwaSubgraphManager['getInstitutionById']>[0]) {
    return this.getClient(SubgraphTypes.rwa, chainId).GetRwaInstitutionById({
      id: this.getInstitutionId(id),
    })
  }
}
