import { SumrPageView } from '@/components/layout/SumrPageView/SumrPageView'

export const revalidate = 60

const SumrPage = () => {
  const sumrPrice = '4.67'

  return <SumrPageView sumrPrice={sumrPrice} />
}

export default SumrPage
