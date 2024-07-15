import { type ChangeEvent, useState } from 'react'
import { useSmartAccountClient } from '@alchemy/aa-alchemy/react'
import { Button, Input } from '@summerfi/app-ui'
import { type Address } from '@summerfi/serverless-shared'

import { accountType } from '@/providers/AlchemyAccountsProvider/config'

export const AccountKitAddOwner = () => {
  const [owner, setOwner] = useState<Address>()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string>()
  const { client } = useSmartAccountClient({
    type: accountType,
  })

  if (!client) {
    return null
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.value as Address)
  }

  const handleUpdate = async () => {
    try {
      if (owner) {
        setIsLoading(true)
        const result = await client.updateOwners({
          // first array - owners to add
          // second array - owners to remove
          args: [[owner], []],
        })

        const _txHash = await client.waitForUserOperationTransaction(result)

        // eslint-disable-next-line no-console
        console.log('Update owner txHash', _txHash)
        setTxHash(_txHash)
        setIsLoading(false)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Adding owner error', e)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Input value={owner} onChange={handleChange} placeholder="Additional owner address" />
      <Button variant="primarySmall" onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? 'Adding' : 'Add'} Backup Owner
        {txHash && <p>TxHash: {txHash}</p>}
      </Button>
    </div>
  )
}
