import type { IRWAManager } from '@summerfi/armada-protocol-common'
import { RwaVaultInfo } from '@summerfi/sdk-common'
import type { IRwaSubgraphManager } from '@summerfi/subgraph-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { mapSubgraphVaultToVaultInfoParams } from './extensions/mapSubgraphVaultToVaultInfoParams'

/**
 * @name RWAManager
 * @implements IRWAManager
 * @description Mirrors ArmadaManagerVaults.getVaultInfoListPerChain but sources data
 *              from the RWA subgraph and returns RwaVaultInfo instances.
 *              APY / rewards / Merkl emissions are not yet wired up — this is a
 *              first-cut implementation intended to be extended later.
 */
export class RWAManager extends ArmadaManagerShared implements IRWAManager {
  private readonly _rwaSubgraphManager: IRwaSubgraphManager
  private readonly _tokensManager: ITokensManager

  constructor(params: {
    clientId?: string
    rwaSubgraphManager: IRwaSubgraphManager
    tokensManager: ITokensManager
  }) {
    super({ clientId: params.clientId })
    this._rwaSubgraphManager = params.rwaSubgraphManager
    this._tokensManager = params.tokensManager
  }

  async getVaultInfoListPerChain(
    params: Parameters<IRWAManager['getVaultInfoListPerChain']>[0],
  ): ReturnType<IRWAManager['getVaultInfoListPerChain']> {
    const { chainId, institutionId } = params
    const queryResult = await this._rwaSubgraphManager.getVaults({
      chainId,
      institutionId,
    })

    if (!queryResult || !queryResult.vaults) {
      return { list: [] }
    }

    const list = queryResult.vaults.map((rawVault) =>
      RwaVaultInfo.createFrom(
        mapSubgraphVaultToVaultInfoParams({
          chainId,
          rawVault,
          tokensManager: this._tokensManager,
          apysForVault: undefined,
          rewardsApysForVault: undefined,
          merklRewardsForVault: undefined,
        }),
      ),
    )

    return { list }
  }
}
