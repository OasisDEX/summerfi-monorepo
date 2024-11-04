interface ShareButtonPropsWithParts {
  hashtags?: string
  link?: never
  text?: string
  url: string
  via?: string
}

/**
 * Generates a Twitter share URL with customizable parameters for sharing a URL, hashtags, text, and source.
 *
 * @param params - The parameters for the Twitter share URL.
 * @param params.hashtags - Optional hashtags to include in the tweet (comma-separated).
 * @param params.text - Optional text to include in the tweet.
 * @param params.url - The URL to share on Twitter.
 * @param params.via - Optional Twitter username to attribute the tweet to.
 *
 * @returns A Twitter share URL string that can be used to open a tweet compose window with the specified options.
 *
 * @example
 * getTwitterShareUrl({ url: 'https://example.com', text: 'Check this out!', via: 'exampleUser', hashtags: 'news,tech' });
 * // Returns 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com&text=Check%20this%20out!&via=exampleUser&hashtags=news%2Ctech'
 */

export const getTwitterShareUrl = ({
  hashtags,
  text,
  url,
  via = 'summerfinance_',
}: ShareButtonPropsWithParts): string => {
  return `https://twitter.com/intent/tweet?${new URLSearchParams({
    url,
    ...(hashtags && { hashtags }),
    ...(text && { text }),
    ...(via && { via }),
  }).toString()}`
}
