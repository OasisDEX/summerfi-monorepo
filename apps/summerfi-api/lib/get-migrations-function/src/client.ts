import { Chain, HttpTransport, createPublicClient, extractChain, http } from 'viem'
import { mainnet, optimism, arbitrum, base, sepolia } from 'viem/chains'
import { getContract } from 'viem'
import { aavePoolContract } from './abi/aavePoolContract'
import { decodeBitmapToAssetsAddresses } from './decodeBitmapToAssetsAddresses'
import { aavePoolDataProviderContract } from './abi/aavePoolDataProviderContract'
import { aaveOracleContract } from './abi/aaveOracleContract'
import { USD_DECIMALS } from '@summerfi/serverless-shared/constants'
import { ProtocolMigrationAssets } from './types'
import {
  Address,
  PortfolioMigrationAsset,
  ProtocolId,
  Token,
  isChainId,
  type ChainId,
} from '@summerfi/serverless-shared/domain-types'
import { createAddressService } from './addressService'
import { IMigrationConfig } from './migrations-config'
import {
  IRpcConfig,
  getRpcGatewayEndpoint,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { publicActionReverseMirage } from 'reverse-mirage'

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

export function createMigrationsClient(
  rpcGatewayUrl: string,
  customRpcUrl: string | undefined,
  migrationConfig: IMigrationConfig,
  forkChainId?: ChainId,
) {
  const getProtocolAssetsToMigrate = async (
    address: Address,
  ): Promise<ProtocolMigrationAssets[]> => {
    // for each supported chain
    const promises: Promise<ProtocolMigrationAssets>[] = []

    Object.entries(migrationConfig).forEach(([chainIdString, supportedProtocolsIds]) => {
      const chainId = Number(chainIdString)
      if (!isChainId(chainId)) {
        throw new Error(`Invalid chainId: ${chainId}`)
      }
      if (forkChainId !== chainId) {
        return
      }
      supportedProtocolsIds.forEach((protocolId) => {
        const promise = async (): Promise<ProtocolMigrationAssets> => {
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

          const { collAssets, debtAssets } = await getAssets(transport, chain, protocolId, address)
          return {
            debtAssets,
            collAssets,
            chainId,
            protocolId,
          }
        }
        promises.push(promise())
      })
    })

    return Promise.all(promises)
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
      assetsAddresses.map((address) =>
        publicClient.getERC20({
          erc20: {
            address,
            chainID: chain.id,
          },
        }),
      ),
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
