import { encodeFunctionData } from 'viem'
import { SummerTokenAbi as BridgeAbi } from '@summerfi/armada-protocol-abis'
import { getLayerZeroConfig } from '@summerfi/armada-protocol-common'
import {
  Address,
  type ChainInfo,
  type ITokenAmount,
  type IAddress,
  type IUser,
  type IChainInfo,
  TransactionType,
  Percentage,
  BridgeTransactionInfo,
  TokenAmount,
  IToken,
  ChainIds,
} from '@summerfi/sdk-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities'
import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IArmadaManagerBridge } from '@summerfi/armada-protocol-common'
import { ITokensManager } from '@summerfi/tokens-common'

export interface BridgeTxParams {
  user: IUser
  sourceChain: ChainInfo
  targetChain: ChainInfo
  recipient: IAddress
  amount: ITokenAmount
}

export class ArmadaManagerBridge implements IArmadaManagerBridge {
  private _configProvider: IConfigurationProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private _supportedChains: IChainInfo[]
  private _tokensManager: ITokensManager
  private _getSummerToken: (params: { chainInfo: IChainInfo }) => IToken

  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    configProvider: IConfigurationProvider
    supportedChains: IChainInfo[]
    tokensManager: ITokensManager
    getSummerToken: (params: { chainInfo: IChainInfo }) => IToken
  }) {
    this._configProvider = params.configProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._supportedChains = params.supportedChains
    this._tokensManager = params.tokensManager
    this._getSummerToken = params.getSummerToken
  }

  async getBridgeTx(params: BridgeTxParams): Promise<BridgeTransactionInfo[]> {
    const chainInfo = this._supportedChains.find(
      (chain) => chain.chainId === params.sourceChain.chainId,
    )
    if (!chainInfo) {
      throw new Error('Chain not supported')
    }
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: chainInfo,
    })
    const destinationChainLzConfig = getLayerZeroConfig(params.targetChain)

    const options = Options.newOptions().addExecutorLzReceiveOption(300000, 0).toBytes()
    const optionsHex = `0x${Buffer.from(options).toString('hex')}` as `0x${string}`

    const recipientHex = `0x${Buffer.from(addressToBytes32(params.recipient.value)).toString(
      'hex',
    )}` as `0x${string}`

    const amount = params.amount.toSolidityValue()

    const param = {
      dstEid: destinationChainLzConfig.eID,
      to: recipientHex,
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: optionsHex,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x' as `0x${string}`,
    }

    const bridgeContractAddress = this._getSummerToken({ chainInfo: params.sourceChain }).address
    const quotedFee = await client.readContract({
      address: bridgeContractAddress.value,
      abi: BridgeAbi,
      functionName: 'quoteSend',
      args: [param, false] as const,
    })

    const calldata = encodeFunctionData({
      abi: BridgeAbi,
      functionName: 'send',
      args: [
        param,
        {
          nativeFee: quotedFee.nativeFee,
          lzTokenFee: quotedFee.lzTokenFee,
        },
        params.user.wallet.address.value,
      ],
    })

    const description =
      `Bridge ${params.amount.toString()} of SUMR token ` +
      `from ${params.sourceChain.name} to ${params.targetChain.name}`

    const chainIdToFeeTokenSymbol: Record<number, string> = {
      [ChainIds.Sonic]: 'S',
      [ChainIds.Mainnet]: 'ETH',
      [ChainIds.ArbitrumOne]: 'ETH',
      [ChainIds.Base]: 'ETH',
    }

    if (!chainIdToFeeTokenSymbol[params.sourceChain.chainId]) {
      throw new Error(`Unsupported chain ID: ${params.sourceChain.chainId}`)
    }

    const feeTokenSymbol = chainIdToFeeTokenSymbol[params.sourceChain.chainId]
    const feeToken = await this._tokensManager.getTokenBySymbol({
      symbol: feeTokenSymbol,
      chainInfo: params.sourceChain,
    })

    const transaction: BridgeTransactionInfo = {
      description,
      transaction: {
        target: bridgeContractAddress,
        value: quotedFee.nativeFee.toString(),
        calldata,
      },
      metadata: {
        fromAmount: params.amount,
        toAmount: params.amount,
        lzFee: TokenAmount.createFromBaseUnit({
          token: feeToken,
          amount: quotedFee.nativeFee.toString(),
        }),
      },
      type: TransactionType.Bridge,
    }

    return [transaction]
  }
}
