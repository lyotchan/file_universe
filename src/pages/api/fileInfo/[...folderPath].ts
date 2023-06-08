import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import mime from 'mime-types'
import ffmpegStatic from 'ffmpeg-static'
import { resource_path } from '@/lib/constants/index'

import type { FileType, cacheType } from '@/lib/types'

if (ffmpegStatic === null) {
  throw new Error('ffmpegStatic is null')
}
// 设置 ffmpeg 路径
ffmpeg.setFfmpegPath(ffmpegStatic)

const videoExt = ['.mp4', '.webm', '.mkv', '.avi']
const cacheFile = './public/thumbnailCache.json'
const cache: cacheType = loadCache()
function loadCache() {
  try {
    if (fs.existsSync(cacheFile)) {
      const data = fs.readFileSync(cacheFile, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading cache:', error)
  }
  return {}
}

function saveCache(cache: cacheType) {
  try {
    const data = JSON.stringify(cache, null, 2)
    fs.writeFileSync(cacheFile, data, 'utf-8')
  } catch (error) {
    console.error('Error saving cache:', error)
  }
}

const getPreviewUrl = async (
  filePath: string,
  fileName: string,
  isDir: boolean
): Promise<string> => {
  if (isDir) {
    // 文件夹图标
    return '/imgs/filefolder.png'
  }

  const cacheId = filePath
  // 如果预览图已经存在，直接返回 URL
  if (cache[cacheId]) {
    console.log('Using cached thumbnail')
    return cache[cacheId]
  }

  const fileExt = path.extname(filePath).toLowerCase()
  const outputDir = './public/previews'
  const previewPath = path.join(outputDir, `${fileName}.jpg`)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  // 处理图片预览图
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
    await sharp(filePath).resize(200).toFile(previewPath)
    cache[cacheId] = `/previews/${fileName}.jpg`
    saveCache(cache)
    return `/previews/${fileName}.jpg`
  }
  // 处理视频预览图
  if (videoExt.includes(fileExt)) {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .screenshots({
          timestamps: ['00:00:03.000'],
          filename: `${fileName}.jpg`,
          folder: outputDir,
          size: '200x?'
        })
        .on('end', () => {
          cache[cacheId] = `/previews/${fileName}.jpg`
          saveCache(cache)
          resolve(`/previews/${fileName}.jpg`)
        })
        .on('error', err => reject(err))
    })
  }

  // 处理其他文件类型的预览图，返回一个占位符图片
  return '/imgs/file.png'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const folderPath = req.query.folderPath as string[]
  console.log('url', req.url)
  const folderFullPath = path.join(...resource_path, ...folderPath.slice(1)) // 你想要读取的文件夹路径，可以根据需要调整

  try {
    const fileNames = fs.readdirSync(folderFullPath)
    const fileInfoListPromises = fileNames.map(async fileName => {
      const filePath = path.join(folderFullPath, fileName)
      const stats = fs.statSync(filePath),
        isDir = stats.isDirectory()
      const previewUrl = await getPreviewUrl(filePath, fileName, isDir)
      const fileExt = path.extname(fileName).toLowerCase()
      const mimeType = mime.lookup(fileExt)
      return {
        name: fileName,
        isDirectory: isDir,
        size: stats.size,
        previewUrl,
        isVideo: videoExt.includes(fileExt),
        isImage: !!mimeType && mimeType.startsWith('image/')
      }
    })

    try {
      const fileInfoList = await Promise.all(fileInfoListPromises)
      res.status(200).json(fileInfoList)
    } catch (e) {
      console.log(e)
      e instanceof Error
        ? res.status(500).json({ message: e.message })
        : res.status(500).json({ message: 'unkown error at fileInfo api' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error reading folder' })
  }
}
