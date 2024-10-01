import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 'var(--space-xxl)',
        marginBottom: 'var(--space-xxxxl)',
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
