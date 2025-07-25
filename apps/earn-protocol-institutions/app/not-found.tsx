import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 'var(--space-xxxxl)',
        marginTop: 'var(--space-xxl)',
      }}
    >
      <Text
        as="h3"
        variant="h3"
        style={{
          marginBottom: 'var(--space-xxl)',
        }}
      >
        Sorry, page not found.
      </Text>
      <Link href="/">
        <Button variant="primaryLarge">Go back to the homepage</Button>
      </Link>
    </div>
  )
}
