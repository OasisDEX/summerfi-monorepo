/**
 * A promise that resolves after one second.
 * Used to wait for transak dialog to be rendered
 * This is used to wait for the Transak dialog to be rendered.
 *
 * @type {Promise<void>}
 */
export const waitTransakOneSecond: Promise<void> = new Promise<void>((resolve) => {
  setTimeout(resolve, 1000)
})
