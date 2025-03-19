import { Chain, createPublicClient, extractChain, getContract, http, HttpTransport } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'
import { aavePoolContract } from './abi/aavePoolContract'
import { decodeBitmapToAssetsAddresses } from './decodeBitmapToAssetsAddresses'
import { aavePoolDataProviderContract } from './abi/aavePoolDataProviderContract'
import { aaveOracleContract } from './abi/aaveOracleContract'
import { USD_DECIMALS } from '@summerfi/serverless-shared/constants'
import { ProtocolMigrationAssets } from './types'
import {
  Address,
  ChainId,
  isChainId,
  PortfolioMigrationAddressType,
  PortfolioMigrationAsset,
  ProtocolId,
  Token,
} from '@summerfi/serverless-shared/domain-types'
import { createAddressService } from './addressService'
import { IMigrationConfig } from './migrations-config'
import {
  getRpcGatewayEndpoint,
  IRpcConfig,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { publicActionReverseMirage } from 'reverse-mirage'
import { getDsProxy } from './getDsProxy'
import { Logger } from '@aws-lambda-powertools/logger'

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

export function createMigrationsClient(
  migrationConfig: IMigrationConfig,
  rpcGatewayUrl: string,
  customRpcUrl: string | undefined,
  customChainId?: ChainId,
  logger?: Logger,
) {
  const getProtocolAssetsToMigrate = async (
    address: Address,
  ): Promise<ProtocolMigrationAssets[]> => {
    // for each supported chain
    const promises: Promise<ProtocolMigrationAssets[]>[] = []

    Object.entries(migrationConfig).forEach(([chainIdString, supportedProtocolsIds]) => {
      const chainId = Number(chainIdString)
      if (!isChainId(chainId)) {
        throw new Error(`Invalid chainId: ${chainId}`)
      }
      // skik unsupported chains
      if ([ChainId.SONIC].includes(chainId)) {
        return
      }
      if (customChainId && customChainId !== chainId) {
        return
      }
      const chain = extractChain({
        chains: [mainnet, base, optimism, arbitrum, sepolia],
        id: chainId,
      })

      const rpcUrl = customRpcUrl ?? getRpcGatewayEndpoint(rpcGatewayUrl, chainId, rpcConfig)
      const transport = http(rpcUrl, {
        batch: false,
        fetchOptions: {
          method: 'POST',
        },
      })

      const dsProxiesPromise = getDsProxy(address, transport, chain, logger)

      supportedProtocolsIds.forEach((protocolId) => {
        const promise = async (): Promise<ProtocolMigrationAssets[]> => {
          const { dsProxy, eoa } = await dsProxiesPromise
          const perAddress = async (
            positionAddress: Address,
            walletAddress: Address,
            positionAddressType: PortfolioMigrationAddressType,
          ): Promise<ProtocolMigrationAssets> => {
            const { collAssets, debtAssets } = await getAssets(
              transport,
              chain,
              protocolId,
              positionAddress,
            )
            return {
              positionAddress,
              walletAddress,
              debtAssets,
              collAssets,
              chainId,
              protocolId,
              positionAddressType,
            }
          }

          if (dsProxy) {
            return [await perAddress(dsProxy, eoa, 'DS_PROXY'), await perAddress(eoa, eoa, 'EOA')]
          }
          return [await perAddress(eoa, eoa, 'EOA')]
        }
        promises.push(promise())
      })
    })

    return (await Promise.all(promises)).flatMap((x) => x)
  }

  return {
    getProtocolAssetsToMigrate: getProtocolAssetsToMigrate,
  }
}

async function getAssets(
  transport: HttpTransport,
  chain: Chain,
  protocol: ProtocolId,
  user: Address,
): Promise<{ debtAssets: PortfolioMigrationAsset[]; collAssets: PortfolioMigrationAsset[] }> {
  const publicClient = createPublicClient({
    chain,
    transport,
  }).extend(publicActionReverseMirage)

  const addressService = createAddressService(chain.id)

  const aavePool = getContract({
    address: addressService.getProtocolContract(protocol, 'LendingPool'),
    abi: aavePoolContract.abi,
    publicClient,
  })
  const aavePoolDataProvider = getContract({
    address: addressService.getProtocolContract(protocol, 'PoolDataProvider'),
    abi: aavePoolDataProviderContract.abi,
    publicClient,
  })
  const aaveOracle = getContract({
    address: addressService.getProtocolContract(protocol, 'Oracle'),
    abi: aaveOracleContract.abi,
    publicClient,
  })

  // read getReservesList
  const reservesList = await aavePool.read.getReservesList()

  // read getUserConfiguration
  const userConfig = await aavePool.read.getUserConfiguration([user])

  // decode the userConfig across all the reserves.
  const { collAssetsAddresses, debtAssetsAddresses } = decodeBitmapToAssetsAddresses(
    userConfig.data,
    reservesList,
  )
  const assetsAddresses = [...collAssetsAddresses, ...debtAssetsAddresses]

  // read getUserReserveData from aavePoolDataProvider, and coll assets prices from aaveOracle
  const [assetsReserveData, assetsPrices, assetsTokensMeta] = await Promise.all([
    Promise.all(
      assetsAddresses.map((address) =>
        aavePoolDataProvider.read.getUserReserveData([address, user]),
      ),
    ),
    aaveOracle.read.getAssetsPrices([assetsAddresses]),
    Promise.all(
      assetsAddresses.map((address) => {
        // MKR is not regular ERC20 and the symbol is in bytes32
        if (address === '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2') {
          return {
            address: address as Address,
            decimals: 18,
            symbol: 'MKR',
          }
        }
        return publicClient.getERC20({
          erc20: {
            address,
            chainID: chain.id,
          },
        })
      }),
    ),
  ])

  const assetsTokens = assetsTokensMeta.map((tokenMeta) => {
    const token: Token = {
      decimals: BigInt(tokenMeta.decimals),
      symbol: tokenMeta.symbol,
      address: tokenMeta.address,
    }
    return token
  })

  const createPortfolioMigrationAsset =
    ({ debt }: { debt?: boolean }) =>
    (address: Address): PortfolioMigrationAsset => {
      const index = assetsAddresses.indexOf(address)
      const symbol = assetsTokens[index].symbol
      const balance = debt ? assetsReserveData[index][2] : assetsReserveData[index][0]
      const balanceDecimals = assetsTokens[index].decimals
      const price = assetsPrices[index]
      const priceDecimals = USD_DECIMALS
      const usdValue = calculateUsdValue({ balance, balanceDecimals, price, priceDecimals })

      return {
        symbol,
        balance,
        balanceDecimals,
        price,
        priceDecimals,
        usdValue,
      }
    }

  const collAssets: PortfolioMigrationAsset[] = collAssetsAddresses.map(
    createPortfolioMigrationAsset({}),
  )
  const debtAssets: PortfolioMigrationAsset[] = debtAssetsAddresses.map(
    createPortfolioMigrationAsset({ debt: true }),
  )

  return {
    collAssets,
    debtAssets,
  }
}

function calculateUsdValue({
  balance,
  balanceDecimals,
  price,
  priceDecimals,
}: {
  balance: bigint
  balanceDecimals: bigint
  price: bigint
  priceDecimals: bigint
}): number {
  const value = (balance * price) / 10n ** balanceDecimals
  return Number(value) / Number(10n ** priceDecimals)
}
