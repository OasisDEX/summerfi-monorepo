import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'

type PortfolioPageProps = {
  params: {
    wallet_address: string
  }
}

const PortfolioPage = ({ params }: PortfolioPageProps) => {
  return <PortfolioPageView walletAddress={params.wallet_address} />
}

export default PortfolioPage
