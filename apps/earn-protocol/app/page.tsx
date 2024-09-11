import { SDKContextProvider } from '@summerfi/sdk-client-react'
import dynamic from 'next/dynamic'

import { sdkApiUrl } from '@/constants/sdk'
import type { FleetConfig } from '@/helpers/sdk/types'

const AccountKitFeatures = dynamic(
  () => import('@/components/organisms/AccountKitFeatures/AccountKitFeatures'),
  {
    ssr: false,
  },
)

const Form = dynamic(() => import('@/components/organisms/Form/Form'), {
  ssr: false,
})

// TODO: Replace with the real dynamic values from the UI state later
const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

export default function HomePage() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <AccountKitFeatures />
        </div>
        <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
          <Form fleetConfig={fleetConfig} />
        </SDKContextProvider>
      </div>
    </div>
  )
}
