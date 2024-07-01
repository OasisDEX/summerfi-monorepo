import { Button, EXTERNAL_LINKS, Text } from '@summerfi/app-ui'
import Image from 'next/image'
import Link from 'next/link'

import { basePath } from '@/helpers/base-path'
import { useOnboarding } from '@/helpers/use-onboarding'

export const BridgeSwapOnboarding = () => {
  const [, setAsOnboarded] = useOnboarding('SwapWidget')

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          marginTop: '30px',
        }}
      >
        <Text variant="h4" as="h4" style={{ marginBottom: '30px' }}>
          Summer.fi Swap & Bridge
        </Text>
        <Image
          src={`${basePath}/img/others/summer-x-lifi-swap.svg`}
          width={202}
          height={80}
          alt="Quickly and securely swap and bridge tokens directly on Summer.fi with our partner LiFi."
          style={{ marginBottom: '30px' }}
        />
        <Text variant="h5" as="h5" style={{ marginBottom: '12px' }}>
          Say Hello to Summer.fi Swap & Bridge
        </Text>
        <Text
          variant="p3"
          as="p"
          style={{
            padding: '0 12px',
            textAlign: 'center',
            color: 'neutral80',
          }}
        >
          Quickly and securely swap and bridge tokens directly on Summer.fi with our partner LiFi.
          <br />
          Visit{' '}
          <Link href={EXTERNAL_LINKS.KB.SWAP_FAQ}>Summer.fi Swap FAQ&apos;s to read more →</Link>
        </Text>
      </div>
      <Button
        variant="primaryLarge"
        style={{ width: '80%', display: 'block', margin: '30px auto 0 auto' }}
        onClick={() => setAsOnboarded()}
      >
        Got it
      </Button>
    </div>
  )
}
