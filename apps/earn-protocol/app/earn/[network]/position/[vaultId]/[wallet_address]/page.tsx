import { Text } from '@summerfi/app-earn-ui'

type EarnStrategyPreviewPageProps = {
  params: {
    vaultId: string
    wallet_address: string
  }
}

const EarnStrategyViewWalletPage = ({ params }: EarnStrategyPreviewPageProps) => {
  return (
    <Text
      variant="h2"
      style={{ textAlign: 'center', width: '100%', display: 'block', marginBottom: '100px' }}
    >
      This is viewing {params.vaultId}/{params.wallet_address} position
    </Text>
  )
}

export default EarnStrategyViewWalletPage
