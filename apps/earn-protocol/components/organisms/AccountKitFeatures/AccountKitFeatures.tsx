'use client'
import { useSigner, useUser } from '@alchemy/aa-alchemy/react'

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
      {user && <>Logged user: {user.email}</>}
      {signer && user && (
        <div style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
          <AccountKitAddPassKey /> (Optional)
        </div>
      )}
      {signer && user && <AccountKitExportPrivateKey signer={signer} />}
    </div>
  )
}
