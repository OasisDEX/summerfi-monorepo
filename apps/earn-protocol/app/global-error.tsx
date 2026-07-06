'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button, GlobalStyles, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { fontInter } from '@/helpers/fonts'

import errorImage from '@/public/img/misc/error.png'

// Rendered only when the ROOT layout itself throws (e.g. a remote config outage) — Next.js
// requires this file to render its own <html>/<body> since app/layout.tsx never mounted.
// Keep this minimal (no hooks that depend on providers from GlobalProvider/MasterPage, and no
// mixpanel event tracking, since none of that context is available here) but styled consistently
// with app/error.tsx.
export default function GlobalErrorHandler({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#1c1c1c' }}>
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontInter.className} ${fontInter.variable}`}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '3rem',
            margin: '4rem auto',
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
          <Button variant="primaryLarge" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
}
