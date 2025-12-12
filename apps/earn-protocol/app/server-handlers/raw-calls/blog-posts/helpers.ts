/* eslint-disable camelcase */
import type { BlogPost, ParsedBlogPost } from './types'

/**
 * Transforms a raw blog post from the Ghost CMS API into a simplified parsed format.
 *
 * Extracts and renames specific fields from the BlogPost type to create a cleaner
 * ParsedBlogPost object with standardized property names.
 *
 * @param blogPost - The raw blog post object from the Ghost CMS API
 * @returns ParsedBlogPost - A simplified blog post object with standardized properties
 */
export const parseBlogPost = ({
  id,
  feature_image,
  published_at,
  reading_time,
  slug,
  title,
  url,
}: BlogPost): ParsedBlogPost => {
  return {
    date: published_at,
    image: feature_image,
    id,
    readingTime: reading_time,
    slug,
    title,
    url,
  }
}
