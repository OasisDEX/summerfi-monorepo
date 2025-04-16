import { type ToastOptions } from 'react-toastify'

const BASIC_TOAST_CONFIG: ToastOptions = {
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
    fontSize: '14px',
    fontWeight: '600',
    minHeight: '46px',
  },
}

export const SUCCESS_TOAST_CONFIG: ToastOptions = {
  ...BASIC_TOAST_CONFIG,
  style: {
    ...BASIC_TOAST_CONFIG.style,
    backgroundColor: 'var(--earn-protocol-success-10)',
    color: 'var(--earn-protocol-success-100)',
  },
}

export const ERROR_TOAST_CONFIG: ToastOptions = {
  ...BASIC_TOAST_CONFIG,
  style: {
    ...BASIC_TOAST_CONFIG.style,
    backgroundColor: 'var(--earn-protocol-critical-10)',
    color: 'var(--earn-protocol-critical-100)',
  },
}
