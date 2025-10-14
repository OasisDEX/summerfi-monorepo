'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import errorImage from '@/public/img/misc/error.png'

export default function GlobalErrorHandler({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname()

  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
    EarnProtocolEvents.errorOccurred({
      page: pathname,
      errorId: `lp-global-error-${error.digest}`,
      errorMessage: `${error.name}${error.digest ? `:${error.digest}` : ''}`,
      digest: error.digest,
    })
  }, [error, pathname])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '3rem',
        marginBottom: '300px',
      }}
    >
      <Image src={errorImage} alt="Error" width={200} height={200} />
      <Text variant="h1" as="div">
        Something went wrong!
      </Text>
      {error.digest && (
        <Text variant="p1semi" as="div">
          If this error persists, please contact support and
          <br />
          provide the following error ID:&nbsp;
          <Text variant="p1semiColorful" as="span" style={{ fontFamily: 'monospace' }}>
            {error.digest}
          </Text>
        </Text>
      )}
      <Link href="/">
        <Button variant="primaryLarge">Go back to the home page</Button>
      </Link>
    </div>
  )
}
