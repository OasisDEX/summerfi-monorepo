import { EarnStrategies } from '@summerfi/app-db'
import { isAddress } from 'viem'

import { aaveStrategiesLite } from '@/constants/aave-strategies-lite'
import { ajnaPoolListLite } from '@/constants/ajna-pool-list-lite'
import { Erc4626PseudoProtocol, erc4626VaultsByName } from '@/constants/erc-4626-vaults'
import { NetworkIds } from '@/constants/networks-list'
import { isYieldLoopPair } from '@/helpers/is-yield-loop-pair'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { OmniProductType } from '@/types/omni-kit'
import { ProductHubItem } from '@/types/product-hub'

interface IsPoolOraclessParams {
  collateralToken: string
  networkId?: NetworkIds
  quoteToken: string
}

function isPoolOracless({ collateralToken, networkId, quoteToken }: IsPoolOraclessParams): boolean {
  const ajnaPoolPairs = ajnaPoolListLite[networkId as keyof typeof ajnaPoolListLite]

  return isAddress(collateralToken) && isAddress(quoteToken)
    ? true
    : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ajnaPoolPairs && !Object.keys(ajnaPoolPairs).includes(`${collateralToken}-${quoteToken}`)
}

export const getAaveLikeViewStrategyUrl = ({
  aaveLikeProduct,
  bypassFeatureFlag,
  version,
  product,
  protocol,
  primaryToken,
  secondaryToken,
  network,
}: Partial<ProductHubItem> & {
  version: 'v2' | 'v3'
  bypassFeatureFlag: boolean
  aaveLikeProduct: 'aave' | 'spark'
}) => {
  const search = aaveStrategiesLite.find(
    (strategy) =>
      product
        ?.map((prod: typeof strategy.type) => prod.toLocaleLowerCase())
        .includes(strategy.type.toLocaleLowerCase() as OmniProductType) &&
      strategy.protocol === protocol &&
      strategy.tokens.collateral.toLocaleLowerCase() === primaryToken?.toLocaleLowerCase() &&
      strategy.tokens.debt.toLocaleLowerCase() === secondaryToken?.toLocaleLowerCase() &&
      strategy.network === network,
  )

  if (
    search &&
    [LendingProtocol.AaveV3, LendingProtocol.SparkV3, LendingProtocol.AaveV2].includes(
      search.protocol as LendingProtocol,
    )
  ) {
    const {
      network: aaveLikeNetwork,
      protocol: aaveLikeProtocol,
      type,
      tokens: { collateral, debt },
    } = search
    const resolvedType =
      [
        OmniProductType.Earn.toLocaleLowerCase(),
        OmniProductType.Multiply.toLocaleLowerCase(),
      ].includes(type.toLocaleLowerCase()) &&
      isYieldLoopPair({
        collateralToken: collateral,
        debtToken: debt,
      })
        ? 'multiply'
        : type

    return `/${aaveLikeNetwork.toLocaleLowerCase()}/${
      {
        [LendingProtocol.AaveV3]: 'aave/v3',
        [LendingProtocol.AaveV2]: 'aave/v2',
        [LendingProtocol.SparkV3]: 'spark',
      }[aaveLikeProtocol as LendingProtocol.SparkV3 | LendingProtocol.AaveV3]
    }/${resolvedType.toLocaleLowerCase()}/${collateral.toLocaleUpperCase()}-${debt.toLocaleUpperCase()}`
  }

  console.log('getAaveLikeViewStrategyUrl: no url found for', {
    aaveLikeProduct,
    bypassFeatureFlag,
    version,
    product,
    protocol,
    primaryToken,
    secondaryToken,
    network,
  })

  return !search?.urlSlug || !bypassFeatureFlag
    ? '/'
    : `/${network}/old/${aaveLikeProduct}/${version}/${search.type.toLocaleLowerCase()}/${
        search.urlSlug
      }`
}

export function getGenericPositionUrl({
  bypassFeatureFlag = false,
  networkId,
  earnStrategy,
  label,
  network,
  primaryToken,
  primaryTokenAddress,
  product,
  protocol,
  secondaryToken,
  secondaryTokenAddress,
}: ProductHubItem & { bypassFeatureFlag?: boolean; networkId?: NetworkIds }): string | undefined {
  if (earnStrategy === EarnStrategies.erc_4626) {
    const { id } = erc4626VaultsByName[label]

    return `/${network}/${Erc4626PseudoProtocol}/${product[0]}/${id}`
  }

  const isEarnProduct = product[0] === OmniProductType.Earn
  const isYieldLoop = earnStrategy === EarnStrategies.yield_loop
  const collateralToken = isEarnProduct && !isYieldLoop ? secondaryToken : primaryToken
  const collateralAddress =
    isEarnProduct && !isYieldLoop ? secondaryTokenAddress : primaryTokenAddress
  const quoteToken = isEarnProduct && !isYieldLoop ? primaryToken : secondaryToken
  const quoteAddress = isEarnProduct && !isYieldLoop ? primaryTokenAddress : secondaryTokenAddress

  switch (protocol) {
    case LendingProtocol.Ajna: {
      const isOracless = isPoolOracless({
        collateralToken,
        quoteToken,
        networkId,
      })
      const ajnaProductInUrl = isEarnProduct && isYieldLoop ? OmniProductType.Multiply : product[0]
      const tokensInUrl = isOracless
        ? `${collateralAddress}-${quoteAddress}`
        : `${collateralToken}-${quoteToken}`

      return `/${network}/ajna/${ajnaProductInUrl}/${tokensInUrl}`
    }
    case LendingProtocol.AaveV2:
      return getAaveLikeViewStrategyUrl({
        version: 'v2',
        bypassFeatureFlag,
        network,
        primaryToken,
        product,
        protocol,
        secondaryToken,
        aaveLikeProduct: 'aave',
      })
    case LendingProtocol.AaveV3:
      return getAaveLikeViewStrategyUrl({
        version: 'v3',
        bypassFeatureFlag,
        network,
        primaryToken,
        product,
        protocol,
        secondaryToken,
        aaveLikeProduct: 'aave',
      })
    case LendingProtocol.Maker: {
      if (label === 'DSR') return '/earn/dsr/'

      const openUrl = product.includes(OmniProductType.Multiply) ? 'open-multiply' : 'open'
      const ilkInUrl = label.split('/').length ? label.split('/')[0] : label

      return `/vaults/${openUrl}/${ilkInUrl}`
    }
    case LendingProtocol.MorphoBlue: {
      const morphoBlueProductInUrl =
        isEarnProduct && earnStrategy === EarnStrategies.yield_loop
          ? OmniProductType.Multiply
          : product[0]

      return `/${network}/${LendingProtocol.MorphoBlue}/${morphoBlueProductInUrl}/${label.replace('/', '-')}`
    }
    case LendingProtocol.SparkV3:
      return getAaveLikeViewStrategyUrl({
        version: 'v3',
        bypassFeatureFlag,
        network,
        primaryToken,
        product,
        protocol,
        secondaryToken,
        aaveLikeProduct: 'spark',
      })
  }
  console.log('getGenericPositionUrl: no url found for', {
    bypassFeatureFlag,
    networkId,
    earnStrategy,
    label,
    network,
    primaryToken,
    primaryTokenAddress,
    product,
    protocol,
    secondaryToken,
    secondaryTokenAddress,
  })

  return '/'
}
