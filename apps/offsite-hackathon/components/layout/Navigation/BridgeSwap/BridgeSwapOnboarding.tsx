import { Button, EXTERNAL_LINKS, Text } from '@summerfi/app-ui'
import Image from 'next/image'
import Link from 'next/link'

import { basePath } from '@/helpers/base-path'
import { useOnboarding } from '@/helpers/use-onboarding'

export const BridgeSwapOnboarding = () => {
  const [, setAsOnboarded] = useOnboarding('SwapWidget')

  return (
    <div>
      <div style={{ textAlign: 'center', paddingLeft: '0 24px' }}>
        <Text variant="h3" style={{ marginTop: '20px' }}>
          Summer.fi Swap & Bridge
        </Text>
        <Image
          src={`${basePath}/img/others/summer-x-lifi-swap.svg`}
          width={202}
          height={80}
          alt="Quickly and securely swap and bridge tokens directly on Summer.fi with our partner LiFi."
        />
        <Text variant="h5" style={{ marginBottom: '12px' }}>
          Say Hello to Summer.fi Swap & Bridge
        </Text>
        <Text
          variant="p3"
          style={{
            padding: '0 12px',
            textAlign: 'center',
            color: 'neutral80',
            marginBottom: '16px',
          }}
        >
          Quickly and securely swap and bridge tokens directly on Summer.fi with our partner LiFi.
          Visit{' '}
          <Link href={EXTERNAL_LINKS.KB.SWAP_FAQ}>Summer.fi Swap FAQ&apos;s to read more →</Link>
        </Text>
      </div>
      <Button style={{ width: '100%' }} onClick={() => setAsOnboarded()}>
        Got it
      </Button>
    </div>
  )
}
