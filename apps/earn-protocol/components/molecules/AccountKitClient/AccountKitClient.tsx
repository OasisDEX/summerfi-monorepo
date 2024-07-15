import { useEffect, useState } from 'react'
import { useSmartAccountClient } from '@alchemy/aa-alchemy/react'

import { accountType } from '@/providers/AlchemyAccountsProvider/config'

export const AccountKitClient = () => {
  // If this is the first time the hook is called, then the client will be undefined until the underlying account is connected to the client
  const { isLoadingClient, client, ...rest } = useSmartAccountClient({
    type: accountType,
    accountParams: {
      // here it's possible to use different modular account address if given user is added to it as owner
      // we will probably need to fetch list of user accounts using subgraph and update owner events
      // accountAddress: '0x430837e2ac6e18D3c8c773010B3E6786FeAbA4C9',
    }, // optional param for overriding any account specific properties
  })
  const [owners, setOwners] = useState<string[]>([])

  useEffect(() => {
    if (client) {
      // eslint-disable-next-line no-console
      console.log('client', client)
      // eslint-disable-next-line no-console
      console.log('rest', rest)
      void client.readOwners().then((_owners) => setOwners(_owners as string[]))
    }
  }, [client?.account.address])

  if (isLoadingClient || !client) {
    return <div>Loading client...</div>
  }

  return (
    <div>
      <h3>Client is ready! (modular account)</h3>
      <span>Smart account will be deployed with first user operation</span>
      <div>{client.account.address}</div>
      {!!owners.length && (
        <div>
          <h4>Owners:</h4>
          <ul>
            {owners.map((owner) => (
              <li key={owner}>{owner}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
