import { type ReactNode } from 'react'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'

const DCALayout = async ({ children }: { children: ReactNode }) => {
  const configRaw = await getCachedConfig()
  const systemConfig = parseServerResponseToClient(configRaw)

  if (!systemConfig.features?.DcaEnabled) {
    redirect('/not-found')
  }

  return children
}

export default DCALayout
