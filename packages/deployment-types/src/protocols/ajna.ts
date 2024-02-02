import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './protocols'

export type AjnaActionNames = 'AjnaDepositBorrow' | 'AjnaRepayWithdraw'

export type AjnaContractNames =
  | 'AjnaPoolInfo'
  | 'AjnaProxyActions'
  | 'AjnaPoolPairs_ETHDAI'
  | 'AjnaPoolPairs_ETHUSDC'
  | 'AjnaPoolPairs_RETHDAI'
  | 'AjnaPoolPairs_RETHETH'
  | 'AjnaPoolPairs_RETHUSDC'
  | 'AjnaPoolPairs_USDCETH'
  | 'AjnaPoolPairs_USDCWBTC'
  | 'AjnaPoolPairs_USDCDAI'
  | 'AjnaPoolPairs_WBTCDAI'
  | 'AjnaPoolPairs_WBTCUSDC'
  | 'AjnaPoolPairs_WSTETHDAI'
  | 'AjnaPoolPairs_WSTETHETH'
  | 'AjnaPoolPairs_WSTETHUSDC'
  | 'AjnaPoolPairs_CBETHETH'
  | 'AjnaPoolPairs_TBTCWBTC'
  | 'AjnaPoolPairs_TBTCUSDC'
  | 'AjnaPoolPairs_ETHGHO'
  | 'AjnaPoolPairs_WSTETHGHO'
  | 'AjnaPoolPairs_GHODAI'
  | 'AjnaPoolPairs_RETHGHO'
  | 'AjnaPoolPairs_WBTCGHO'
  | 'AjnaPoolPairs_CBETHGHO'
  | 'AjnaPoolPairs_WLDUSDC'
  | 'AjnaPoolPairs_USDCWLD'
  | 'AjnaPoolPairs_SDAIUSDC'
  | 'AjnaPoolPairs_YFIDAI'
  | 'AjnaPoolPairs_YIELDETHETH'
  | 'AjnaPoolPairs_YIELDBTCWBTC'
  | 'AjnaPoolPairs_TBTCGHO'
  | 'AjnaPoolPairs_CBETHUSDBC'
  | 'AjnaPoolPairs_STYETHDAI'
  | 'AjnaPoolPairs_RBNETH'
  | 'AjnaPoolPairs_AJNADAI'
  | 'AjnaRewardsManager'
  | 'AjnaRewardsClaimer'
  | 'AjnaRewardsReedemer'
  | 'AjnaBonusRewardsReedemer'
  | 'ERC20PoolFactory'

export type AjnaProtocolConfig = Record<AjnaContractNames, ProtocolConfigDependencyEntry>
export type AjnaActionsConfig = Record<AjnaActionNames, ProtocolConfigActionEntry>

export type AjnaConfig = {
  protocol: AjnaProtocolConfig
  actions: AjnaActionsConfig
}
