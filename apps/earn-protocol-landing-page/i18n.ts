import { getRequestConfig } from 'next-intl/server'

import type { GetRequestConfigParams as _GetRequestConfigParams } from '@/node_modules/next-intl/dist/types/src/server/react-server/getRequestConfig'
// the above line is a hack to prevent TS2742
// see https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1270716220

export default getRequestConfig(async () => {
  const locale = 'en'

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale,
  }
})
