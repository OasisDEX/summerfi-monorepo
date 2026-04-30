'use client'

import { type FC, useState } from 'react'
import { useAuthModal, useExportAccount, useSignerStatus } from '@account-kit/react'

import { AlchemyMigrateProvider } from './AlchemyMigrateProvider'

import classNames from './WalletMigratePageView.module.css'

const IFRAME_CONTAINER_ID = 'alchemy-export-iframe-container'

const walletGuides = [
  {
    name: 'MetaMask',
    steps: [
      'Open MetaMask and click the account selector at the top.',
      'Click "Add account or hardware wallet".',
      'Choose "Import account".',
      'Paste the private key or seed phrase shown above and click "Import".',
    ],
    docsUrl:
      'https://support.metamask.io/managing-my-wallet/accounts-and-addresses/how-to-import-an-account/',
  },
  {
    name: 'Rabby',
    steps: [
      'Open Rabby and click the profile icon → "Add address".',
      'Select "Import private key" (or "Import seed phrase").',
      'Paste the key shown above and click "Confirm".',
    ],
    docsUrl: 'https://rabby.io/',
  },
]

const ExportStep: FC = () => {
  const { exportAccount, isExporting, isExported, error, ExportAccountComponent } =
    useExportAccount({
      params: { iframeContainerId: IFRAME_CONTAINER_ID },
    })

  return (
    <div className={classNames.exportStep}>
      <h2 className={classNames.stepTitle}>Step 2 — Export your private key</h2>
      <p className={classNames.stepDescription}>
        Click the button below. Alchemy will open a secure iframe that displays your private key or
        seed phrase — this value is assembled on a separate origin and is never visible to
        Summer.fi.
      </p>

      <div className={classNames.warningBox}>
        <strong>Important:</strong> The exported key belongs to the <strong>EOA signer</strong>{' '}
        (your base account). If you previously had a smart contract account on Summer.fi, your
        positions may sit at a different address. You can still control them by importing this key
        and signing directly.
      </div>

      {!isExported && (
        <button
          className={classNames.primaryButton}
          onClick={() => exportAccount()}
          disabled={isExporting}
        >
          {isExporting ? 'Preparing export…' : 'Show my private key / seed phrase'}
        </button>
      )}

      {error && <p className={classNames.errorText}>{error.message}</p>}

      {/* Alchemy renders the key inside this container via a cross-origin iframe */}
      <div
        id={IFRAME_CONTAINER_ID}
        className={classNames.iframeContainer}
        style={{ display: isExported ? 'block' : 'none' }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {ExportAccountComponent && <ExportAccountComponent isExported={isExported} />}
      </div>

      {isExported && (
        <div className={classNames.importGuides}>
          <h3 className={classNames.guidesTitle}>Step 3 — Import into your wallet</h3>
          {walletGuides.map((guide) => (
            <div key={guide.name} className={classNames.guideCard}>
              <h4 className={classNames.guideName}>{guide.name}</h4>
              <ol className={classNames.guideSteps}>
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <a
                className={classNames.guideLink}
                href={guide.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Full guide →
              </a>
            </div>
          ))}

          <div className={classNames.doneBox}>
            <p>
              Once imported, return to{' '}
              <a href="/earn" className={classNames.inlineLink}>
                Summer.fi
              </a>{' '}
              and connect with your wallet of choice.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const LoginStep: FC = () => {
  const { openAuthModal } = useAuthModal()
  const { isConnected, isAuthenticating } = useSignerStatus()

  if (isConnected) {
    return <ExportStep />
  }

  return (
    <div className={classNames.loginStep}>
      <h2 className={classNames.stepTitle}>Step 1 — Sign in with your old account</h2>
      <p className={classNames.stepDescription}>
        Use the same email address, Google account, or passkey you used when you first created your
        Summer.fi wallet.
      </p>
      <button
        className={classNames.primaryButton}
        onClick={openAuthModal}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? 'Connecting…' : 'Sign in with Alchemy Account Kit'}
      </button>
    </div>
  )
}

interface WalletMigratePageViewProps {
  accountKitApiKey: string
}

export const WalletMigratePageView: FC<WalletMigratePageViewProps> = ({ accountKitApiKey }) => {
  const [accepted, setAccepted] = useState(false)

  return (
    <AlchemyMigrateProvider accountKitApiKey={accountKitApiKey}>
      <div className={classNames.pageWrapper}>
        <div className={classNames.contentCard}>
          <h1 className={classNames.pageTitle}>Recover your embedded wallet</h1>
          <p className={classNames.pageIntro}>
            If you previously signed in to Summer.fi using <strong>email</strong>,{' '}
            <strong>Google</strong>, or a <strong>passkey</strong> via Alchemy Account Kit, your
            wallet key is stored in Alchemy&apos;s secure enclave. This page lets you export that
            key so you can import it into MetaMask, Rabby, or any other self-custody wallet and
            continue using Summer.fi.
          </p>

          {!accepted ? (
            <div className={classNames.disclaimer}>
              <p>
                By proceeding you acknowledge that you are solely responsible for safely storing the
                private key or seed phrase that will be shown. Summer.fi cannot recover it for you.
              </p>
              <button className={classNames.primaryButton} onClick={() => setAccepted(true)}>
                I understand, continue
              </button>
            </div>
          ) : (
            <LoginStep />
          )}
        </div>
      </div>
    </AlchemyMigrateProvider>
  )
}
