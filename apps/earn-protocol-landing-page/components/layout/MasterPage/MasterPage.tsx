import { type FC, type PropsWithChildren } from 'react'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import Image from 'next/image'

import systemConfigHandler from '@/server-handlers/system-config'

import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = async ({ children }) => {
  const systemConfig = parseServerResponseToClient(await systemConfigHandler())

  return (
    <div className={masterPageStyles.mainContainer}>
      <Image
        src="/img/backgrounds/bg-simple.svg"
        className={masterPageStyles.backgroundSimple}
        width={0}
        height={0}
        style={{ height: 'auto', width: '100%' }}
        alt=""
      />
      Navigation :)
      <div className={masterPageStyles.appContainer}>
        {children}
        <pre style={{ maxHeight: '300px', margin: '10%', border: '1px solid gray', padding: '2%' }}>
          {JSON.stringify(systemConfig, null, 2)}
        </pre>
        <div style={{ marginTop: '100px' }}>Footer (:</div>
      </div>
    </div>
  )
}
