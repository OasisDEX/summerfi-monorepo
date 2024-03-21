import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { IProtocolPluginContext } from '../../src/interfaces/IProtocolPluginContext'
import { MockContractProvider } from '../../src/mocks/mockContractProvider'
import { TokenService, PriceService } from '../../src/implementation'

export async function createProtocolPluginContext(): Promise<IProtocolPluginContext> {
    const RPC_URL = process.env['MAINNET_RPC_URL'] || ''
    const provider: PublicClient = createPublicClient({
        batch: {
            multicall: true,
        },
        chain: mainnet,
        transport: http(RPC_URL),
    })

    return {
        provider,
        tokenService: new TokenService(),
        priceService: new PriceService(provider),
        contractProvider: new MockContractProvider(),
    }
}