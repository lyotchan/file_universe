// pages/api/download.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { resource_path } from '@/lib/constants/index'
export default async function downloadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const filename: Array<string> = Array.isArray(req.query.filename)
      ? req.query.filename
      : []

    if (!filename.length) {
      return res.status(400).json({ error: 'File not found' })
    }
    const filePath = path.join(...resource_path, ...filename)
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' })
      return
    }
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    console.log(range)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1
      const file = fs.createReadStream(filePath, { start, end })

      res.writeHead(206, {
        'Content-Disposition': `attachment;filename*=UTF-8''${encodeURIComponent(
          filename.pop() || ''
        )}`,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'application/octet-stream'
      })

      file.pipe(res)
    } else {
      res.writeHead(200, {
        'Content-Disposition': `attachment;filename*=UTF-8''${encodeURIComponent(
          filename.pop() || ''
        )}`,
        'Content-Length': fileSize,
        'Content-Type': 'application/octet-stream'
      })

      fs.createReadStream(filePath).pipe(res)
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const config = {
  api: {
    responseLimit: false
  }
}
