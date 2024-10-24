import { type InlineButtonOption } from '@summerfi/app-types'

export enum YieldOption {
  ADVANCED_YIELD = 'advanced-yield',
  YIELD_SOURCES = 'yield-sources',
}

export const strategyDetailsYieldOptions: InlineButtonOption<string>[] = [
  {
    title: 'Advanced yield',
    key: YieldOption.ADVANCED_YIELD,
  },
  {
    title: 'Yield source',
    key: YieldOption.YIELD_SOURCES,
  },
]
