export const fetchContentfulGraphQL = async <T>(query: string, preview = false): Promise<T> => {
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const previewAccessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN

  return await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview ? previewAccessToken : accessToken}`,
      },
      body: JSON.stringify({ query }),
    },
  ).then((response) => response.json() as T)
}
