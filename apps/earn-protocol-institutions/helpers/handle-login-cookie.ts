export const setLoginCookie = async ({
  userWalletAddress,
  loginSignature,
  chainId,
}: {
  userWalletAddress: string
  loginSignature: string
  chainId?: number
}) => {
  return await fetch('/api/set-login-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userWalletAddress,
      loginSignature,
      chainId,
    }),
  })
}

export const deleteLoginCookie = async () => {
  return await fetch('/api/set-login-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      logOut: true, // Indicate that we want to log out and delete the cookie
    }),
  })
}
