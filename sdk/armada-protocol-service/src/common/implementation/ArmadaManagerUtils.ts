import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi, StakingRewardsManagerBaseAbi } from '@summerfi/armada-protocol-abis'
import { isTestDeployment, type IArmadaManagerUtils } from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import {
  calculatePriceImpact,
  ITokenAmount,
  LoggingService,
  Price,
  TokenAmount,
  TransactionType,
  type HexData,
  type IPercentage,
  type IToken,
  type ISpotPriceInfo,
  type TransactionPriceImpact,
  type IArmadaVaultId,
  type AddressValue,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData, erc20Abi, zeroAddress } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import { BigNumber } from 'bignumber.js'
import type { IDeploymentProvider } from '../..'
import { ArmadaManagerShared } from './ArmadaManagerShared'

/**
 * @name ArmadaManagerUtils
 * @description This class is the implementation of the IArmadaManagerUtils interface.
 */
export class ArmadaManagerUtils extends ArmadaManagerShared implements IArmadaManagerUtils {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private _swapManager: ISwapManager
  private _oracleManager: IOracleManager
  private _tokensManager: ITokensManager
  private _deploymentProvider: IDeploymentProvider

  /** CONSTRUCTOR */
  constructor(params: {
    clientId?: string
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    blockchainClientProvider: IBlockchainClientProvider
    swapManager: ISwapManager
    oracleManager: IOracleManager
    tokensManager: ITokensManager
    deploymentProvider: IDeploymentProvider
  }) {
    super({ clientId: params.clientId })

    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._swapManager = params.swapManager
    this._oracleManager = params.oracleManager
    this._tokensManager = params.tokensManager
    this._deploymentProvider = params.deploymentProvider
  }

  getSummerToken(
    params: Parameters<IArmadaManagerUtils['getSummerToken']>[0],
  ): ReturnType<IArmadaManagerUtils['getSummerToken']> {
    const tokenSymbol = isTestDeployment() ? 'BUMMER' : 'SUMR'

    return this._tokensManager.getTokenBySymbol({
      chainInfo: params.chainInfo,
      symbol: tokenSymbol,
    })
  }

  async getSummerPrice(
    params?: Parameters<IArmadaManagerUtils['getSummerPrice']>[0],
  ): ReturnType<IArmadaManagerUtils['getSummerPrice']> {
    if (params?.override !== undefined) {
      return params.override
    }

    // fetch from coingecko
    const id = 'summer-2'
    const url = `https://pro-api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&precision=6`
    const resp = await fetch(url, {
      headers: {
        [this._configProvider.getConfigurationItem({ name: 'COINGECKO_API_AUTH_HEADER' })]:
          `${this._configProvider.getConfigurationItem({ name: 'COINGECKO_API_KEY' })}`,
        'Content-Type': 'application/json',
      },
    })
    if (!resp.ok) {
      const errorText = await resp.text()
      throw Error(
        `Error performing coingecko spot price request: ${JSON.stringify({
          apiQuery: url,
          statusCode: resp.status,
          json: errorText,
        })}`,
      )
    }
    const json = (await resp.json()) as Record<string, unknown>

    const coinData = json[id] as { [currency: string]: number } | undefined

    return coinData?.usd ?? 0.25
  }

  async getFleetShares(
    params: Parameters<IArmadaManagerUtils['getFleetShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC20Contract = fleetContract.asErc20()
    const shares = await fleetERC20Contract.balanceOf({ address: params.user.wallet.address })

    return shares
  }

  async getStakedShares(
    params: Parameters<IArmadaManagerUtils['getStakedShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const { stakingRewardsManager } = await fleetContract.config()
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.vaultId.chainInfo,
    })

    const isStakingRewardsManagerZero = stakingRewardsManager.value === zeroAddress

    const [balance, token] = await Promise.all([
      isStakingRewardsManagerZero
        ? Promise.resolve(0n)
        : client.readContract({
            abi: StakingRewardsManagerBaseAbi,
            address: stakingRewardsManager.value,
            functionName: 'balanceOf',
            args: [params.user.wallet.address.value],
          }),
      fleetContract.asErc20().getToken(),
    ])

    return TokenAmount.createFromBaseUnit({
      token: token,
      amount: balance.toString(),
    })
  }

