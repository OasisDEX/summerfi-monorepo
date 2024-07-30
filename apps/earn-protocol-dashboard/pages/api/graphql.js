import dotenv from 'dotenv'

dotenv.config()
const GRAPHQL_ENDPOINT = `${process.env.SUBGRAPH_BASE}/summer-protocol-base`

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })

      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error proxying GraphQL request:', error)
      res.status(500).json({ error: 'Error proxying GraphQL request' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
