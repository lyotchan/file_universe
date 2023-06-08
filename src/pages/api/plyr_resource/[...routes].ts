import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import { resource_path } from '@/lib/constants/index'
import { parseRangeHeader } from '@/lib/utils/converts'
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const range = req.headers.range
  if (!range) {
    return res.status(400).json({ message: 'range header is required' })
  }
  const { routes } = req.query
  const { start = 0, end: last } = parseRangeHeader(range)
  const endParam =
    last && last - start < 2 * 1024 * 1024 - 1
      ? last
      : start + 2 * 1024 * 1024 - 1
  const videoPath = path.join(...resource_path, ...(routes as string[])) // Adjust according to your video file's location

  const videoStat = fs.statSync(videoPath)
  const end = endParam < videoStat.size - 1 ? endParam : videoStat.size - 1

  console.log((end - start + 1) / 1024 / 1024)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  const contentType = mime.lookup(videoPath) || 'application/octet-stream'
  const head = {
    'Content-Range': `bytes ${start}-${end}/${videoStat.size}`,
    'Accept-Ranges': 'bytes',
    'Content-Type': contentType
  }
  res.setHeader('Content-Length', end - start + 1)
  res.writeHead(206, head)

  videoStream.pipe(res)
}
export const config = {
  api: {
    responseLimit: false
  }
}