  /** @see IArmadaManagerUtils.getFleetBalance */
  async getFleetBalance(params: Parameters<IArmadaManagerUtils['getFleetBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const [fleetContract, shares] = await Promise.all([
      this._contractsProvider.getFleetCommanderContract({
        chainInfo: params.vaultId.chainInfo,
        address: params.vaultId.fleetAddress,
      }),
      this.getFleetShares(params),
    ])
    const assets = await fleetContract.asErc4626().convertToAssets({ amount: shares })

    return { shares, assets }
  }

  /** @see IArmadaManagerUtils.getStakedBalance */
  async getStakedBalance(params: Parameters<IArmadaManagerUtils['getStakedBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const [fleetContract, shares] = await Promise.all([
      this._contractsProvider.getFleetCommanderContract({
        chainInfo: params.vaultId.chainInfo,
        address: params.vaultId.fleetAddress,
      }),
      this.getStakedShares(params),
    ])

    const assets = await fleetContract.asErc4626().convertToAssets({ amount: shares })

    return { assets, shares }
  }

  /** @see IArmadaManagerUtils.getTotalBalance */
  async getTotalBalance(params: Parameters<IArmadaManagerUtils['getTotalBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const [fleetBalance, stakedBalance] = await Promise.all([
      this.getFleetBalance(params),
      this.getStakedBalance(params),
    ])

    return {
      shares: fleetBalance.shares.add(stakedBalance.shares),
      assets: fleetBalance.assets.add(stakedBalance.assets),
    }
  }

  /** @see IArmadaManagerUtils.convertToShares */
  async convertToShares(
    params: Parameters<IArmadaManagerUtils['convertToShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToShares({ amount: params.amount })
  }

  /** @see IArmadaManagerUtils.convertToAssets */
  async convertToAssets(
    params: Parameters<IArmadaManagerUtils['convertToAssets']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToAssets({ amount: params.amount })
  }

  async getSwapCall(params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<{
    calldata: HexData
    minAmount: ITokenAmount
    toAmount: ITokenAmount
  }> {
    // get the admirals quarters address
    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId: params.vaultId.chainInfo.chainId,
      contractName: 'admiralsQuarters',
    })

    // get swapdata from the 1inch swap api
    const swapData = await this._swapManager.getSwapDataExactInput({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      recipient: admiralsQuartersAddress,
      slippage: params.slippage,
    })

    const slippageComplement = params.slippage.toComplement()
    const minTokensReceived = BigInt(
      new BigNumber(swapData.toTokenAmount.toSolidityValue().toString())
        .times(new BigNumber(slippageComplement.value).div(100))
        .toFixed(0, BigNumber.ROUND_DOWN),
    )

    // prepare calldata
    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'swap',
      args: [
        params.fromAmount.token.address.value, // from token
        params.toToken.address.value, // to token
        params.fromAmount.toSolidityValue(), // from amount
        minTokensReceived, // min to amount
        swapData.calldata,
      ],
    })

    const minAmount = TokenAmount.createFromBaseUnit({
      token: params.toToken,
      amount: minTokensReceived.toString(),
    })

    LoggingService.debug('getSwapCall', {
      fromAmount: swapData.fromTokenAmount.toString(),
      toAmount: swapData.toTokenAmount.toString(),
      minAmount: minAmount.toString(),
      slippage: params.slippage.toString(),
      slippageComplement: slippageComplement.toString(),
    })

    return {
      calldata,
      minAmount,
      toAmount: swapData.toTokenAmount,
    }
  }

  async getPriceImpact(params: {
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
  }): Promise<TransactionPriceImpact> {
    // for quote we should use optimal quote not the min quote
    const quotePrice = Price.createFrom({
      base: params.fromAmount.token,
      quote: params.toAmount.token,
      value: new BigNumber(params.toAmount.amount).div(params.fromAmount.amount).toFixed(),
    })

    let spotPriceInfo: ISpotPriceInfo | undefined
    try {
      spotPriceInfo = await this._oracleManager.getSpotPrice({
        baseToken: params.fromAmount.token,
        denomination: params.toAmount.token,
      })
    } catch (error) {
      LoggingService.debug('getSpotPrice', {
        error: (error as Error).message,
      })
    }

    const spotPrice = spotPriceInfo?.price
    const impact =
      !spotPrice || spotPrice.isZero() ? null : calculatePriceImpact(spotPrice, quotePrice)

    LoggingService.debug('getPriceImpact', {
      quotePrice: quotePrice.toString(),
      spotPrice: spotPrice?.toString(),
      impact: impact?.toString(),
    })

    return {
      price: quotePrice,
      impact,
    }
  }

  /** @see IArmadaManagerUtils.getUnstakeFleetTokensTx */
  async getUnstakeFleetTokensTx(params: {
    addressValue: AddressValue
    vaultId: IArmadaVaultId
    amountValue?: string
  }): Promise<TransactionInfo> {
    // Get chain info from vaultId
    const chainInfo = params.vaultId.chainInfo

    // Get fleet commander contract
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo,
      address: params.vaultId.fleetAddress,
    })

    // Get rewards manager address from fleet config
    const fleetConfig = await fleetContract.config()
    const rewardsManagerAddress = fleetConfig.stakingRewardsManager

    if (rewardsManagerAddress.value === zeroAddress) {
      throw new Error('Staking rewards manager found for this vault is ZERO_ADDRESS')
    }

    // get public client
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo,
    })

    // Read user's current staked balance
    const stakedBalance = await client.readContract({
      abi: StakingRewardsManagerBaseAbi,
      address: rewardsManagerAddress.value,
      functionName: 'balanceOf',
      args: [params.addressValue],
    })

    // Determine amount to unstake
    let amountToUnstake: bigint
    if (params.amountValue) {
      // Parse the provided amount string to bigint
      amountToUnstake = BigInt(params.amountValue)

      // Validate that the user has enough staked balance
      if (amountToUnstake > stakedBalance) {
        throw new Error(
          `Insufficient staked balance. Available: ${stakedBalance.toString()}, Requested: ${amountToUnstake.toString()}`,
        )
      }
    } else {
      // Use full balance
      amountToUnstake = stakedBalance
    }

    // Validate amount is greater than 0
    if (amountToUnstake === 0n) {
      throw new Error('Staked balance is zero')
    }

    // Generate the unstake transaction calldata
    const calldata = encodeFunctionData({
      abi: StakingRewardsManagerBaseAbi,
      functionName: 'unstake',
      args: [amountToUnstake],
    })

    // Create the transaction
    const transaction = {
      target: rewardsManagerAddress,
      calldata: calldata,
      value: '0',
    }

    // Create description
    const description = `Unstake ${amountToUnstake.toString()} fleet tokens from rewards manager`

    LoggingService.debug('getUnstakeFleetTokensTx', {
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
      addressValue: params.addressValue,
      stakedBalance: stakedBalance.toString(),
      amountToUnstake: amountToUnstake.toString(),
      rewardsManagerAddress,
    })

    return {
      transaction,
      description,
    }
  }

  async getErc20TokenTransferTx(
    params: Parameters<IArmadaManagerUtils['getErc20TokenTransferTx']>[0],
  ): ReturnType<IArmadaManagerUtils['getErc20TokenTransferTx']> {
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [
        params.recipientAddress.toSolidityValue(), // to address
        params.amount.toSolidityValue(), // amount in base units
      ],
    })

    // 4. Return transaction info
    return [
      {
        type: TransactionType.Erc20Transfer,
        description: `Transfer ${params.amount.toString()} to ${params.recipientAddress.toString()}`,
        transaction: {
          target: params.tokenAddress,
          calldata: calldata,
          value: '0',
        },
        metadata: {
          token: params.tokenAddress,
          recipient: params.recipientAddress,
          amount: params.amount,
        },
      },
    ]
  }
}
