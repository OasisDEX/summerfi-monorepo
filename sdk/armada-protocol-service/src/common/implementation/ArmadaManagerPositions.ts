import type {
  IArmadaManagerPositions,
  IArmadaManagerMerklRewards,
} from '@summerfi/armada-protocol-common'
import {
  type IChainInfo,
  type IUser,
  type IArmadaPosition,
  type IArmadaPositionId,
  type IToken,
  type AddressValue,
  type ChainId,
  type HistoricalFleetRateResult,
  type IAddress,
  Address,
  Token,
  TokenAmount,
  FiatCurrencyAmount,
  FiatCurrency,
  createTimeoutSignal,
} from '@summerfi/sdk-common'
import type {
  IArmadaSubgraphManager,
  GetPositionHistoryQuery,
  GetVaultsQuery,
  GetVaultQuery,
} from '@summerfi/subgraph-manager-common'
import { ITokensManager } from '@summerfi/tokens-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { isTestDeployment } from '@summerfi/armada-protocol-common'

/**
 * @name ArmadaManagerPositions
 * @description Implementation of position-related operations for Armada Protocol
 */
export class ArmadaManagerPositions extends ArmadaManagerShared implements IArmadaManagerPositions {
  private _subgraphManager: IArmadaSubgraphManager
  private _tokensManager: ITokensManager
  private _configProvider: IConfigurationProvider
  private _functionsUrl: string
  private _getUserMerklRewards: (
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ) => ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']>
  private _getProtocolUsageRewards: (params: {
    userAddressValue: AddressValue
    chainId: ChainId
  }) => Promise<{
    total: bigint
    perFleet: Record<string, bigint>
  }>

  /** CONSTRUCTOR */
  constructor(params: {
    clientId?: string
    subgraphManager: IArmadaSubgraphManager
    tokensManager: ITokensManager
    configProvider: IConfigurationProvider
    getUserMerklRewards: (
      params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
    ) => ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']>
    getProtocolUsageRewards: (params: {
      userAddressValue: AddressValue
      chainId: ChainId
    }) => Promise<{
      total: bigint
      perFleet: Record<string, bigint>
    }>
  }) {
    super({ clientId: params.clientId })
    this._subgraphManager = params.subgraphManager
    this._tokensManager = params.tokensManager
    this._configProvider = params.configProvider
    this._getUserMerklRewards = params.getUserMerklRewards
    this._getProtocolUsageRewards = params.getProtocolUsageRewards
    this._functionsUrl = this._configProvider.getConfigurationItem({
      name: 'FUNCTIONS_API_URL',
    })
  }

  private getSummerToken(params: { chainInfo: IChainInfo }): IToken {
    const tokenSymbol = isTestDeployment() ? 'BUMMER' : 'SUMR'
    return this._tokensManager.getTokenBySymbol({
      chainInfo: params.chainInfo,
      symbol: tokenSymbol,
    })
  }

  /** @see IArmadaManagerPositions.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManagerPositions['getVaultsRaw']>[0]) {
    return (await this._subgraphManager.getVaults({
      chainId: params.chainInfo.chainId,
      clientId: this.getClientIdOrUndefined(),
    })) as GetVaultsQuery
  }

  /** @see IArmadaManagerPositions.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManagerPositions['getVaultRaw']>[0]) {
    return this._subgraphManager.getVault({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
    }) as GetVaultQuery
  }

  /** @see IArmadaManagerPositions.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(
    params: Parameters<IArmadaManagerPositions['getGlobalRebalancesRaw']>[0],
  ) {
    return this._subgraphManager.getGlobalRebalances({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManagerPositions.getUsersActivityRaw */
  async getUsersActivityRaw(params: Parameters<IArmadaManagerPositions['getUsersActivityRaw']>[0]) {
    return this._subgraphManager.getUsersActivity({
      chainId: params.chainInfo.chainId,
      where: params.where,
    })
  }

  /** @see IArmadaManagerPositions.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManagerPositions['getUserActivityRaw']>[0]) {
    return this._subgraphManager.getUserActivity({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
      accountAddress: params.accountAddress,
    })
  }

  /** @see IArmadaManagerPositions.getUserPositions */
  async getUserPositions({ user }: { user: IUser }): Promise<IArmadaPosition[]> {
    const summerToken = this.getSummerToken({ chainInfo: user.chainInfo })
    const getTokenBySymbol = this._tokensManager.getTokenBySymbol.bind(this._tokensManager)

    return parseGetUserPositionsQuery({
      user,
      query: await this._subgraphManager.getUserPositions({ user }),
      summerToken,
      getTokenBySymbol,
      getUserMerklRewards: this._getUserMerklRewards,
      getProtocolUsageRewards: this._getProtocolUsageRewards,
    })
  }

