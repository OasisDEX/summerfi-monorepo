import dayjs from 'dayjs'

// Detect common image MIME types by magic bytes
export const institutionsAdminPanelDetectMimeFromBuffer = (buffer: Buffer | Uint8Array): string => {
  const b = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)

  // PNG
  if (
    b.length > 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a
  ) {
    return 'image/png'
  }
  // JPEG
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return 'image/jpeg'
  }
  // GIF
  if (
    b.length > 6 &&
    b[0] === 0x47 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x38 &&
    (b[4] === 0x37 || b[4] === 0x39) &&
    b[5] === 0x61
  ) {
    return 'image/gif'
  }
  // WEBP (RIFF....WEBP)
  if (
    b.length > 12 &&
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  ) {
    return 'image/webp'
  }
  // SVG (rough check)
  try {
    const head = Buffer.from(b.slice(0, 256) as Uint8Array)
      .toString('utf8')
      .trim()
      .toLowerCase()

    if (head.startsWith('<svg') || head.includes('<svg')) return 'image/svg+xml'
  } catch {
    /* noop */
  }

  return 'application/octet-stream'
}

export const institutionsAdminPanelDisplayRow = (v: unknown, accessor?: string) => {
  if (accessor === 'userSub') {
    const sub = v as string

    return `${sub.slice(0, 4)}...${sub.slice(-4)}`
  }
  if (accessor === 'users') return ''
  if (accessor === 'institutionId') return ''
  if (v === null || v === undefined) return ''
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  if (typeof v === 'object') return JSON.stringify(v)

  return String(v)
}

export const institutionsAdminPanelGetImageDataUrl = (
  buffer: Buffer | Uint8Array,
  mime?: string,
) => {
  const m = mime ?? institutionsAdminPanelDetectMimeFromBuffer(buffer)
  const b64 = (Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)).toString('base64')

  return `data:${m};base64,${b64}`
}

export const institutionsAdminPanelGetLogoSrc = (logoFile: Buffer | null) => {
  if (logoFile) return institutionsAdminPanelGetImageDataUrl(logoFile)

  return null
}
