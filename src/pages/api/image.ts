// pages/api/image.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import { resource_path } from '@/lib/constants/index'
export default function getImage(req: NextApiRequest, res: NextApiResponse) {
  const { imagePath } = req.query

  if (typeof imagePath !== 'string' || !imagePath) {
    res.status(400).json({ error: 'Image path is required.' })
    return
  }

  const filePath = path.join(...resource_path, imagePath)

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Image not found.' })
    return
  }

  const mimeType = mime.lookup(filePath)

  if (!mimeType || !mimeType.startsWith('image/')) {
    res.status(400).json({ error: 'Invalid file type.' })
    return
  }

  const data = fs.readFileSync(filePath)
  res.setHeader('Content-Type', mimeType)
  res.end(data)
}
