export function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B'
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(2) + ' KB'
  } else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(2) + ' MB'
  } else {
    return (bytes / 1073741824).toFixed(2) + ' GB'
  }
}

export function parseRangeHeader(rangeHeader) {
  const prefix = 'bytes='
  if (!rangeHeader || !rangeHeader.startsWith(prefix)) {
    throw new Error('Invalid Range header')
  }

  const [startStr, endStr] = rangeHeader.slice(prefix.length).split('-')
  const start = startStr ? parseInt(startStr, 10) : undefined
  const end = endStr ? parseInt(endStr, 10) : undefined

  if (Number.isNaN(start) || (end !== undefined && Number.isNaN(end))) {
    throw new Error('Invalid Range header')
  }

  return { start, end }
}
