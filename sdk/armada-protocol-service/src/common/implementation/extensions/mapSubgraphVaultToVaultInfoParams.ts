import {
  Address,
  ArmadaVaultId,
  FiatCurrency,
  FiatCurrencyAmount,
  Price,
  Token,
  TokenAmount,
  getChainInfoByChainId,
  type ArmadaVaultInfoParameters,
  type ChainId,
  type IPercentage,
  type IToken,
  type VaultApys,
} from '@summerfi/sdk-common'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * Minimum structural shape shared between protocol/institutions/rwa GetVaults rows
 * that the vault info mapper depends on.
 */
export type SubgraphVaultRow = {
  id: string
  inputToken: {
    id: string
    name: string
    symbol: string
    decimals: number
  }
  outputToken?: {
    id: string
    name: string
    symbol: string
    decimals: number
  } | null
  inputTokenBalance: bigint
  outputTokenSupply: bigint
  depositCap: bigint
  totalValueLockedUSD: string
}

const ZERO_APYS: VaultApys = {
  live: null,
  sma24h: null,
  sma7day: null,
  sma30day: null,
}

/**
 * @name mapSubgraphVaultToVaultInfoParams
 * @description Maps a raw vault row from a subgraph into the parameter shape consumed
 *              by ArmadaVaultInfo.createFrom / RwaVaultInfo.createFrom.
 *
 *              Used by both ArmadaManagerVaults.getVaultInfoListPerChain and the
 *              equivalent RWAManager method so the per-vault projection stays in one place.
 *
 * @param chainId          Chain the vault lives on
 * @param rawVault         Raw subgraph vault row (must include the SubgraphVaultRow fields)
 * @param tokensManager    Tokens manager for resolving the asset token
 * @param apysForVault     APYs for this specific vault (keyed by fleet address in the caller)
 * @param rewardsApysForVault Rewards APY breakdown for this specific vault, or undefined
 * @param merklRewardsForVault Merkl rewards breakdown for this specific vault, or undefined
 */
export function mapSubgraphVaultToVaultInfoParams(params: {
  chainId: ChainId
  rawVault: SubgraphVaultRow
  tokensManager: ITokensManager
  apysForVault: VaultApys | undefined
  rewardsApysForVault:
    | Array<{
        token: IToken
        apy: IPercentage | null
      }>
    | undefined
  merklRewardsForVault:
    | Array<{
        token: IToken
        dailyEmission: string
      }>
    | undefined
}): ArmadaVaultInfoParameters {
  const {
    chainId,
    rawVault,
    tokensManager,
    apysForVault,
    rewardsApysForVault,
    merklRewardsForVault,
  } = params

  const chainInfo = getChainInfoByChainId(chainId)
  const fleetAddress = rawVault.id.toLowerCase()
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
  })

  if (!rawVault.outputToken) {
    throw new Error(`Vault ${vaultId.toString()} is missing outputToken data`)
  }

  const token = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: rawVault.outputToken.id }),
    decimals: rawVault.outputToken.decimals,
    symbol: rawVault.outputToken.symbol,
    name: rawVault.outputToken.name,
  })
  const assetToken = tokensManager.getTokenByAddress({
    chainInfo,
    address: Address.createFromEthereum({ value: rawVault.inputToken.id }),
  })
  const depositCap = TokenAmount.createFromBaseUnit({
    token,
    amount: rawVault.depositCap.toString(),
  })

  const totalDeposits = TokenAmount.createFromBaseUnit({
    token: assetToken,
    amount: BigInt(rawVault.inputTokenBalance).toString(),
  })
  const totalShares = TokenAmount.createFromBaseUnit({
    token,
    amount: BigInt(rawVault.outputTokenSupply).toString(),
  })

  const sharePrice = Price.createFromAmountsRatio({
    numerator: totalDeposits,
    denominator: totalShares,
  })

  const tvlUsd = FiatCurrencyAmount.createFrom({
    fiat: FiatCurrency.USD,
    amount: rawVault.totalValueLockedUSD,
  })

  return {
    id: vaultId,
    token,
    assetToken,
    depositCap,
    totalDeposits,
    totalShares,
    sharePrice,
    apy: apysForVault?.live ?? null,
    apys: apysForVault ?? ZERO_APYS,
    rewardsApys: rewardsApysForVault,
    merklRewards: merklRewardsForVault,
    tvlUsd,
  }
}
