'use client' // Error boundaries must be Client Components

import { Button, Text } from '@summerfi/app-earn-ui'

// Scoped error boundary for the admin panel so a failed admin data fetch renders inside the admin
// section (with a retry) instead of falling through to the global full-page error handler.
export default function AdminErrorHandler({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        gap: '2rem',
        padding: '4rem 1rem',
      }}
    >
      <Text variant="h2" as="div">
        Something went wrong in the admin panel
      </Text>
      {error.digest && (
        <Text variant="p2" as="div" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          Error ID: {error.digest}
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
      <Button variant="primaryLarge" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