  /** @see IArmadaManagerPositions.getUserPosition */
  async getUserPosition({
    user,
    fleetAddress,
  }: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition | undefined> {
    const summerToken = this.getSummerToken({ chainInfo: user.chainInfo })
    const getTokenBySymbol = this._tokensManager.getTokenBySymbol.bind(this._tokensManager)

    return parseGetUserPositionQuery({
      user,
      query: await this._subgraphManager.getUserPosition({ user, fleetAddress }),
      summerToken,
      getTokenBySymbol,
      getUserMerklRewards: this._getUserMerklRewards,
      getProtocolUsageRewards: this._getProtocolUsageRewards,
    })
  }

  /** @see IArmadaManagerPositions.getPosition */
  async getPosition(params: {
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition | undefined> {
    const summerToken = this.getSummerToken({ chainInfo: params.positionId.user.chainInfo })
    const getTokenBySymbol = this._tokensManager.getTokenBySymbol.bind(this._tokensManager)

    return parseGetUserPositionQuery({
      user: params.positionId.user,
      query: await this._subgraphManager.getPosition({ positionId: params.positionId }),
      summerToken,
      getTokenBySymbol,
      getUserMerklRewards: this._getUserMerklRewards,
      getProtocolUsageRewards: this._getProtocolUsageRewards,
    })
  }

  /** @see IArmadaManagerPositions.getPositionHistory */
  async getPositionHistory(
    params: Parameters<IArmadaManagerPositions['getPositionHistory']>[0],
  ): Promise<GetPositionHistoryQuery> {
    return this._subgraphManager.getPositionHistory({
      positionId: params.positionId,
    })
  }

  /** @see IArmadaManagerPositions.getVaultsHistoricalRates */
  async getVaultsHistoricalRates(
    params: Parameters<IArmadaManagerPositions['getVaultsHistoricalRates']>[0],
  ): ReturnType<IArmadaManagerPositions['getVaultsHistoricalRates']> {
    const requestBody = {
      fleets: params.fleets,
    }

    const response = await fetch(`${this._functionsUrl}/historical-fleet-rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: createTimeoutSignal(),
    })

    const data = (await response.json()) as {
      rates: HistoricalFleetRateResult[]
    }

    return data.rates
  }

  /** @see IArmadaManagerPositions.getDeposits */
  async getDeposits(
    params: Parameters<IArmadaManagerPositions['getDeposits']>[0],
  ): ReturnType<IArmadaManagerPositions['getDeposits']> {
    const result = await this._subgraphManager.getDeposits({
      positionId: params.positionId,
      first: params.first,
      skip: params.skip,
    })

    if (!result.position?.deposits) {
      return []
    }

    const deposits = result.position.deposits

    return deposits.map((deposit) => ({
      from: deposit.from as AddressValue,
      to: deposit.to as AddressValue,
      amount: TokenAmount.createFrom({
        amount: deposit.amount.toString(),
        token: Token.createFrom({
          chainInfo: params.positionId.user.chainInfo,
          address: Address.createFromEthereum({
            value: deposit.asset.id as AddressValue,
          }),
          symbol: deposit.asset.symbol,
          name: deposit.asset.name,
          decimals: deposit.asset.decimals,
        }),
      }),
      amountUsd: FiatCurrencyAmount.createFrom({
        amount: deposit.amountUSD,
        fiat: FiatCurrency.USD,
      }),
      timestamp: Number(deposit.timestamp),
      txHash: deposit.hash as `0x${string}`,
      vaultBalance: TokenAmount.createFrom({
        amount: deposit.inputTokenBalance.toString(),
        token: Token.createFrom({
          chainInfo: params.positionId.user.chainInfo,
          address: Address.createFromEthereum({
            value: deposit.asset.id as AddressValue,
          }),
          symbol: deposit.asset.symbol,
          name: deposit.asset.name,
          decimals: deposit.asset.decimals,
        }),
      }),
      vaultBalanceUsd: FiatCurrencyAmount.createFrom({
        amount: deposit.inputTokenBalanceNormalizedUSD,
        fiat: FiatCurrency.USD,
      }),
    }))
  }

  /** @see IArmadaManagerPositions.getWithdrawals */
  async getWithdrawals(
    params: Parameters<IArmadaManagerPositions['getWithdrawals']>[0],
  ): ReturnType<IArmadaManagerPositions['getWithdrawals']> {
    const result = await this._subgraphManager.getWithdrawals({
      positionId: params.positionId,
      first: params.first,
      skip: params.skip,
    })

    if (!result.position?.withdrawals) {
      return []
    }

    const withdrawals = result.position.withdrawals

    return withdrawals.map((withdrawal) => ({
      from: withdrawal.from as AddressValue,
      to: withdrawal.to as AddressValue,
      amount: TokenAmount.createFrom({
        amount: withdrawal.amount.toString(),
        token: Token.createFrom({
          chainInfo: params.positionId.user.chainInfo,
          address: Address.createFromEthereum({
            value: withdrawal.asset.id as AddressValue,
          }),
          symbol: withdrawal.asset.symbol,
          name: withdrawal.asset.name,
          decimals: withdrawal.asset.decimals,
        }),
      }),
      amountUsd: FiatCurrencyAmount.createFrom({
        amount: withdrawal.amountUSD,
        fiat: FiatCurrency.USD,
      }),
      timestamp: Number(withdrawal.timestamp),
      txHash: withdrawal.hash as `0x${string}`,
      vaultBalance: TokenAmount.createFrom({
        amount: withdrawal.inputTokenBalance.toString(),
        token: Token.createFrom({
          chainInfo: params.positionId.user.chainInfo,
          address: Address.createFromEthereum({
            value: withdrawal.asset.id as AddressValue,
          }),
          symbol: withdrawal.asset.symbol,
          name: withdrawal.asset.name,
          decimals: withdrawal.asset.decimals,
        }),
      }),
      vaultBalanceUsd: FiatCurrencyAmount.createFrom({
        amount: withdrawal.inputTokenBalanceNormalizedUSD,
        fiat: FiatCurrency.USD,
      }),
    }))
  }
}
