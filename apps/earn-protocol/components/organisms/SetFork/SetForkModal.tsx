'use client'

import { type Dispatch, type FormEvent, type SetStateAction, useState } from 'react'
import { Button, Input, SkeletonLine, Text } from '@summerfi/app-ui'
import { formatToHex } from '@summerfi/app-utils'
import {
  IconDeviceFloppy,
  IconToolsKitchen2,
  IconToolsKitchen2Off,
  IconWallet,
  IconX,
} from '@tabler/icons-react'
import { useAppState, useWallets } from '@web3-onboard/react'
import { type Config } from '@web3-onboard/wagmi'

import { ModalButton, type ModalButtonProps } from '@/components/molecules/Modal/ModalButton'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { getCookies } from '@/constants/get-cookies'
import { networksByName } from '@/constants/networks-list'
import { safeParseJson } from '@/constants/safe-parse-json'
import { isValidUrl } from '@/helpers/is-valid-url'

const setFork =
  ({
    networkKey,
    setUpdating,
  }: {
    networkKey: keyof typeof networksByName
    setUpdating: Dispatch<SetStateAction<number[]>>
  }) =>
  (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const forkUrl = (ev.currentTarget.elements[0] as HTMLInputElement).value

    if (!isValidUrl(forkUrl)) {
      // eslint-disable-next-line no-console
      console.error('Invalid URL')

      return
    }
    const hasCookieSetForNetwork = safeParseJson(getCookies(forksCookieName))[
      networksByName[networkKey].id
    ]

    if (!forkUrl && !hasCookieSetForNetwork) {
      return
    }
    setUpdating((prev) => [...prev, networksByName[networkKey].id])

    const networkId = networksByName[networkKey].id

    fetch('/api/set-fork', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [networkId]: forkUrl,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.text()
      })
      .then((_data) => {
        setUpdating((prev) => {
          prev.splice(prev.indexOf(networksByName[networkKey].id), 1)

          return [...prev]
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error', error)
        setUpdating((prev) => {
          prev.splice(prev.indexOf(networksByName[networkKey].id), 1)

          return [...prev]
        })
      })
  }

// resets all if no networkKey is provided
const resetFork =
  ({
    networkKey,
    setResetting,
  }: {
    networkKey: keyof typeof networksByName | ''
    setResetting: Dispatch<SetStateAction<boolean>>
  }) =>
  () => {
    const network = networksByName[networkKey]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const hasCookieSetForNetwork = safeParseJson(getCookies(forksCookieName))[network?.id]

    if (networkKey && !hasCookieSetForNetwork) {
      return
    }

    setResetting(true)
    fetch('/api/set-fork', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        clear: network?.id ? network?.id.toString() : 'yes :)',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.text()
      })
      .then((_data) => {
        setResetting(false)
      })
      .catch((_error) => {
        setResetting(false)
      })
  }

const SetForkModalButton = (props: ModalButtonProps) => {
  return (
    <Button variant="primarySmall" {...props} style={{ marginTop: '30px' }}>
      Set fork
    </Button>
  )
}

const SetForkModalContent = () => {
  const [updating, setUpdating] = useState<number[]>([])
  const [resetting, setResetting] = useState(false)
  const { wagmiConfig }: { wagmiConfig: Config } = useAppState()
  const [mainWallet] = useWallets()

  const networksListKeys = Object.keys(networksByName).filter(
    (networkKey) => !networksByName[networkKey].testnet,
  )

  const addForkToWallet = (forkId: number) => async () => {
    const forksList = safeParseJson(getCookies(forksCookieName))
    const changedChain = wagmiConfig.chains.find((chain) => chain.id === Number(forkId))
    const forkUrlId = forksList[forkId].split('-')[forksList[forkId].split('-').length - 1]

    if (changedChain) {
      await mainWallet.provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: formatToHex(changedChain.id),
              chainName: `${changedChain.name} (fork: ${forkUrlId})`,
              nativeCurrency: changedChain.nativeCurrency,
              rpcUrls: [forksList[forkId]],
            },
          ],
        })
        .then((resp) => {
          // eslint-disable-next-line no-console
          console.log(`Added fork for ${changedChain.name}`, resp)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error adding fork to wallet', error)
        })
    }
  }

  if (resetting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
        <Text as="h4" variant="h4colorful">
          🍴 Setup forks
        </Text>
        <div style={{ marginTop: '20px' }}>
          {networksListKeys.map((networkKey) => (
            <div key={networkKey} style={{ marginTop: '10px' }}>
              <SkeletonLine height={35} width="100%" />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '30px' }}>
          <SkeletonLine height={65} width="100%" />
        </div>
      </div>
    )
  }
  const forkCookies = safeParseJson(getCookies(forksCookieName))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      <Text as="h4" variant="h4colorful">
        🍴 Setup forks
      </Text>
      <div style={{ overflow: 'auto', marginTop: '20px' }}>
        {networksListKeys.map((networkKey) => {
          const network = networksByName[networkKey]

          return (
            <div
              key={networkKey}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                opacity: updating.includes(network.id) ? 0.5 : 1,
                pointerEvents: updating.includes(network.id) ? 'none' : 'auto',
              }}
            >
              <form
                style={{ marginTop: '10px', width: '100%' }}
                onSubmit={setFork({ networkKey, setUpdating })}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    placeholder={`Fork URL for network ${network.id}`}
                    defaultValue={forkCookies[network.id]}
                    wrapperStyles={{ width: '100%', height: '36px' }}
                    style={{
                      width: '100%',
                      paddingLeft: '50px',
                      height: '36px',
                      fontSize: '14px',
                    }}
                    CustomIcon={forkCookies[network.id] ? IconToolsKitchen2 : IconToolsKitchen2Off}
                  />
                  <Button
                    variant="secondarySmall"
                    style={{
                      minWidth: '30px',
                      width: '160px',
                      padding: '5px',
                      marginLeft: '10px',
                    }}
                    type="submit"
                  >
                    {network.label} <IconDeviceFloppy size={18} />
                  </Button>
                  <Button
                    disabled={!forkCookies[network.id] || !mainWallet}
                    variant={forkCookies[network.id] ? 'primarySmall' : 'neutralSmall'}
                    style={{
                      minWidth: '30px',
                      width: '50px',
                      padding: '5px',
                      marginLeft: '10px',
                    }}
                    onClick={addForkToWallet(network.id)}
                  >
                    <IconWallet size={18} />
                  </Button>
                  <Button
                    disabled={!forkCookies[network.id]}
                    variant={forkCookies[network.id] ? 'primarySmall' : 'neutralSmall'}
                    style={{
                      minWidth: '30px',
                      width: '50px',
                      padding: '5px',
                      marginLeft: '10px',
                    }}
                    onClick={resetFork({ networkKey, setResetting })}
                  >
                    <IconX size={18} />
                  </Button>
                </div>
              </form>
            </div>
          )
        })}
      </div>
      {!mainWallet && (
        <Text
          as="p"
          variant="p3semi"
          style={{ marginTop: '20px', textAlign: 'center', color: 'red' }}
        >
          Connect your wallet to add forks to it.
        </Text>
      )}
      <Button
        variant="secondaryLarge"
        style={{ marginTop: '30px' }}
        onClick={resetFork({ networkKey: '', setResetting })}
      >
        Reset all forks
      </Button>
    </div>
  )
}

export default () => {
  return (
    <ModalButton
      Button={SetForkModalButton}
      ModalContent={SetForkModalContent}
      modalWrapperStyles={{
        width: '600px',
        maxWidth: '600px',
        height: 'auto',
      }}
    />
  )
}
