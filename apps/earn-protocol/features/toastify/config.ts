import { type ToastOptions } from 'react-toastify'

export const BASIC_TOAST_CONFIG: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  style: {
    fontFamily: 'var(--font-inter)',
  },
}
