export const fetchContentfulGraphQL = async <T>(query: string, preview = false): Promise<T> => {
  try {
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
    const previewAccessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN

    const response = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${preview ? previewAccessToken : accessToken}`,
        },
        body: JSON.stringify({ query }),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch data from Contentful')
    }

    return (await response.json()) as T
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(
      'Error in fetchContentfulGraphQL',
      error,
      'accessing:',
      process.env.CONTENTFUL_ACCESS_TOKEN,
      process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      process.env.CONTENTFUL_SPACE_ID,
    )

    throw error
  }
}
