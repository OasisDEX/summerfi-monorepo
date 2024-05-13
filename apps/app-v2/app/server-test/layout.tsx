import { getProductHubData } from '@/server-actions/get-product-hub-data'

const stringifySpace = 2

export default async function ServerTestLayout() {
  const productHubData = await getProductHubData()

  return (
    <div>
      <h1>Server Rendering Test</h1>
      <pre>{JSON.stringify(productHubData, null, stringifySpace)}</pre>
    </div>
  )
}
