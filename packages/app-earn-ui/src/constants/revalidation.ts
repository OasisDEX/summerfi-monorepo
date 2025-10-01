export const REVALIDATION_TIMES = {
  // values are seconds
  VAULTS_LIST: 300,
  PORTFOLIO_ASSETS: 60,
  PORTFOLIO_DATA: 300,
  POSITION_HISTORY: 120,
  INTEREST_RATES: 600,
  SUMR_DELEGATES: 60,
  CONFIG: 60,
  ALWAYS_FRESH: 0,
  MEDIAN_DEFI_YIELD: 3600,
  MIGRATION_DATA: 30,
  PRO_APP_STATS: 3600,
}

export const REVALIDATION_TAGS = {
  VAULTS_LIST: 'vaults-list',
  INTEREST_RATES: 'interest-rates',
  PORTFOLIO_ASSETS: 'portfolio-assets',
  PORTFOLIO_DATA: 'portfolio-data',
  POSITION_HISTORY: 'position-history',
  CONFIG: 'config',
  MIGRATION_DATA: 'migration-data',
  PRO_APP_STATS: 'pro-app-stats',
}
