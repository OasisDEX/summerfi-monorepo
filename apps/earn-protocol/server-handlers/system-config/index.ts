import { ProtocolId } from '@summerfi/serverless-shared'
import { getTranslations } from 'next-intl/server'

import { configFetcher } from '@/server-handlers/system-config/calls/config'
import { fetchContentfulGraphQL } from '@/server-handlers/system-config/calls/contentful'
import { navigationQuery } from '@/server-handlers/system-config/calls/navigation-query'
import { productHubFetcher } from '@/server-handlers/system-config/calls/product-hub'
import { configRaysFetcher } from '@/server-handlers/system-config/calls/rays-config'
import { parseNavigationResponse } from '@/server-handlers/system-config/parsers/parse-navigation-response'
import { lendingProtocolMap } from '@/types/lending-protocol'
import { NavigationResponse } from '@/types/navigation'
import { ProductHubData } from '@/types/product-hub'

const systemConfigHandler = async () => {
  try {
    const tNav = await getTranslations({ locale: 'en', namespace: 'nav' })
    const config = await configFetcher()
    const protocols = [
      ...(config.features?.AjnaSafetySwitch ? [] : [lendingProtocolMap[ProtocolId.AJNA]]),
      lendingProtocolMap[ProtocolId.AAVE_V2],
      lendingProtocolMap[ProtocolId.AAVE_V3],
      lendingProtocolMap[ProtocolId.MAKER],
      ...(config.features?.MorphoSafetySwitch ? [] : [lendingProtocolMap[ProtocolId.MORPHO_BLUE]]),
      lendingProtocolMap[ProtocolId.SPARK],
    ]

    const [productHub, navigationResponse, configRays] = await Promise.all([
      productHubFetcher(protocols),
      fetchContentfulGraphQL<NavigationResponse>(navigationQuery),
      configRaysFetcher(),
    ])

    const navigation = parseNavigationResponse({ navigationResponse, productHub, tNav })
    // TODO figure out why unpublish of Use Cases in contentful causes error
    const resolvedNavigation = navigation.filter((item) => item.label !== 'Use Cases')

    return {
      config,
      configRays,
      navigation: resolvedNavigation,
      productHub: productHub as ProductHubData,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in systemConfigHandler', error)

    throw error
  }
}

export default systemConfigHandler

export type SystemConfig = Awaited<ReturnType<typeof systemConfigHandler>>
