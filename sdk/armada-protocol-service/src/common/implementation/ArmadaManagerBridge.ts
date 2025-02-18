import { encodeFunctionData } from 'viem'
import { SummerTokenAbi as BridgeAbi } from '@summerfi/armada-protocol-abis'
import { getBridgeContractAddress, getLayerZeroConfig } from '@summerfi/armada-protocol-common'
import {
  type ChainInfo,
  type ITokenAmount,
  type IAddress,
  type IUser,
  type IChainInfo,
  TransactionType,
  Percentage,
  BridgeTransactionInfo,
  TokenAmount,
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
  private _hubChainInfo: IChainInfo
  private _tokensManager: ITokensManager

  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    configProvider: IConfigurationProvider
    hubChainInfo: IChainInfo
    tokensManager: ITokensManager
  }) {
    this._configProvider = params.configProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._hubChainInfo = params.hubChainInfo
    this._tokensManager = params.tokensManager
  }

  async getBridgeTx(params: BridgeTxParams): Promise<BridgeTransactionInfo[]> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })
    // Retrieve the appropriate bridge contract address based on the source and target chains.
    // This helper should resolve the correct bridge contract configured for these chains.
    const bridgeAddress = getBridgeContractAddress(params.sourceChain)

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

    const quotedFee = await client.readContract({
      address: bridgeAddress.value,
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

    const ETH = await this._tokensManager.getTokenBySymbol({
      symbol: 'ETH',
      chainInfo: params.sourceChain,
    })
    const transaction: BridgeTransactionInfo = {
      description,
      transaction: {
        target: bridgeAddress,
        value: quotedFee.nativeFee.toString(),
        calldata,
      },
      metadata: {
        fromAmount: params.amount,
        toAmount: params.amount,
        slippage: Percentage.createFrom({ value: 0 }),
        lzFee: TokenAmount.createFromBaseUnit({
          token: ETH,
          amount: quotedFee.nativeFee.toString(),
        }),
      },
      type: TransactionType.Bridge,
    }

    return [transaction]
  }
}
