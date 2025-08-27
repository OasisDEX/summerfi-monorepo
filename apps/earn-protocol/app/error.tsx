'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button, Text, useUserWallet } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import errorImage from '@/public/img/misc/error.png'

export default function GlobalErrorHandler({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname()
  const { userWalletAddress } = useUserWallet()

  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
    EarnProtocolEvents.errorOccurred({
      page: pathname,
      errorMessage: error.message,
      walletAddress: userWalletAddress,
    })
  }, [error, pathname, userWalletAddress])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        gap: '3rem',
        marginBottom: '2rem',
      }}
    >
      <Image src={errorImage} alt="Error" width={200} height={200} />
      <Text variant="h1" as="div">
        Something went wrong!
      </Text>
      {error.digest && (
        <Text variant="p1" as="div">
          If this error persists, please contact support and
          <br />
          provide the following error ID:
          <br />
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              padding: '10px 30px',
              borderRadius: '5px',
              width: 'min-content',
              margin: '1rem auto 0',
            }}
          >
            <Text
              variant="p2colorful"
              as="span"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
              }}
            >
              {error.digest}
            </Text>
          </div>
        </Text>
      )}
      {process.env.NODE_ENV === 'development' && (
        <pre
          style={{
            textAlign: 'left',
            maxWidth: '90vw',
            fontFamily: 'monospace',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error.stack}
        </pre>
      )}
      <Link href="/">
        <Button variant="primaryLarge">Go back to the home page</Button>
      </Link>
    </div>
  )
}
