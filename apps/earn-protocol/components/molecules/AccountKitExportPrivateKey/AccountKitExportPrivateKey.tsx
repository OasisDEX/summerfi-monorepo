'use client'
import { type FC } from 'react'
import { type AlchemySigner } from '@alchemy/aa-alchemy'
import { Button } from '@summerfi/app-ui'
import { useMutation } from '@tanstack/react-query'

const TurnkeyExportWalletContainerId = 'turnkey-export-wallet-container-id'
const TurnkeyExportWalletElementId = 'turnkey-export-wallet-element-id'

// This allows us to style the embedded iframe
const iframeCss = `
iframe {
    box-sizing: border-box;
    width: 100%;
    height: 120px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(216, 219, 227, 1);
    padding: 20px;
    background-color: white;
}
`

export const AccountKitExportPrivateKey: FC<{ signer: AlchemySigner }> = ({ signer }) => {
  const {
    mutate: exportWallet,
    isPending,
    data,
  } = useMutation({
    mutationFn: () =>
      signer.exportWallet({
        iframeContainerId: TurnkeyExportWalletContainerId,
        iframeElementId: TurnkeyExportWalletElementId,
      }),
  })

  // Once the user clicks the button, a request will be sent to initialize private key export
  // once the request is complete, the iframe will be rendered with either
  // 1. the private key if the user is logged in with a passkey
  // 2. the seed phrase if the user is logged in with email
  return (
    <div>
      {!data ? (
        <Button variant="primarySmall" onClick={() => exportWallet()} disabled={isPending}>
          Export Wallet
        </Button>
      ) : (
        <strong>Seed Phrase or Private key</strong>
      )}
      <div style={{ display: !data ? 'none' : 'block' }} id={TurnkeyExportWalletContainerId}>
        <style>{iframeCss}</style>
      </div>
    </div>
  )
}
