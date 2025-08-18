/* eslint-disable no-console */

/**
 * USE THIS ONLY FOR SERVER-SIDE ERRORS
 */
export const serverOnlyErrorHandler = (
  errorSource: string,
  errorMessage: string,
  additionalParams?: { [key: string]: unknown },
): void => {
  console.error(`Error in ${errorSource}:
  Environment stack:
  ${JSON.stringify(
    {
      NODE_ENV: process.env.NODE_ENV,
      RPC_GATEWAY: process.env.RPC_GATEWAY,
      SDK_API_URL: process.env.SDK_API_URL,
      FUNCTIONS_API_URL: process.env.FUNCTIONS_API_URL,
      CONFIG_URL: process.env.CONFIG_URL,
      CONFIG_URL_EARN: process.env.CONFIG_URL_EARN,
      ...additionalParams,
    },
    null,
    2,
  )}`)
  console.error(`Error in ${errorSource}: ${errorMessage}`)

  throw new Error(errorMessage)
}
