export type { IArmadaSubgraphManager } from './interfaces/IArmadaSubgraphManager'
export type { IDcaSubgraphManager } from './interfaces/IDcaSubgraphManager'
export type { IRwaSubgraphManager } from './interfaces/IRwaSubgraphManager'
export { createProtocolGraphQLClient } from './utils/createProtocolGraphQLClient'
export { createInstitutionsGraphQLClient } from './utils/createInstitutionsGraphQLClient'
export { createDcaGraphQLClient } from './utils/createDcaGraphQLClient'
export { createRwaGraphQLClient } from './utils/createRwaGraphQLClient'
export type {
  GetUserPositionQuery,
  GetUserPositionsQuery,
  GetVaultQuery,
  GetVaultsQuery,
  GetGlobalRebalancesQuery,
  GetUsersActivityQuery,
  GetUserActivityQuery,
  GetPositionQuery,
  GetPositionHistoryQuery,
  GetDepositsQuery,
  GetWithdrawalsQuery,
  Position_Filter,
  Position,
  Deposit,
  Withdraw,
  Vault,
  Rebalance,
} from './generated/protocol/client'
export {
  GetTopDepositorsDocument,
  GetLatestActivityDocument,
  GetRebalancesDocument,
  Network,
} from './generated/protocol/client'
export type {
  GetVaultQuery as GetVaultQueryInstitutions,
  GetVaultsQuery as GetVaultsQueryInstitutions,
  GetInstitutionsQuery,
  GetInstitutionByIdQuery,
  Institution,
  GetRolesQuery,
} from './generated/institutions/client'
export {
  GetInstitutionsDocument,
  GetInstitutionByIdDocument,
  GetRolesDocument,
} from './generated/institutions/client'
export type { GetStrategiesQuery, GetExecutionsQuery } from './generated/dca/client'
export type {
  GetVaultsQuery as GetVaultsQueryRwa,
  GetVaultQuery as GetVaultQueryRwa,
  GetRwaReceiptsQuery,
  GetRwaInstitutionByIdQuery,
} from './generated/rwa/client'
export {
  GetVaultsDocument as GetVaultsDocumentRwa,
  GetVaultDocument as GetVaultDocumentRwa,
  GetRwaReceiptsDocument,
  GetRwaInstitutionByIdDocument,
} from './generated/rwa/client'
export { SubgraphTypes, type SubgraphType } from './types/SubgraphTypes'
