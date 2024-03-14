import {AddressAbiMapsByProtocol, IContractProvider} from "../src/interfaces";
import {
  ProtocolManagerContext,
  aaveV3Plugin,
  sparkPlugin,
} from '../src/index'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName, EmodeType, ILKType, IProtocol } from "@summerfi/sdk-common/protocols"
import { protocolManager } from '../src/implementation/ProtocolManager'
import { PriceService } from '../src/implementation/PriceService'
import { TokenService } from '../src/implementation/TokenService'
import {
  DOG_ABI,
  VAT_ABI,
  SPOT_ABI,
  JUG_ABI,
  ILK_REGISTRY_ABI,
  SPARK_POOL_DATA_PROVIDER_ABI,
  SPARK_ORACLE_ABI,
  SPARK_LENDING_POOL_ABI,
  AAVEV3_POOL_DATA_PROVIDER_ABI,
  AAVEV3_ORACLE_ABI,
  AAVEV3_LENDING_POOL_ABI
} from "../src/interfaces/abis";


async function createProtocolManagerContext(): Promise<ProtocolManagerContext> {
  const provider = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(),
  })

  return {
    provider,
    tokenService: new TokenService(),
    priceService: new PriceService(provider),
    contractProvider: new ContractProviderMock()
  }
}

class ContractProviderMock implements IContractProvider {
  getContractDef<P extends IProtocol['name'], K extends keyof AddressAbiMapsByProtocol[P]>(
      contractKey: K,
      protocol: P
  ): AddressAbiMapsByProtocol[P][K] {
    const map: AddressAbiMapsByProtocol = {
      [ProtocolName.Spark]: {
        Oracle: {
          address: '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9',
          abi: SPARK_ORACLE_ABI,
        },
        PoolDataProvider: {
          address: '0xFc21d6d146E6086B8359705C8b28512a983db0cb',
          abi: SPARK_POOL_DATA_PROVIDER_ABI,
        },
        SparkLendingPool: {
          address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
          abi: SPARK_LENDING_POOL_ABI,
        },
      },
      [ProtocolName.Maker]: {
        Dog: {
          address: '0x135954d155898d42c90d2a57824c690e0c7bef1b',
          abi: DOG_ABI,
        },
        Vat: {
          address: '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b',
          abi: VAT_ABI,
        },
        McdJug: {
          address: '0x19c0976f590d67707e62397c87829d896dc0f1f1',
          abi: JUG_ABI,
        },
        Spot: {
          address: '0x65c79fcb50ca1594b025960e539ed7a9a6d434a3',
          abi: SPOT_ABI,
        },
        IlkRegistry: {
          address: '0x5a464C28D19848f44199D003BeF5ecc87d090F87',
          abi: ILK_REGISTRY_ABI,
        },
        Chainlog: {
          address: '0x',
          abi: null
        },
        CdpManager: {
          address: '0x',
          abi: null
        },
        GetCdps: {
          address: '0x',
          abi: null
        },
        Pot: {
          address: '0x',
          abi: null
        },
        End: {
          address: '0x',
          abi: null
        },
        McdGov: {
          address: '0x',
          abi: null
        },
        FlashMintModule: {
          address: '0x',
          abi: null
        }

      },
      [ProtocolName.AAVEv3]: {
        Oracle: {
          address: '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9',
          abi: AAVEV3_ORACLE_ABI,
        },
        PoolDataProvider: {
          address: '0xFc21d6d146E6086B8359705C8b28512a983db0cb',
          abi: AAVEV3_POOL_DATA_PROVIDER_ABI,
        },
        AavePool: {
          address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
          abi: AAVEV3_LENDING_POOL_ABI,
        },
        AaveL2Encoder: {
          address: '0x',
          abi: null
        }
      },
      [ProtocolName.Ajna]: {},
      [ProtocolName.MorphoBlue]: {},
      [ProtocolName.AAVEv2]: {},
    };
    return map[protocol][contractKey];
  }
}

describe('playground', () => {
  let ctx: ProtocolManagerContext
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()
  })

  it('template/maker', async () => {
    const result = await protocolManager.getPool({
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      ilkType: ILKType.ETH_A
    }, ctx)
    console.log(`
  MAKER POOL
  ----------------
  Protocol: ${result.protocol.name}
  Chain: ${result.protocol.chainInfo.name}
  IlkType: ${JSON.stringify(result.poolId)}
  ${result.baseCurrency.toString()}}
  ${JSON.stringify(result.collaterals, null, 4)}
  `)
  })

  it('template/spark', async () => {
    const result = await sparkPlugin.getPool({
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      emodeType: EmodeType.None
    }, ctx)
    console.log(result)
  })

  it('template/aave-v3', async () => {
    const result = await aaveV3Plugin.getPool({
      protocol: {
        name: ProtocolName.AAVEv3,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      emodeType: EmodeType.None
    }, ctx)
    console.log(result)
  })
})
