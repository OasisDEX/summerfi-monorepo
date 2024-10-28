import { Text } from '@summerfi/app-earn-ui'

type EarnVaultPreviewPageProps = {
  params: {
    vaultId: string
    wallet_address: string
  }
}

const EarnVaultViewWalletPage = ({ params }: EarnVaultPreviewPageProps) => {
  return (
    <Text
      variant="h2"
      style={{ textAlign: 'center', width: '100%', display: 'block', marginBottom: '100px' }}
    >
      This is viewing {params.vaultId}/{params.wallet_address} position
    </Text>
  )
}

export default EarnVaultViewWalletPage
