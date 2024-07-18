'use client'
import { useSigner, useUser } from '@alchemy/aa-alchemy/react'

import { AccountKitAddOwner } from '@/components/molecules/AccountKitAddOwner/AccountKitAddOwner'
import { AccountKitClient } from '@/components/molecules/AccountKitClient/AccountKitClient'
import { AccountKitExportPrivateKey } from '@/components/molecules/AccountKitExportPrivateKey/AccountKitExportPrivateKey'
import { AccountKitLogin } from '@/components/molecules/AccountKitLogin/AccountKitLogin'
import { AccountKitSendUserOperation } from '@/components/molecules/AccountKitSendUserOperation/AccountKitSendUserOperation'
import { AccountKitAddPassKey } from '@/components/molecules/AcountKitAddPassKey/AccountKitAddPassKey'
import { TransakOneWidget } from '@/components/molecules/TransakOneWidget/TransakOneWidget'
import { TransakWidget } from '@/components/molecules/TransakWidget/TransakWidget'

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
          <p>Logged user signer address: {user.address}</p>
        </div>
      )}
      {signer && user && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <AccountKitAddPassKey /> (Optional)
          </div>
          <AccountKitExportPrivateKey signer={signer} />
          <AccountKitClient />
          <AccountKitSendUserOperation />
          <AccountKitAddOwner />
          <TransakWidget />
          <TransakOneWidget />
        </>
      )}
    </div>
  )
}
