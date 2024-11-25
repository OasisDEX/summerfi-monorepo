// used to wait for transak dialog to be rendered
export const waitTransakOneSecond = new Promise<void>((resolve) => {
  setTimeout(resolve, 1000)
})
