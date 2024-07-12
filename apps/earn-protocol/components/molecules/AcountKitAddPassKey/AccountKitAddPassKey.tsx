import { useAddPasskey } from '@alchemy/aa-alchemy/react'
import { Button } from '@summerfi/app-ui'

export function AccountKitAddPassKey() {
  /**
   * Assumes the app has context of a signer with an authenticated user
   * by using the `AlchemyAccountProvider` from `@alchemy/aa-alchemy/react`.
   */
  const { addPasskey } = useAddPasskey({
    onSuccess: (authenticatorIds) => {
      // eslint-disable-next-line no-console
      console.log('AccountKitAddPassKey authenticatorIds', authenticatorIds)
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('AccountKitAddPassKey error', error)
    },
  })

  return (
    <div>
      <Button variant="primarySmall" onClick={() => addPasskey()}>
        Add Passkey
      </Button>
    </div>
  )
}
