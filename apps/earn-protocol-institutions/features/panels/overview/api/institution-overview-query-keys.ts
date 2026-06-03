import { INSTITUTIONS_CACHE_TAGS } from '@/constants/revalidation'

// Kept in a non-client module so the (potential) server prefetch and the client hook share the
// exact same query key.
const INSTITUTION_TVL_CHART = 'tvl-chart'

export const getInstitutionTvlChartQueryKey = (institutionName: string) =>
  [
    INSTITUTIONS_CACHE_TAGS.INSTITUTION_TVL_CHART,
    INSTITUTION_TVL_CHART,
    institutionName.toLowerCase(),
  ] as const
