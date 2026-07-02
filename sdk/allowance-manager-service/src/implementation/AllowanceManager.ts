import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import {
  Address,
  LoggingService,
  NATIVE_CURRENCY_ADDRESS_LOWERCASE,
  Token,
  TokenAmount,
  TransactionType,
  getChainInfoByChainId,
} from '@summerfi/sdk-common'
import { permit2Address } from '@uniswap/permit2-sdk'
import { encodeFunctionData, erc20Abi, maxUint256, type SignTypedDataParameters } from 'viem'

const PERMIT2_EXPIRATION_MINUTES = 10

/**
 * @name AllowanceManager
 * @description This class is the implementation of the IAllowanceManager interface. Takes care of generating transactions for setting an allowance
 */
export class AllowanceManager implements IAllowanceManager {
  private _configProvider: IConfigurationProvider
  private _contractsProvider: IContractsProvider
  private _blockchainClientProvider: IBlockchainClientProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
    blockchainClientProvider: IBlockchainClientProvider
  }) {
    this._configProvider = params.configProvider
    this._contractsProvider = params.contractsProvider
    this._blockchainClientProvider = params.blockchainClientProvider
  }

  /** FUNCTIONS */
  /** @see IAllowanceManager.getApproval */
  async getApproval(
    params: Parameters<IAllowanceManager['getApproval']>[0],
  ): ReturnType<IAllowanceManager['getApproval']> {
    const erc20Contract = await this._contractsProvider.getErc20Contract({
      address: params.amount.token.address,
      chainInfo: params.chainInfo,
    })

    const [allowance, approveTx] = await Promise.all([
      params.owner != null
        ? erc20Contract.allowance({
            owner: params.owner,
            spender: params.spender,
          })
        : Promise.resolve(null),
      erc20Contract.approve({
        amount: params.amount,
        spender: params.spender,
      }),
    ])

    if (allowance != null && allowance.isGreaterOrEqualThan(params.amount)) {
      return undefined
    }

    return {
      ...approveTx,
      type: TransactionType.Approve,
      metadata: {
        approvalAmount: params.amount,
        approvalSpender: params.spender,
      },
    }
  }

  /** @see IAllowanceManager.getApprovalFromBaseUnit */
  async getApprovalFromBaseUnit(
    params: Parameters<IAllowanceManager['getApprovalFromBaseUnit']>[0],
  ): ReturnType<IAllowanceManager['getApprovalFromBaseUnit']> {
    const chainInfo = getChainInfoByChainId(params.chainId)
    const tokenAddress = params.tokenAddress as `0x${string}`
    const spenderAddress = params.spenderAddress as `0x${string}`
    const publicClient = this._blockchainClientProvider.getBlockchainClient({ chainInfo })

    // Read the token's real metadata (decimals/symbol/name) + (when an owner is given) the current
    // allowance in one batch. The allowance comparison stays on raw base-unit bigints — the token
    // metadata only feeds the display-only `approvalAmount`.
    const [decimals, symbol, name, currentAllowance] = await Promise.all([
      publicClient.readContract({ address: tokenAddress, abi: erc20Abi, functionName: 'decimals' }),
      publicClient.readContract({ address: tokenAddress, abi: erc20Abi, functionName: 'symbol' }),
      publicClient.readContract({ address: tokenAddress, abi: erc20Abi, functionName: 'name' }),
      params.ownerAddress != null
        ? publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [params.ownerAddress as `0x${string}`, spenderAddress],
          })
        : Promise.resolve(null),
    ])

    if (currentAllowance != null && currentAllowance >= params.amount) {
      return undefined
    }

    // Approve calldata is built directly from the raw base-unit bigint.
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, params.amount],
    })

    return {
      type: TransactionType.Approve,
      description: `Approve ${params.amount} of ${params.tokenAddress} for ${params.spenderAddress}`,
      transaction: {
        target: Address.createFromEthereum({ value: params.tokenAddress }),
        calldata,
        value: '0',
      },
      metadata: {
        // Display-only metadata; the on-chain approve above uses the raw bigint directly. The token's
        // decimals/symbol/name are read on-chain so the human-readable amount is correct.
        approvalAmount: TokenAmount.createFromBaseUnit({
          token: Token.createFrom({
            address: Address.createFromEthereum({ value: params.tokenAddress }),
            chainInfo,
            symbol,
            name,
            decimals,
          }),
          amount: params.amount.toString(),
        }),
        approvalSpender: Address.createFromEthereum({ value: params.spenderAddress }),
      },
    }
  }

  /** @see IAllowanceManager.isPermit2AuthorizationNeeded */
  async isPermit2AuthorizationNeeded(
    params: Parameters<IAllowanceManager['isPermit2AuthorizationNeeded']>[0],
  ): ReturnType<IAllowanceManager['isPermit2AuthorizationNeeded']> {
    if (params.amount === 0n) {
      LoggingService.debug('Allowance amount is zero')
      return false
    }

    if (params.tokenAddress.toSolidityValue() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      LoggingService.debug('Token is native currency, no approval needed')
      return false
    }

    const chainInfo = getChainInfoByChainId(params.chainId)
    const publicClient = this._blockchainClientProvider.getBlockchainClient({ chainInfo })
    const permit2 = permit2Address(params.chainId) as `0x${string}`

    const allowance = await publicClient.readContract({
      address: params.tokenAddress.toSolidityValue() as `0x${string}`,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [params.ownerAddress.toSolidityValue() as `0x${string}`, permit2],
    })

    return allowance < params.amount
  }

  /** @see IAllowanceManager.getPermit2AuthorizationTx */
  getPermit2AuthorizationTx(
    params: Parameters<IAllowanceManager['getPermit2AuthorizationTx']>[0],
  ): ReturnType<IAllowanceManager['getPermit2AuthorizationTx']> {
    if (params.tokenAddress.toSolidityValue() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      throw new Error('Native token does not require Permit2 authorization')
    }

    const permit2 = permit2Address(params.chainId) as `0x${string}`
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [permit2, maxUint256],
    })
    return [
      {
        type: TransactionType.Permit2Authorization,
        transaction: {
          target: params.tokenAddress,
          calldata,
          value: '0',
        },
        description: `Authorize Permit2 to spend token ${params.tokenAddress.toSolidityValue()}`,
      },
    ]
  }

  /** @see IAllowanceManager.getPermit2RevokeTx */
  getPermit2RevokeTx(
    params: Parameters<IAllowanceManager['getPermit2RevokeTx']>[0],
  ): ReturnType<IAllowanceManager['getPermit2RevokeTx']> {
    if (params.tokenAddress.toSolidityValue() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      throw new Error('Native token does not require Permit2 authorization, so no need to revoke')
    }

    const permit2 = permit2Address(params.chainId) as `0x${string}`
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [permit2, 0n],
    })
    return [
      {
        type: TransactionType.Permit2Revoke,
        transaction: {
          target: params.tokenAddress,
          calldata,
          value: '0',
        },
        description: `Revoke Permit2 authorization for token ${params.tokenAddress.toSolidityValue()}`,
      },
    ]
  }

  /** @see IAllowanceManager.getPermit2Data */
  getPermit2Data(
    params: Parameters<IAllowanceManager['getPermit2Data']>[0],
  ): ReturnType<IAllowanceManager['getPermit2Data']> {
    const { chainId, tokenAddress, amount, spenderAddress, senderAddress } = params

    const nonce = BigInt(Date.now())
    const deadline = BigInt(Math.floor(Date.now() / 1000) + PERMIT2_EXPIRATION_MINUTES * 60)

    const permitData = {
      permitted: { token: tokenAddress, amount },
      nonce,
      deadline,
    }

    const domain = {
      name: 'Permit2',
      chainId,
      verifyingContract: permit2Address(chainId) as `0x${string}`,
    }

    const types = {
      PermitTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
      TokenPermissions: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    }

    const signTypedDataParameters: SignTypedDataParameters = {
      account: senderAddress as `0x${string}`,
      domain,
      types,
      primaryType: 'PermitTransferFrom',
      message: {
        permitted: { token: tokenAddress, amount },
        spender: spenderAddress,
        nonce,
        deadline,
      },
    }

    return { permitData, signTypedDataParameters }
  }
}
