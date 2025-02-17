'use client'

import { type Dispatch, type FormEvent, type SetStateAction, useState } from 'react'
import { Button, Icon, Input, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { sdkSupportedChains } from '@summerfi/app-types'
import { isValidUrl, safeParseJson } from '@summerfi/app-utils'
import { type ChainId } from '@summerfi/sdk-common'

import { ModalButton, type ModalButtonProps } from '@/components/molecules/Modal/ModalButton'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { getCookies } from '@/constants/get-cookies'
import { networksById } from '@/constants/networks-list'

const setFork =
  ({
    chainId,
    setUpdating,
  }: {
    chainId: ChainId
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
    const hasCookieSetForNetwork = safeParseJson(getCookies(forksCookieName))[chainId]

    if (!forkUrl && !hasCookieSetForNetwork) {
      return
    }
    setUpdating((prev) => [...prev, chainId])

    fetch('/earn/api/set-fork', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [chainId]: forkUrl,
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
          prev.splice(prev.indexOf(chainId), 1)

          return [...prev]
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error ', error)
        setUpdating((prev) => {
          prev.splice(prev.indexOf(chainId), 1)

          return [...prev]
        })
      })
  }

// resets all if no networkKey is provided
const resetFork =
  ({
    chainId,
    setResetting,
  }: {
    chainId: ChainId | ''
    setResetting: Dispatch<SetStateAction<boolean>>
  }) =>
  () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const hasCookieSetForNetwork = safeParseJson(getCookies(forksCookieName))[chainId]

    if (chainId && !hasCookieSetForNetwork) {
      return
    }

    setResetting(true)
    fetch('/earn/api/set-fork', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        clear: chainId ? chainId.toString() : 'yes :)',
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
    <Button variant="primarySmall" {...props}>
      Set fork
    </Button>
  )
}

const SetForkModalContent = () => {
  const [updating, setUpdating] = useState<number[]>([])
  const [resetting, setResetting] = useState(false)

  if (resetting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
        <Text as="h4" variant="h4colorful">
          🍴 Setup forks
        </Text>
        <div style={{ marginTop: '20px' }}>
          {sdkSupportedChains.map((chainId) => (
            <div key={`Skeleton_${chainId}`} style={{ marginTop: '10px' }}>
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
        {sdkSupportedChains.map((chainId) => {
          const network = networksById[chainId]

          return (
            <div
              key={`Network_${chainId}`}
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
                onSubmit={setFork({ chainId, setUpdating })}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    placeholder={`Fork URL for network ${network.id}`}
                    defaultValue={forkCookies[network.id]}
                    wrapperStyles={{ width: '100%', height: '36px' }}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 50px',
                      height: '36px',
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: 'gray',
                    }}
                    icon={{
                      name: forkCookies[network.id] ? 'tools_kitchen' : 'tools_kitchen_off',
                      size: 20,
                    }}
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
                    {network.label} <Icon iconName="device_floppy" color="gray" size={18} />
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
                    onClick={resetFork({ chainId, setResetting })}
                  >
                    <Icon
                      iconName="tabler_x"
                      color={forkCookies[network.id] ? 'black' : 'gray'}
                      size={18}
                    />
                  </Button>
                </div>
              </form>
            </div>
          )
        })}
      </div>
      <Text as="p" variant="p3semi" style={{ marginTop: '20px', textAlign: 'center' }}>
        Add fork to your wallet on tenderly (not available here)
      </Text>
      <Button
        variant="secondaryLarge"
        style={{ marginTop: '30px' }}
        onClick={resetFork({ chainId: '', setResetting })}
      >
        Reset all forks
      </Button>
      <Button
        variant="secondaryLarge"
        style={{ marginTop: '30px' }}
        onClick={() => window.location.reload()}
      >
        Refresh page to load forks
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
