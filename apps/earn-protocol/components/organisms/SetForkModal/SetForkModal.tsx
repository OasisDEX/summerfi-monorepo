'use client'

import { type Dispatch, type FormEvent, type SetStateAction, useState } from 'react'
import { Button, Input, Text } from '@summerfi/app-ui'

import { ModalButton, type ModalButtonProps } from '@/components/molecules/Modal/ModalButton'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { getCookies } from '@/constants/get-cookies'
import { networksByName } from '@/constants/networks-list'
import { safeParseJson } from '@/constants/safe-parse-json'

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
      .then((response) => response.text())
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

const resetForks = (setResetting: Dispatch<SetStateAction<boolean>>) => () => {
  setResetting(true)
  fetch('/api/set-fork', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clear: 'yes :)',
    }),
  })
    .then((response) => response.text())
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
        {Object.keys(networksByName).map((networkKey) => {
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
              <form style={{ marginTop: '10px' }} onSubmit={setFork({ networkKey, setUpdating })}>
                <Text>{network.label}</Text>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Input
                    placeholder={`Fork URL for network ${network.id}`}
                    defaultValue={forkCookies[network.id]}
                    style={{ width: '400px' }}
                  />
                  <Button
                    variant="secondaryLarge"
                    style={{ minWidth: '80px', marginLeft: '10px' }}
                    type="submit"
                  >
                    Set
                  </Button>
                </div>
              </form>
            </div>
          )
        })}
      </div>
      <Button
        variant="primaryLarge"
        style={{ marginTop: '20px' }}
        onClick={resetForks(setResetting)}
      >
        Reset all forks
      </Button>
    </div>
  )
}

export const SetForkModal = () => {
  return (
    <ModalButton
      Button={SetForkModalButton}
      ModalContent={SetForkModalContent}
      modalWrapperStyles={{
        width: '600px',
        maxWidth: '600px',
      }}
    />
  )
}
