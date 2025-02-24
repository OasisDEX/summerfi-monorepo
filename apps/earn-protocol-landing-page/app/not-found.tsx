import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '64px',
        marginBottom: '64px',
      }}
    >
      <Text
        as="h3"
        variant="h3"
        style={{
          marginBottom: '64px',
        }}
      >
        Sorry, page not found!
      </Text>
      <Link href="/">
        <Button variant="primaryLarge">Go back to the homepage</Button>
      </Link>
    </div>
  )
}
