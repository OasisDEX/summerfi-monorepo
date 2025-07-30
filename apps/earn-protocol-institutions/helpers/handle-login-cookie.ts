export const setLoginCookie = async ({
  userWalletAddress,
  loginSignature,
}: {
  userWalletAddress: string
  loginSignature: string
}) => {
  return await fetch('/api/set-login-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userWalletAddress,
      loginSignature,
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
