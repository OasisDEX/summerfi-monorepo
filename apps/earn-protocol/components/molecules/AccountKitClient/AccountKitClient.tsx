import { useSmartAccountClient } from '@alchemy/aa-alchemy/react'

export const AccountKitClient = () => {
  // If this is the first time the hook is called, then the client will be undefined until the underlying account is connected to the client
  const { isLoadingClient, client } = useSmartAccountClient({
    type: 'MultiOwnerModularAccount', // alternatively pass in "LightAccount",
    accountParams: {}, // optional param for overriding any account specific properties
  })

  if (isLoadingClient || !client) {
    return <div>Loading client...</div>
  }

  return (
    <div>
      <h3>Client is ready!</h3>
      <div>{client.account.address}</div>
    </div>
  )
}
