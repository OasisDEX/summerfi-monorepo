import type { IArmadaManagerClaims } from './IArmadaManagerClaims'
import type { IArmadaManagerGovernance } from './IArmadaManagerGovernance'
import type { IArmadaManagerMigrations } from './IArmadaManagerMigrations'
import type { IArmadaManagerBridge } from './IArmadaManagerBridge'
import type { IArmadaManagerVaults } from './IArmadaManagerVaults'
import type { IArmadaManagerUtils } from './IArmadaManagerUtils'
/**
 * @name IArmadaManager
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
import type { IArmadaManagerMerklRewards } from './IArmadaManagerMerklRewards'

export interface IArmadaManager {
  claims: IArmadaManagerClaims
  governance: IArmadaManagerGovernance
  migrations: IArmadaManagerMigrations
  bridge: IArmadaManagerBridge
  vaults: IArmadaManagerVaults
  utils: IArmadaManagerUtils
  merklRewards: IArmadaManagerMerklRewards
}
