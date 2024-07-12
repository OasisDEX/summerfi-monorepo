'use client'
import { useSigner, useUser } from '@alchemy/aa-alchemy/react'

import { AccountKitClient } from '@/components/molecules/AccountKitClient/AccountKitClient'
import { AccountKitExportPrivateKey } from '@/components/molecules/AccountKitExportPrivateKey/AccountKitExportPrivateKey'
import { AccountKitLogin } from '@/components/molecules/AccountKitLogin/AccountKitLogin'
import { AccountKitAddPassKey } from '@/components/molecules/AcountKitAddPassKey/AccountKitAddPassKey'

export const AccountKitFeatures = () => {
  const signer = useSigner()
  const user = useUser()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '24px' }}>
      Account kit features
      <AccountKitLogin />
      {user && (
        <div>
          <p>Logged user: {user.email}</p>
          <p>Logged user address: {user.address}</p>
        </div>
      )}
      {signer && user && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <AccountKitAddPassKey /> (Optional)
          </div>
          <AccountKitExportPrivateKey signer={signer} />
          <AccountKitClient />
        </>
      )}
    </div>
  )
}
