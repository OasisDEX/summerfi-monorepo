'use client'

import { Button, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import dynamic from 'next/dynamic'

import { useSignUp } from '@/hooks/use-sign-up'
import { useUserWallet } from '@/hooks/use-user-wallet'

const WalletLabel = dynamic(() => import('../../molecules/WalletLabel/WalletLabel'), {
  ssr: false,
  loading: () => (
    <Button variant="secondarySmall">
      <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
    </Button>
  ),
})

export const InstitutionsLoginPageClient = ({ signatureCookie }: { signatureCookie?: string }) => {
  const { handleSignMessage, signatureError } = useSignUp()
  const { userWalletAddress } = useUserWallet()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        padding: '20px',
      }}
    >
      <Text variant="h1colorful">Welcome to the new thing</Text>
      {!userWalletAddress && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}
        >
          <Text variant="h4">please connect your wallet</Text>
          <WalletLabel buttonVariant="primaryLarge" />
        </div>
      )}
      {userWalletAddress && !signatureCookie && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}
        >
          <Text variant="h4">please sign message</Text>
          {signatureError && (
            <Text variant="p2" style={{ color: 'red' }}>
              {signatureError}
            </Text>
          )}
          <Button variant="primaryLarge" onClick={handleSignMessage}>
            Sign Message
          </Button>
          <WalletLabel buttonVariant="secondaryLarge" variant="logoutOnly" />
        </div>
      )}
    </div>
  )
}
